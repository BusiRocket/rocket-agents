import { hashText } from './hashText'
import type { ConversationRecord } from './types/ConversationRecord'

export const mergeConversationRecordFragments = (
  left: ConversationRecord,
  right: ConversationRecord,
): ConversationRecord => {
  if (
    left.id !== right.id ||
    left.source !== right.source ||
    left.sourceId !== right.sourceId
  ) {
    throw new Error('cannot merge unrelated conversation fragments')
  }
  const events = new Map(left.events.map((event) => [event.id, event]))
  for (const event of right.events) events.set(event.id, event)
  const hashes = [
    left.provenance.contentSha256,
    right.provenance.contentSha256,
  ].toSorted((a, b) => a.localeCompare(b))
  const relativePaths = [
    left.provenance.relativePath,
    right.provenance.relativePath,
  ].toSorted((a, b) => a.localeCompare(b))
  const timestamps = [...events.values()]
    .flatMap((event) =>
      event.timestamp === undefined ? [] : [event.timestamp],
    )
    .toSorted((a, b) => a.localeCompare(b))
  const startedAt = timestamps.at(0) ?? left.startedAt ?? right.startedAt
  const updatedAt = timestamps.at(-1) ?? right.updatedAt ?? left.updatedAt
  const workspace = left.workspace ?? right.workspace

  return {
    ...left,
    events: [...events.values()],
    provenance: {
      contentSha256: hashText(hashes.join('\0')),
      relativePath: relativePaths.join(','),
      redactions: left.provenance.redactions + right.provenance.redactions,
    },
    ...(startedAt === undefined ? {} : { startedAt }),
    ...(updatedAt === undefined ? {} : { updatedAt }),
    ...(workspace === undefined ? {} : { workspace }),
  }
}
