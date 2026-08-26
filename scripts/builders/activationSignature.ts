import { tokenize } from '../analyzers/tokenize'
import { extractActivationSection } from '../extractors/extractActivationSection'

export const activationSignature = (description: string) => {
  const trigger = extractActivationSection(
    description,
    /trigger when/i,
    /do not use/i,
  )
  const exclusion = extractActivationSection(description, /do not use/i, /$/)
  const triggerTokens = new Set(
    tokenize(trigger).filter((token: string) => token.length > 2),
  )
  const exclusionTokens = new Set(
    tokenize(exclusion).filter((token: string) => token.length > 2),
  )
  return { triggerTokens, exclusionTokens }
}
