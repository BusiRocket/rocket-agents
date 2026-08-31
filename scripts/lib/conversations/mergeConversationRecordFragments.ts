import { hashText } from './hashText'
import type { ConversationRecord } from './types/ConversationRecord'

export const mergeConversationRecordFragments = (
  first: ConversationRecord,
  second: ConversationRecord,
): ConversationRecord => {
  if (
    first.id !== second.id ||
    first.source !== second.source ||
    first.sourceId !== second.sourceId
  ) {
    throw new Error('cannot merge unrelated conversation fragments')
  }
  // Ordered canonically before anything is read off either side, so merging
  // is commutative: two hosts exchanging the same pair of revisions have to
  // reach the same record, whichever one arrives first. Fields taken from a
  // single side -- title, workspace -- would otherwise depend on argument
  // order, and so would the merged event order.
  const [left, right] =
    first.provenance.contentSha256.localeCompare(
      second.provenance.contentSha256,
    ) <= 0
      ? [first, second]
      : [second, first]
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

  // Sorted rather than left-then-right: the union is the same either way, but
  // the sequence a reader sees should not depend on which fragment arrived
  // first. Events without a timestamp keep a stable place by id.
  const ordered = [...events.values()].toSorted((a, b) => {
    const byTime = (a.timestamp ?? '').localeCompare(b.timestamp ?? '')
    return byTime === 0 ? a.id.localeCompare(b.id) : byTime
  })

  return {
    ...left,
    events: ordered,
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
