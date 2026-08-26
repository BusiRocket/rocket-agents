import assert from 'node:assert/strict'
import { promises as fs } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, sep } from 'node:path'
import test from 'node:test'
import { captureConversations } from './captureConversations'

void test('capture normalizes Claude and Codex sessions while redacting secrets', async (context) => {
  const home = await fs.mkdtemp(join(tmpdir(), 'rocket-conversations-capture-'))
  context.after(async () => fs.rm(home, { recursive: true, force: true }))
  const claudeRoot = join(home, '.claude', 'projects', 'project-a')
  const codexRoot = join(home, '.codex', 'sessions', '2026', '08', '19')
  await fs.mkdir(claudeRoot, { recursive: true })
  await fs.mkdir(codexRoot, { recursive: true })

  await fs.writeFile(
    join(claudeRoot, 'claude-session.jsonl'),
    [
      JSON.stringify({
        type: 'user',
        sessionId: 'claude-1',
        timestamp: '2026-08-19T08:00:00Z',
        cwd: join(home, 'p', 'project-a'),
        message: { role: 'user', content: 'Fix the deployment' },
      }),
      JSON.stringify({
        type: 'assistant',
        sessionId: 'claude-1',
        timestamp: '2026-08-19T08:01:00Z',
        message: {
          role: 'assistant',
          content: ['password', 'supersecretvalue'].join('='),
        },
      }),
    ].join('\n'),
  )
  await fs.writeFile(
    join(codexRoot, 'rollout-session.jsonl'),
    [
      JSON.stringify({
        type: 'session_meta',
        payload: { id: 'codex-1', cwd: join(home, 'p', 'project-a') },
      }),
      JSON.stringify({
        type: 'response_item',
        timestamp: '2026-08-19T09:00:00Z',
        payload: { type: 'message', role: 'user', content: 'Run the tests' },
      }),
      JSON.stringify({
        type: 'response_item',
        timestamp: '2026-08-19T09:01:00Z',
        payload: {
          type: 'function_call',
          name: 'exec_command',
          arguments: 'pnpm check',
        },
      }),
    ].join('\n'),
  )

  const report = await captureConversations(
    home,
    new Set(['claude-code', 'codex']),
  )

  assert.equal(report.ok, true)
  assert.equal(report.records.length, 2)
  const claude = report.records.find(
    (record) => record.source === 'claude-code',
  )
  const codex = report.records.find((record) => record.source === 'codex')
  if (claude === undefined || codex === undefined)
    throw new Error('expected both source records')
  assert.equal(claude.sourceId, 'claude-1')
  assert.equal(claude.title, 'Fix the deployment')
  assert.equal(claude.provenance.redactions, 1)
  assert.match(claude.events[1]?.text ?? '', /\[REDACTED:secret\]/u)
  assert.equal(codex.sourceId, 'codex-1')
  assert.equal(
    codex.events.some((event) => event.kind === 'tool-call'),
    true,
  )
  assert.equal(codex.workspace, `[HOME]${sep}p${sep}project-a`)
})

void test('capture ignores credential stores, caches, and SQLite sidecars', async (context) => {
  const home = await fs.mkdtemp(
    join(tmpdir(), 'rocket-conversations-exclusions-'),
  )
  context.after(async () => fs.rm(home, { recursive: true, force: true }))
  const root = join(home, '.claude', 'projects', 'project-a')
  await fs.mkdir(join(root, 'tool-results'), { recursive: true })
  await fs.writeFile(
    join(root, 'tool-results', 'secret.json'),
    '{"message":"do not ingest"}',
  )
  await fs.writeFile(join(root, 'session.jsonl-wal'), 'not a transcript')

  const report = await captureConversations(home, new Set(['claude-code']))

  assert.equal(report.records.length, 0)
  assert.equal(report.sources[0]?.artifacts, 0)
})

void test('capture fails closed on malformed conversation JSON', async (context) => {
  const home = await fs.mkdtemp(
    join(tmpdir(), 'rocket-conversations-malformed-'),
  )
  context.after(async () => fs.rm(home, { recursive: true, force: true }))
  const root = join(home, '.continue', 'sessions')
  await fs.mkdir(root, { recursive: true })
  await fs.writeFile(join(root, 'broken.json'), '{not-json')

  const report = await captureConversations(home, new Set(['continue']))

  assert.equal(report.ok, false)
  assert.equal(report.records.length, 0)
  assert.match(report.skipped[0] ?? '', /invalid conversation JSON/u)
})
