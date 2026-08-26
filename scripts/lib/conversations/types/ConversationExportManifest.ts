export interface ConversationExportManifest {
  kind: 'rocket-agents-conversation-export'
  schemaVersion: 1
  createdAt: string
  records: number
  contentSha256: string
}
