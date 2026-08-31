import { chmodSync } from 'node:fs'
import { DatabaseSync } from 'node:sqlite'
import { mergeConversationRecordFragments } from './mergeConversationRecordFragments'
import type { ConversationRecord } from './types/ConversationRecord'
import type { ConversationStoreChange } from './types/ConversationStoreChange'

export class ConversationCaptureStore {
  readonly #database: DatabaseSync
  readonly #find
  readonly #upsert

  constructor(path: string) {
    this.#database = new DatabaseSync(path)
    chmodSync(path, 0o600)
    this.#database.exec(
      'CREATE TABLE records(id TEXT PRIMARY KEY, record_json TEXT NOT NULL, redactions INTEGER NOT NULL) STRICT',
    )
    this.#find = this.#database.prepare(
      'SELECT record_json FROM records WHERE id = ?',
    )
    this.#upsert = this.#database.prepare(
      'INSERT INTO records(id, record_json, redactions) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET record_json = excluded.record_json, redactions = excluded.redactions',
    )
  }

  mergeFragment(record: ConversationRecord): ConversationStoreChange {
    const existing = this.#find.get(record.id)
    if (existing === undefined || typeof existing.record_json !== 'string') {
      this.#upsert.run(
        record.id,
        JSON.stringify(record),
        record.provenance.redactions,
      )
      return 'added'
    }
    const current = JSON.parse(existing.record_json) as ConversationRecord
    if (current.provenance.contentSha256 === record.provenance.contentSha256)
      return 'duplicate'
    const merged = mergeConversationRecordFragments(current, record)
    this.#upsert.run(
      merged.id,
      JSON.stringify(merged),
      merged.provenance.redactions,
    )
    return 'updated'
  }

  /**
   * Overwrite rather than merge. Kept for a caller that genuinely knows the
   * incoming record supersedes the stored one; merging is what an exchange
   * between two archives needs, because there neither side supersedes the
   * other and the later arrival is not the better one.
   */
  replace(record: ConversationRecord): ConversationStoreChange {
    const existing = this.#find.get(record.id)
    if (existing === undefined || typeof existing.record_json !== 'string') {
      this.#upsert.run(
        record.id,
        JSON.stringify(record),
        record.provenance.redactions,
      )
      return 'added'
    }
    const current = JSON.parse(existing.record_json) as ConversationRecord
    if (current.provenance.contentSha256 === record.provenance.contentSha256)
      return 'duplicate'
    this.#upsert.run(
      record.id,
      JSON.stringify(record),
      record.provenance.redactions,
    )
    return 'updated'
  }

  *serializedRecords() {
    const statement = this.#database.prepare(
      'SELECT record_json FROM records ORDER BY id',
    )
    for (const row of statement.iterate()) {
      if (typeof row.record_json === 'string') yield row.record_json
    }
  }

  count() {
    const row = this.#database
      .prepare('SELECT count(*) AS total FROM records')
      .get()
    return typeof row?.total === 'number' ? row.total : 0
  }

  redactions() {
    const row = this.#database
      .prepare('SELECT coalesce(sum(redactions), 0) AS total FROM records')
      .get()
    return typeof row?.total === 'number' ? row.total : 0
  }

  close() {
    this.#database.close()
  }
}
