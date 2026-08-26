import type { McpValue } from '../../domains/mcp/types/McpValue'

export const toStringArgs = (
  args: McpValue[] | undefined,
  appended: string[],
) => [
  ...(args ?? []).filter((value): value is string => typeof value === 'string'),
  ...appended,
]
