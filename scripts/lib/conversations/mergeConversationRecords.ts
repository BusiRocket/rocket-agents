import type { ConversationRecord } from './types/ConversationRecord'
import type { MergedConversationRecords } from './types/MergedConversationRecords'

export const mergeConversationRecords = (
  existing: ConversationRecord[],
  incoming: ConversationRecord[],
): MergedConversationRecords => {
  const merged = new Map(existing.map((record) => [record.id, record]))
  let added = 0
  let duplicates = 0
  let updated = 0

  for (const record of incoming) {
    const current = merged.get(record.id)
    if (current === undefined) added++
    else if (
      current.provenance.contentSha256 === record.provenance.contentSha256
    )
      duplicates++
    else updated++
    merged.set(record.id, record)
  }
  return { records: [...merged.values()], added, duplicates, updated }
}
