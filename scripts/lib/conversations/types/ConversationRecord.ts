import type { ConversationEvent } from './ConversationEvent'
import type { ConversationProvenance } from './ConversationProvenance'
import type { ConversationSource } from './ConversationSource'

export interface ConversationRecord {
  schemaVersion: 1 | 2
  id: string
  source: ConversationSource
  sourceId: string
  title: string
  events: ConversationEvent[]
  provenance: ConversationProvenance
  startedAt?: string
  updatedAt?: string
  workspace?: string
}
