import { join } from 'node:path'
import type { McpTarget } from '../domains/mcp/types/McpTarget'

export const resolveTargetPaths = (
  home: string,
): Record<McpTarget, string> => ({
  'claude-personal': join(home, '.claude.json'),
  'claude-favish': join(home, '.claude-favish', '.claude.json'),
  codex: join(home, '.codex', 'config.toml'),
  gemini: join(home, '.gemini', 'settings.json'),
  cursor: join(home, '.cursor', 'mcp.json'),
})
