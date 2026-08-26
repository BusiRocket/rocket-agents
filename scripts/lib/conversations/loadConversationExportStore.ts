import type { ConversationCaptureStore } from './ConversationCaptureStore'
import { streamConversationExport } from './streamConversationExport'
import type { ConversationStoreChange } from './types/ConversationStoreChange'

export const loadConversationExportStore = async (
  input: string,
  store: ConversationCaptureStore,
  changes?: Record<ConversationStoreChange, number>,
) =>
  streamConversationExport(input, (record) => {
    const change = store.replace(record)
    if (changes !== undefined) changes[change]++
  })
