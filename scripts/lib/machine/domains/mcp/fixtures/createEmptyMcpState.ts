import type { McpState } from "../types/McpState"

export const createEmptyMcpState = (): McpState => ({
  byTarget: {
    "claude-personal": {},
    "claude-favish": {},
    codex: {},
    gemini: {},
    cursor: {},
  },
})
