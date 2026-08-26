import type { McpTarget } from '../types/McpTarget'

export const EMPTY_OWNED: Record<McpTarget, string[]> = {
  'claude-personal': [],
  'claude-favish': [],
  codex: [],
  gemini: [],
  cursor: [],
}
