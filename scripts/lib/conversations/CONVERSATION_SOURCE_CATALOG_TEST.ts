import assert from 'node:assert/strict'
import test from 'node:test'
import { CONVERSATION_SOURCES } from './constants/CONVERSATION_SOURCES'
import { isSupportedSourceArtifact } from './isSupportedSourceArtifact'
import { sourceDefinitions } from './sourceDefinitions'
import { sqliteConversationQuery } from './sqliteConversationQuery'

void test('the source catalog covers the union of both reference projects', () => {
  assert.deepEqual(
    sourceDefinitions
      .map((source) => source.id)
      .toSorted((left, right) => left.localeCompare(right)),
    [...CONVERSATION_SOURCES].toSorted((left, right) =>
      left.localeCompare(right),
    ),
  )
  assert.equal(new Set(sourceDefinitions.map((source) => source.id)).size, 13)
})

void test('SQLite extraction is restricted to known conversation-bearing tables', () => {
  assert.match(
    sqliteConversationQuery('ItemTable', 'trae') ?? '',
    /conversation/u,
  )
  assert.match(
    sqliteConversationQuery('part', 'opencode') ?? '',
    /SELECT rowid/u,
  )
  assert.equal(sqliteConversationQuery('cookies', 'cursor'), undefined)
  assert.equal(sqliteConversationQuery('auth', 'cursor'), undefined)
})

void test('OpenCode desktop discovery accepts only Tauri store files', () => {
  const definition = sourceDefinitions.find(({ id }) => id === 'opencode')
  assert.ok(definition)
  assert.equal(
    isSupportedSourceArtifact(
      definition,
      '.local/share/ai.opencode.app',
      'tauri',
    ),
    true,
  )
  assert.equal(
    isSupportedSourceArtifact(
      definition,
      '.local/share/ai.opencode.app',
      'json',
    ),
    false,
  )
})
