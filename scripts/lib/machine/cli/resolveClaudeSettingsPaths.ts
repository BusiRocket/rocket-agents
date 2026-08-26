import { join } from 'node:path'
import type { ClaudeSettingsPaths } from '../domains/security/types/ClaudeSettingsPaths'

export const resolveClaudeSettingsPaths = (
  home: string,
): ClaudeSettingsPaths => ({
  'claude-personal': join(home, '.claude', 'settings.json'),
  'claude-favish': join(home, '.claude-favish', 'settings.json'),
})
