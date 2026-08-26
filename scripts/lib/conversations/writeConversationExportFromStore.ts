import { once } from 'node:events'
import { createWriteStream, promises as fs } from 'node:fs'
import { dirname } from 'node:path'
import { finished } from 'node:stream/promises'
import { CONVERSATION_SCHEMA_VERSION } from './constants/CONVERSATION_SCHEMA_VERSION'
import type { ConversationCaptureStore } from './ConversationCaptureStore'
import { hashSerializedConversationRecords } from './hashSerializedConversationRecords'
import type { ConversationExportManifest } from './types/ConversationExportManifest'

export const writeConversationExportFromStore = async (
  store: ConversationCaptureStore,
  output: string,
  now = new Date(),
) => {
  const manifest: ConversationExportManifest = {
    kind: 'rocket-agents-conversation-export',
    schemaVersion: CONVERSATION_SCHEMA_VERSION,
    createdAt: now.toISOString(),
    records: store.count(),
    contentSha256: hashSerializedConversationRecords(store),
  }
  const temporary = `${output}.tmp-${String(process.pid)}`
  await fs.mkdir(dirname(output), { recursive: true, mode: 0o700 })
  const stream = createWriteStream(temporary, { mode: 0o600, flags: 'wx' })
  try {
    stream.write(`${JSON.stringify(manifest)}\n`)
    for (const record of store.serializedRecords()) {
      if (!stream.write(`${record}\n`)) await once(stream, 'drain')
    }
    stream.end()
    await finished(stream)
    await fs.rename(temporary, output)
    return manifest
  } catch (error) {
    stream.destroy()
    await fs.rm(temporary, { force: true })
    throw error
  }
}
