import type { McpState } from '../types/McpState'

export const EMPTY_STATE: McpState = {
  byTarget: {
    'claude-personal': {},
    'claude-favish': {},
    codex: {},
    gemini: {},
    cursor: {},
  },
}
