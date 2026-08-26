import { linkOneWithBackup } from './linkOneWithBackup'

export const linkManyWithBackup = async (
  links: { source: string; target: string }[],
) => {
  const results = []

  for (const link of links) {
    results.push(await linkOneWithBackup(link))
  }

  return results
}
