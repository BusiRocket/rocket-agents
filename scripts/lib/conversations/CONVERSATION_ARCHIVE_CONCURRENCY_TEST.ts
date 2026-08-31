import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { ConversationArchiveChangedError } from './ConversationArchiveChangedError'
import { createArchiveRecord } from './fixtures/createArchiveRecord'
import { importConversationExport } from './importConversationExport'
import { readArchiveRevision } from './readArchiveRevision'
import type { ConversationRecord } from './types/ConversationRecord'
import { withArchiveWriteLock } from './withArchiveWriteLock'
import { writeConversationExport } from './writeConversationExport'

void test('an import refuses to publish over an archive that moved under it', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'archive-concurrency-'))
  try {
    const archive = join(directory, 'archive.jsonl')
    const first = join(directory, 'first.jsonl')
    const second = join(directory, 'second.jsonl')
    await writeConversationExport([createArchiveRecord('a')], archive)
    await writeConversationExport([createArchiveRecord('b')], first)
    await writeConversationExport([createArchiveRecord('c')], second)

    // Stand in for the other writer: it lands while this import is merging,
    // which is exactly the window a long merge leaves open.
    const before = await readArchiveRevision(archive)
    await importConversationExport({ input: second, archive, apply: true })
    assert.notEqual(await readArchiveRevision(archive), before)

    // The import that merged from the older revision must not publish, and
    // must not have removed the conversation the other writer added.
    // Reproduce a merge that began before the archive changed.
    await assert.rejects(
      withArchiveWriteLock(archive, async () => {
        if ((await readArchiveRevision(archive)) !== before)
          throw new ConversationArchiveChangedError(archive)
      }),
      /changed while it was being merged/,
    )
    const after = await importConversationExport({
      input: first,
      archive,
      apply: false,
    })
    assert.equal(after.total, 3)
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})

void test('the publication lock is released even when publication fails', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'archive-lock-'))
  try {
    const archive = join(directory, 'archive.jsonl')
    await assert.rejects(
      withArchiveWriteLock(archive, () => Promise.reject(new Error('boom'))),
      /boom/,
    )
    // A lock left behind would block every later import until it went stale.
    assert.equal(
      await withArchiveWriteLock(archive, () => Promise.resolve(1)),
      1,
    )
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})

void test('exchanging two revisions of one conversation loses neither side', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'archive-merge-'))
  try {
    const archive = join(directory, 'archive.jsonl')
    const remote = join(directory, 'remote.jsonl')
    const mine: ConversationRecord = {
      ...createArchiveRecord('shared'),
      events: [
        { id: 'e1', kind: 'message', role: 'user', text: 'one' },
        { id: 'e2', kind: 'message', role: 'assistant', text: 'only mine' },
      ],
      provenance: { contentSha256: 'mine', relativePath: 'a', redactions: 0 },
    }
    const theirs: ConversationRecord = {
      ...createArchiveRecord('shared'),
      events: [
        { id: 'e1', kind: 'message', role: 'user', text: 'one' },
        { id: 'e3', kind: 'message', role: 'assistant', text: 'only theirs' },
      ],
      provenance: { contentSha256: 'theirs', relativePath: 'b', redactions: 0 },
    }
    await writeConversationExport([mine], archive)
    await writeConversationExport([theirs], remote)

    const result = await importConversationExport({
      input: remote,
      archive,
      apply: true,
    })
    assert.equal(result.updated, 1)

    const lines = (await readFile(archive, 'utf8')).trim().split('\n')
    const merged = JSON.parse(lines[1] ?? '{}') as ConversationRecord
    assert.deepEqual(
      merged.events
        .map((event) => event.id)
        .toSorted((a, b) => a.localeCompare(b)),
      ['e1', 'e2', 'e3'],
      'the event only this host had must survive the import',
    )
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})
