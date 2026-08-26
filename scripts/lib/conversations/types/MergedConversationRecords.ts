import type { ConversationRecord } from './ConversationRecord'

export interface MergedConversationRecords {
  records: ConversationRecord[]
  added: number
  duplicates: number
  updated: number
}
