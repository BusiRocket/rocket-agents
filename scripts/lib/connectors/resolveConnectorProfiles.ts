import type { ConnectorProfile } from './types/ConnectorProfile'

export const resolveConnectorProfiles = (
  requested: string | undefined,
): ConnectorProfile[] => {
  if (requested === 'personal' || requested === 'claude-personal')
    return ['claude-personal']
  if (requested === 'favish' || requested === 'claude-favish')
    return ['claude-favish']
  if (requested === 'codex') return ['codex']
  return ['claude-personal', 'claude-favish', 'codex']
}
