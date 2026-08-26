import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import test from 'node:test'
import { probeZeroHedgeBoundary } from './probeZeroHedgeBoundary'

void test('a healthy service with an OAuth MCP challenge reaches the target boundary', async () => {
  const server = createServer((request, response) => {
    if (request.url === '/healthz') {
      response.end('ok')
      return
    }
    response.statusCode = 401
    response.end()
  })
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
  const address = server.address()
  assert.ok(address && typeof address === 'object')
  const result = await probeZeroHedgeBoundary(
    `http://127.0.0.1:${String(address.port)}`,
  )
  server.close()
  assert.equal(result.status, 'auth-required')
  assert.equal(result.boundary, 'target')
})

void test('an unhealthy service stops before MCP protocol probing', async () => {
  const server = createServer((_request, response) => {
    response.statusCode = 503
    response.end('private upstream output')
  })
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
  const address = server.address()
  assert.ok(address && typeof address === 'object')
  const result = await probeZeroHedgeBoundary(
    `http://127.0.0.1:${String(address.port)}`,
  )
  server.close()
  assert.equal(result.status, 'failed')
  assert.equal(result.httpCode, 503)
  assert.equal(
    JSON.stringify(result).includes('private upstream output'),
    false,
  )
})
