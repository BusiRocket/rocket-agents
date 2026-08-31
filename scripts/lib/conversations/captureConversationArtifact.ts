import { conversationRecordsFromArtifact } from './conversationRecordsFromArtifact'
import { redactConversationHome } from './redactConversationHome'
import type { ConversationArtifact } from './types/ConversationArtifact'
import type { ConversationArtifactCapture } from './types/ConversationArtifactCapture'

export const captureConversationArtifact = async (
  artifact: ConversationArtifact,
  home: string,
): Promise<ConversationArtifactCapture> => {
  try {
    const records = (await conversationRecordsFromArtifact(artifact)).map(
      (record) => redactConversationHome(record, home),
    )
    return {
      source: artifact.source,
      relativePath: artifact.relativePath,
      records,
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'unknown read error'
    return {
      source: artifact.source,
      relativePath: artifact.relativePath,
      records: [],
      error: message,
    }
  }
}
