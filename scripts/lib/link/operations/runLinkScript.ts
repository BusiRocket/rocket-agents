import { linkManyWithBackup } from './linkManyWithBackup'

/**
 * Run a link script: link sources to targets with backup, log results, then print success message.
 *
 * @param {{ source: string, target: string }[]} links - Array of { source, target }
 * @param {string} successMessage - Message to print when done (e.g. "Codex global links are ready.")
 */
export async function runLinkScript(
  links: { source: string; target: string }[],
  successMessage: string,
) {
  const results = await linkManyWithBackup(links)
  for (const result of results) {
    if (result.status === 'unchanged') {
      console.log(`= ${result.target} already linked to ${result.source}`)
      continue
    }
    console.log(`+ Linked ${result.target} -> ${result.source}`)
  }

  console.log(successMessage)
}
