import { CONVERSATION_CAPTURE_VERSIONS } from './constants/CONVERSATION_CAPTURE_VERSIONS'

/** The capture versions as the single string a cache row stores and compares. */
export const conversationCaptureVersionStamp = () =>
  `n${String(CONVERSATION_CAPTURE_VERSIONS.normalizer)}.r${String(
    CONVERSATION_CAPTURE_VERSIONS.redactor,
  )}.a${String(CONVERSATION_CAPTURE_VERSIONS.adapter)}`
