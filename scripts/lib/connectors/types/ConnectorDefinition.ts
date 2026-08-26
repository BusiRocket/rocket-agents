import type { ConnectorProfile } from './ConnectorProfile'

export interface ConnectorDefinition {
  id: string
  match: string
  profiles: ConnectorProfile[]
  ownership: 'machine' | 'account'
  probe: 'native-cli' | 'claude-cli-prefix' | 'http-mcp'
  criticality: 'required' | 'optional'
  endpoint?: string
}
