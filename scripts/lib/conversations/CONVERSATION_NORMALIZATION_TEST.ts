import assert from 'node:assert/strict'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import test from 'node:test'
import { conversationRecordFromDocument } from './conversationRecordFromDocument'
import { mergeConversationRecordFragments } from './mergeConversationRecordFragments'
import { readSqliteConversationDocuments } from './readSqliteConversationDocuments'
import type { ConversationArtifact } from './types/ConversationArtifact'

void test('VS Code-family adapters normalize tabbed chat data', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'rocket-agents-windsurf-'))
  const path = join(directory, 'state.vscdb')
  const database = new DatabaseSync(path)
  database.exec('CREATE TABLE ItemTable(key TEXT PRIMARY KEY, value TEXT)')
  database.prepare('INSERT INTO ItemTable VALUES (?, ?)').run(
    'cascade.chatdata',
    JSON.stringify({
      tabs: [
        {
          bubbles: [
            { type: 1, rawText: 'question' },
            { type: 2, text: 'answer' },
          ],
        },
      ],
    }),
  )
  database.close()

  try {
    const artifact: ConversationArtifact = {
      path,
      relativePath: 'Windsurf/User/workspaceStorage/test/state.vscdb',
      source: 'windsurf',
      storage: 'sqlite',
    }
    const [document] = readSqliteConversationDocuments(artifact)
    assert.ok(document)
    const record = conversationRecordFromDocument(document)
    assert.deepEqual(
      record?.events.map(({ role, text }) => ({ role, text })),
      [
        { role: 'user', text: 'question' },
        { role: 'assistant', text: 'answer' },
      ],
    )
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})

void test('conversation fragments with the same source session retain every event', () => {
  const first = conversationRecordFromDocument({
    contents: JSON.stringify({
      sessionID: 'session-1',
      role: 'user',
      text: 'first',
    }),
    relativePath: 'part/first.json',
    source: 'opencode',
    sourceIdHint: 'first',
  })
  const second = conversationRecordFromDocument({
    contents: JSON.stringify({
      sessionID: 'session-1',
      role: 'assistant',
      text: 'second',
    }),
    relativePath: 'part/second.json',
    source: 'opencode',
    sourceIdHint: 'second',
  })
  assert.ok(first)
  assert.ok(second)
  assert.deepEqual(
    mergeConversationRecordFragments(first, second).events.map(
      ({ text }) => text,
    ),
    ['first', 'second'],
  )
})
