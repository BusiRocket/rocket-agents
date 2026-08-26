import { discoverSourceDefinitionArtifacts } from './discoverSourceDefinitionArtifacts'
import { sourceDefinitions } from './sourceDefinitions'
import type { ConversationArtifact } from './types/ConversationArtifact'
import type { ConversationSource } from './types/ConversationSource'

export const discoverConversationArtifacts = async (
  home: string,
  selectedSources?: ReadonlySet<ConversationSource>,
) => {
  const artifacts: ConversationArtifact[] = []

  for (const definition of sourceDefinitions) {
    if (selectedSources !== undefined && !selectedSources.has(definition.id))
      continue

    artifacts.push(
      ...(await discoverSourceDefinitionArtifacts(home, definition)),
    )
  }

  const unique = new Map<string, ConversationArtifact>()
  for (const artifact of artifacts)
    unique.set(`${artifact.source}:${artifact.path}`, artifact)
  return [...unique.values()].toSorted((left, right) =>
    left.path.localeCompare(right.path),
  )
}
