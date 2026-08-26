import { promises as fs } from 'node:fs'
import path from 'node:path'

export const listSkillDirs = async (baseDir: string): Promise<string[]> => {
  const result: string[] = []
  const topEntries = await fs.readdir(baseDir, { withFileTypes: true })
  for (const top of topEntries) {
    if (!top.isDirectory()) continue
    const topPath = path.join(baseDir, top.name)
    const subEntries = await fs.readdir(topPath, { withFileTypes: true })
    for (const sub of subEntries) {
      if (sub.isDirectory()) {
        result.push(path.join(topPath, sub.name))
      }
    }
  }
  return result
}
