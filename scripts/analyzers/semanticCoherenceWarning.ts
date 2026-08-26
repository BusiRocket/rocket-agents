import { tokenize } from './tokenize'

export const semanticCoherenceWarning = (
  description: string,
  rules: string[],
) => {
  const descriptionTokens = new Set(tokenize(description))
  const ruleTokens = new Set(
    rules
      .flatMap((rule: string) =>
        tokenize(
          rule.replace('@rules/', '').replace('.mdc', '').replace(/\//g, ' '),
        ),
      )
      .filter((token: string) => token.length > 2),
  )

  let overlap = 0
  for (const token of descriptionTokens) {
    if (ruleTokens.has(token)) overlap += 1
  }

  if (overlap === 0) {
    return 'description may be semantically misaligned with mapped rules'
  }

  return null
}
