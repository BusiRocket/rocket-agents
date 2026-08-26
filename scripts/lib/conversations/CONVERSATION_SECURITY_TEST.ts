import assert from 'node:assert/strict'
import test from 'node:test'
import { isConversationRecord } from './isConversationRecord'
import { redactSensitiveText } from './redactSensitiveText'

void test('secret redaction covers credentials without logging their values', () => {
  const fakeAccessKey = 'AKIA' + 'ABCDEFGHIJKLMNOP'
  const result = redactSensitiveText(
    `Authorization: Bearer abcdefghijklmnopqrstuvwxyz password=supersecret ${fakeAccessKey} https://user:pass@example.test`,
  )

  assert.equal(result.redactions, 4)
  assert.equal(result.text.includes('supersecret'), false)
  assert.equal(result.text.includes(fakeAccessKey), false)
  assert.equal(result.text.includes('user:pass'), false)
})

void test('import validation rejects traversal paths', () => {
  assert.equal(
    isConversationRecord({
      schemaVersion: 1,
      id: 'id',
      source: 'codex',
      sourceId: 'source',
      title: 'title',
      events: [],
      provenance: {
        contentSha256: 'hash',
        relativePath: '../../credentials',
        redactions: 0,
      },
    }),
    false,
  )
})
