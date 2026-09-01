import assert from 'node:assert/strict'
import { promises as fs } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { CONVERSATION_CAPTURE_FIXTURE_SOURCES } from './fixtures/CONVERSATION_CAPTURE_FIXTURE_SOURCES'
import { exportConversationFixtureArchive } from './fixtures/exportConversationFixtureArchive'
import { migrateConversationArchiveToSegments } from './migrateConversationArchiveToSegments'
import { publishConversationCapture } from './publishConversationCapture'
import { verifyConversationSegmentArchive } from './verifyConversationSegmentArchive'

void test('a v1 archive becomes a chunked base, never one object', async (context) => {
  const { archive } = await exportConversationFixtureArchive(context)
  const root = await fs.mkdtemp(join(tmpdir(), 'conversation-migrated-'))
  context.after(async () => fs.rm(root, { recursive: true, force: true }))

  const migrated = await migrateConversationArchiveToSegments({
    archive,
    root,
    createdAt: '2026-08-31T23:00:00.000Z',
    buckets: 4,
  })
  assert.equal(migrated.fragments, 5)
  assert.equal(migrated.duplicates, 0)
  assert.equal(migrated.segments.length > 1, true)

  const verified = await verifyConversationSegmentArchive({ root })
  assert.equal(verified.ok, true)
  assert.deepEqual(verified.problems, [])
  assert.equal(verified.conversations, 5)
  assert.equal(verified.baseSegments, migrated.segments.length)
  assert.equal(verified.generationId, migrated.generationId)
})

void test('two hosts migrating the same archive derive the same generation', async (context) => {
  const { archive } = await exportConversationFixtureArchive(context)
  const roots = await Promise.all([
    fs.mkdtemp(join(tmpdir(), 'conversation-migrated-a-')),
    fs.mkdtemp(join(tmpdir(), 'conversation-migrated-b-')),
  ])
  context.after(async () => {
    for (const root of roots)
      await fs.rm(root, { recursive: true, force: true })
  })
  const [here, there] = roots

  const first = await migrateConversationArchiveToSegments({
    archive,
    root: here,
    createdAt: '2026-08-31T23:00:00.000Z',
    buckets: 4,
  })
  const second = await migrateConversationArchiveToSegments({
    archive,
    root: there,
    createdAt: '2026-08-31T23:00:00.000Z',
    buckets: 4,
  })
  assert.equal(second.generationId, first.generationId)

  const digests = await Promise.all(
    roots.map(async (root) => verifyConversationSegmentArchive({ root })),
  )
  assert.deepEqual(digests[1]?.digests, digests[0]?.digests)
})

void test('capturing the same sources into a migrated archive publishes nothing', async (context) => {
  const { home, archive } = await exportConversationFixtureArchive(context)
  const root = join(home, 'segments')
  await migrateConversationArchiveToSegments({
    archive,
    root,
    createdAt: '2026-08-31T23:00:00.000Z',
    buckets: 4,
  })

  const captured = await publishConversationCapture({
    home,
    root,
    statePath: join(home, 'state.sqlite3'),
    sources: CONVERSATION_CAPTURE_FIXTURE_SOURCES,
    createdAt: '2026-09-01T09:00:00.000Z',
  })
  // Migration is lossless in the direction that matters here: the fragments a
  // fresh capture produces are the fragments the base already contains, so the
  // first refresh after a migration is not a second full publication.
  assert.equal(captured.metrics.fragmentsAppended, 0)
  assert.deepEqual(captured.segments, [])
})
