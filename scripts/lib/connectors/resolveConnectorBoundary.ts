import type { ProfileConnectorResult } from './types/ProfileConnectorResult'

export const resolveConnectorBoundary = (
  connectorId: string,
): ProfileConnectorResult['boundary'] => {
  if (connectorId === 'zerohedge') return 'hosted-connector'
  if (connectorId === 'openseo') return 'access-gateway'
  return 'client'
}
