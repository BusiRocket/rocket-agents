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

void test('editor UI state is not exported as a conversation', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'rocket-agents-trae-'))
  const path = join(directory, 'state.vscdb')
  const database = new DatabaseSync(path)
  database.exec('CREATE TABLE ItemTable(key TEXT PRIMARY KEY, value TEXT)')
  const insert = database.prepare('INSERT INTO ItemTable VALUES (?, ?)')
  // Observed on 2026-08-31: the mention picker's selected item ids matched the
  // `%chat%` key filter and shipped as a two-event conversation.
  insert.run(
    'icube-ai-chat-storage-mention-search-selected-itemIds',
    JSON.stringify(['rule', 'code']),
  )
  insert.run(
    'workbench.panel.aichat.chatdata',
    JSON.stringify({ messages: [{ role: 'user', text: 'real question' }] }),
  )
  database.close()

  try {
    const artifact: ConversationArtifact = {
      path,
      relativePath: 'Trae/User/workspaceStorage/test/state.vscdb',
      source: 'trae',
      storage: 'sqlite',
    }
    const documents = readSqliteConversationDocuments(artifact)
    const texts = documents
      .map((document) => conversationRecordFromDocument(document))
      .flatMap((record) => record?.events.map(({ text }) => text) ?? [])
    assert.deepEqual(texts, ['real question'])
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
