import { promises as fs } from 'node:fs'
import path from 'node:path'

/**
 * Copy a local file to a global directory (create dir if needed).
 * Fails if the local file does not exist.
 *
 * @param {string} localPath - Path to local file (e.g. GEMINI.md)
 * @param {string} globalDir - Global directory (e.g. ~/.gemini)
 * @param {string} globalFileName - Filename in global dir (e.g. GEMINI.md)
 * @param {string} fileLabel - Label for error messages (e.g. "GEMINI.md")
 * @returns {Promise<{ globalPath: string }>}
 */
export async function copyFileToGlobal(
  localPath: string,
  globalDir: string,
  globalFileName: string,
  fileLabel: string,
) {
  await fs.mkdir(globalDir, { recursive: true })
  try {
    await fs.access(localPath)
  } catch {
    throw new Error(
      `Missing local ${fileLabel} file. Run 'pnpm rules:compile' first to generate it.`,
    )
  }

  const content = await fs.readFile(localPath, 'utf8')
  const globalPath = path.join(globalDir, globalFileName)
  await fs.writeFile(globalPath, content, 'utf8')
  return { globalPath }
}
