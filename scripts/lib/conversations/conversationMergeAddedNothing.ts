import { serializeCanonicalConversationRecord } from './serializeCanonicalConversationRecord'
import type { ConversationRecord } from './types/ConversationRecord'

/**
 * Whether merging a fragment into a stored record taught the store nothing.
 *
 * The pairwise merge cannot recognise a constituent it has already absorbed:
 * the merged hash is a hash of hashes, so the same fragment arriving again
 * never equals it, and every import between two archives reported every
 * shared conversation as updated forever. What decides is the content: the
 * same title, workspace, events and known paths after the merge is a
 * duplicate, whatever the provenance hash says.
 */
export const conversationMergeAddedNothing = (
  current: ConversationRecord,
  merged: ConversationRecord,
) => {
  const comparable = (record: ConversationRecord) =>
    serializeCanonicalConversationRecord({
      ...record,
      provenance: {
        contentSha256: '',
        relativePath: record.provenance.relativePath,
        redactions: 0,
      },
    })
  return comparable(current) === comparable(merged)
}
