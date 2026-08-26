import { probeHttpMcp } from './probeHttpMcp'
import type { HttpProbeResult } from './types/HttpProbeResult'

export const probeZeroHedgeBoundary = async (
  publicBaseUrl: string,
  timeoutMs = 5_000,
): Promise<HttpProbeResult> => {
  const startedAt = performance.now()
  try {
    const healthUrl = new URL('/healthz', publicBaseUrl)
    const health = await fetch(healthUrl, {
      signal: AbortSignal.timeout(timeoutMs),
    })
    if (!health.ok) {
      return {
        status: 'failed',
        boundary: 'target',
        httpCode: health.status,
        durationMs: Math.round(performance.now() - startedAt),
        summary: 'ZeroHedge service health endpoint is unavailable',
      }
    }
    return await probeHttpMcp(
      new URL('/mcp', publicBaseUrl).toString(),
      timeoutMs,
    )
  } catch (error) {
    const cause = (error as { cause?: { code?: unknown } }).cause
    const code = typeof cause?.code === 'string' ? cause.code : ''
    return {
      status: 'failed',
      boundary: 'network',
      durationMs: Math.round(performance.now() - startedAt),
      summary: code.includes('CERT')
        ? 'ZeroHedge TLS validation failed'
        : 'ZeroHedge endpoint is unreachable',
    }
  }
}
