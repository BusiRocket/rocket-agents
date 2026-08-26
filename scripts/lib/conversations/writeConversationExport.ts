import { promises as fs } from 'node:fs'
import { dirname } from 'node:path'
import { CONVERSATION_SCHEMA_VERSION } from './constants/CONVERSATION_SCHEMA_VERSION'
import { hashText } from './hashText'
import { serializeConversationRecords } from './serializeConversationRecords'
import type { ConversationExportManifest } from './types/ConversationExportManifest'
import type { ConversationRecord } from './types/ConversationRecord'

export const writeConversationExport = async (
  records: ConversationRecord[],
  output: string,
  now = new Date(),
) => {
  const payload = serializeConversationRecords(records)
  const manifest: ConversationExportManifest = {
    kind: 'rocket-agents-conversation-export',
    schemaVersion: CONVERSATION_SCHEMA_VERSION,
    createdAt: now.toISOString(),
    records: records.length,
    contentSha256: hashText(payload),
  }
  const temporary = `${output}.tmp-${String(process.pid)}`
  await fs.mkdir(dirname(output), { recursive: true, mode: 0o700 })
  await fs.writeFile(temporary, `${JSON.stringify(manifest)}\n${payload}`, {
    mode: 0o600,
  })
  await fs.rename(temporary, output)
  return manifest
}
