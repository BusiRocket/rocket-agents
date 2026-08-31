import type { ConversationRecord } from './ConversationRecord'

/** One observed revision of one conversation, as it appears inside a segment. */
export interface ConversationFragmentEntry {
  kind: 'conversation-fragment'
  conversationId: string
  fragmentSha256: string
  record: ConversationRecord
}
