export const extractActivationSection = (
  description: string,
  startPattern: string | RegExp,
  endPattern: string | RegExp,
) => {
  const startRegex =
    typeof startPattern === 'string' ? new RegExp(startPattern) : startPattern
  const match = startRegex.exec(description)
  if (!match) return ''
  const start = match.index + match[0].length

  const endRegex =
    typeof endPattern === 'string' ? new RegExp(endPattern) : endPattern
  const endMatch = endRegex.exec(description.slice(start))
  const end = endMatch ? start + endMatch.index : description.length
  return description.slice(start, end).trim()
}
