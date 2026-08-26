import { tokenize } from './tokenize'

export const overlapScore = (left: string, right: string) => {
  const leftTokens = new Set(tokenize(left))
  const rightTokens = tokenize(right)
  let hits = 0
  for (const token of rightTokens) {
    if (leftTokens.has(token)) hits += 1
  }
  return hits
}
