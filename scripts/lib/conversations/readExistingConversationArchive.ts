import { readConversationExport } from './readConversationExport'
import type { ConversationExportReadResult } from './types/ConversationExportReadResult'

export const readExistingConversationArchive = async (
  archive: string,
): Promise<ConversationExportReadResult> => {
  try {
    return await readConversationExport(archive)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT')
      return { records: [], errors: [] }
    throw error
  }
}
