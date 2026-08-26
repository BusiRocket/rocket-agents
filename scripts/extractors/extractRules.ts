import { RULES_INDEX_END } from '../constants/RULES_INDEX_END'
import { RULES_INDEX_START } from '../constants/RULES_INDEX_START'

export const extractRules = (content: string) => {
  const start = content.indexOf(RULES_INDEX_START)
  const end = content.indexOf(RULES_INDEX_END)
  if (start === -1 || end === -1 || end < start) return []
  return content
    .slice(start + RULES_INDEX_START.length, end)
    .split(/\r?\n/)
    .map((line: string) => line.trim())
    .filter((line: string) => line.startsWith('- '))
    .map((line: string) => line.slice(2).trim())
}
