import { matchValue } from './matchValue'

export const matchBoolean = (content: string, pattern: RegExp | string) => {
  const value = matchValue(content, pattern)
  if (value === 'true') return true
  if (value === 'false') return false
  return null
}
