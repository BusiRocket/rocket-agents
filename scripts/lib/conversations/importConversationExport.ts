import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { backupConversationArchive } from './backupConversationArchive'
import { ConversationCaptureStore } from './ConversationCaptureStore'
import { loadConversationExportStore } from './loadConversationExportStore'
import type { ConversationImportResult } from './types/ConversationImportResult'
import { writeConversationExportFromStore } from './writeConversationExportFromStore'

export const importConversationExport = async (options: {
  input: string
  archive: string
  apply: boolean
  now?: Date
}): Promise<ConversationImportResult> => {
  const directory = await mkdtemp(
    join(tmpdir(), 'rocket-agents-conversation-import-'),
  )
  const store = new ConversationCaptureStore(join(directory, 'capture.sqlite'))
  try {
    try {
      const existing = await loadConversationExportStore(options.archive, store)
      if (existing.errors.length > 0) {
        return {
          ok: false,
          applied: false,
          added: 0,
          duplicates: 0,
          updated: 0,
          total: 0,
          archive: options.archive,
          errors: existing.errors.map((error) => `existing archive: ${error}`),
        }
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
    }

    const changes = { added: 0, duplicate: 0, updated: 0 }
    const incoming = await loadConversationExportStore(
      options.input,
      store,
      changes,
    )
    if (incoming.errors.length > 0) {
      return {
        ok: false,
        applied: false,
        added: 0,
        duplicates: 0,
        updated: 0,
        total: 0,
        archive: options.archive,
        errors: incoming.errors,
      }
    }

    let backup: string | undefined
    if (options.apply) {
      backup = await backupConversationArchive(
        options.archive,
        options.now ?? new Date(),
      )
      await writeConversationExportFromStore(
        store,
        options.archive,
        options.now,
      )
    }
    return {
      ok: true,
      applied: options.apply,
      added: changes.added,
      duplicates: changes.duplicate,
      updated: changes.updated,
      total: store.count(),
      archive: options.archive,
      ...(backup === undefined ? {} : { backup }),
      errors: [],
    }
  } finally {
    store.close()
    await rm(directory, { recursive: true, force: true })
  }
}
