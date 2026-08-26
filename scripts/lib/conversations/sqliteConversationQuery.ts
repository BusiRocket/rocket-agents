import type { ConversationSource } from './types/ConversationSource'

export const sqliteConversationQuery = (
  table: string,
  source: ConversationSource,
) => {
  if (source === 'cursor' && table === 'cursorDiskKV') return undefined
  if (source === 'cursor' && table === 'ItemTable') return undefined
  if (['ItemTable', 'cursorDiskKV'].includes(table)) {
    return `SELECT rowid AS record_id, key, CAST(value AS TEXT) AS value FROM "${table}" WHERE lower(key) LIKE '%chat%' OR lower(key) LIKE '%conversation%' OR lower(key) LIKE '%composer%' OR lower(key) LIKE '%agent%' OR lower(key) LIKE '%flow%' OR lower(key) LIKE '%cascade%' OR lower(key) LIKE '%prompt%' OR lower(key) LIKE '%generation%'`
  }
  if (['message', 'part', 'session'].includes(table)) {
    return `SELECT rowid AS record_id, * FROM "${table}"`
  }
  return undefined
}
