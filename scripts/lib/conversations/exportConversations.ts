import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { captureConversationArtifacts } from './captureConversationArtifacts'
import { ConversationCaptureStore } from './ConversationCaptureStore'
import type { ConversationSource } from './types/ConversationSource'
import { writeConversationExportFromStore } from './writeConversationExportFromStore'

export const exportConversations = async (
  home: string,
  output: string,
  selectedSources?: ReadonlySet<ConversationSource>,
) => {
  const directory = await mkdtemp(
    join(tmpdir(), 'rocket-agents-conversation-export-'),
  )
  const store = new ConversationCaptureStore(join(directory, 'capture.sqlite'))
  try {
    const report = await captureConversationArtifacts(
      home,
      selectedSources,
      (record) => {
        store.mergeFragment(record)
      },
    )
    if (!report.ok) return { report }
    const redactions = store.redactions()
    return {
      report,
      redactions,
      manifest: await writeConversationExportFromStore(store, output),
    }
  } finally {
    store.close()
    await rm(directory, { recursive: true, force: true })
  }
}
