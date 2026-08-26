import assert from 'node:assert/strict'
import { promises as fs } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { ConversationCaptureStore } from './ConversationCaptureStore'
import { createConversationRecord } from './fixtures/createConversationRecord'
import { importConversationExport } from './importConversationExport'
import { readConversationExport } from './readConversationExport'
import { writeConversationExport } from './writeConversationExport'
import { writeConversationExportFromStore } from './writeConversationExportFromStore'

void test('exports carry a verified manifest and reject tampering', async (context) => {
  const root = await fs.mkdtemp(join(tmpdir(), 'rocket-conversations-export-'))
  context.after(async () => fs.rm(root, { recursive: true, force: true }))
  const output = join(root, 'export.jsonl')
  await writeConversationExport(
    [createConversationRecord()],
    output,
    new Date('2026-08-19T10:00:00Z'),
  )

  const valid = await readConversationExport(output)
  assert.deepEqual(valid.errors, [])
  assert.equal(valid.records.length, 1)
  assert.equal(valid.manifest?.createdAt, '2026-08-19T10:00:00.000Z')

  await fs.appendFile(output, '{}\n')
  const tampered = await readConversationExport(output)
  assert.equal(
    tampered.errors.includes('export content hash does not match the manifest'),
    true,
  )
})

void test('streamed exports preserve manifests without retaining the archive in memory', async (context) => {
  const root = await fs.mkdtemp(join(tmpdir(), 'rocket-conversations-stream-'))
  context.after(async () => fs.rm(root, { recursive: true, force: true }))
  const store = new ConversationCaptureStore(join(root, 'capture.sqlite'))
  const output = join(root, 'export.jsonl')
  try {
    store.mergeFragment(createConversationRecord())
    await writeConversationExportFromStore(
      store,
      output,
      new Date('2026-08-19T10:00:00Z'),
    )
  } finally {
    store.close()
  }

  const valid = await readConversationExport(output)
  assert.deepEqual(valid.errors, [])
  assert.equal(valid.records.length, 1)
  assert.equal(valid.manifest?.records, 1)
})

void test('imports are dry-run by default and back up an existing archive on apply', async (context) => {
  const root = await fs.mkdtemp(join(tmpdir(), 'rocket-conversations-import-'))
  context.after(async () => fs.rm(root, { recursive: true, force: true }))
  const input = join(root, 'input.jsonl')
  const archive = join(root, 'archive.jsonl')
  const record = createConversationRecord()
  await writeConversationExport(
    [record],
    input,
    new Date('2026-08-19T10:00:00Z'),
  )

  const dryRun = await importConversationExport({
    input,
    archive,
    apply: false,
  })
  assert.equal(dryRun.applied, false)
  await assert.rejects(fs.access(archive))

  const first = await importConversationExport({
    input,
    archive,
    apply: true,
    now: new Date('2026-08-19T10:01:00Z'),
  })
  assert.equal(first.added, 1)
  assert.equal(first.backup, undefined)

  const second = await importConversationExport({
    input,
    archive,
    apply: true,
    now: new Date('2026-08-19T10:02:00Z'),
  })
  assert.equal(second.duplicates, 1)
  assert.notEqual(second.backup, undefined)
  await fs.access(second.backup ?? '')
})
