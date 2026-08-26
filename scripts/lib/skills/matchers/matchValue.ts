export const matchValue = (content: string, pattern: RegExp | string) => {
  const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern
  const match = regex.exec(content)
  return match?.[1]?.trim() ?? ''
}
