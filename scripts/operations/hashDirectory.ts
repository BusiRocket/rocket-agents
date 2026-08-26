import { createHash } from 'node:crypto'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { listFilesRecursive } from '../lib/fs/operations/listFilesRecursive'

export const hashDirectory = async (dir: string) => {
  const hash = createHash('sha256')

  const files = await listFilesRecursive(dir)

  files.sort((a: string, b: string) => a.localeCompare(b))

  for (const file of files) {
    const rel = path.relative(dir, file).replace(/\\/g, '/')

    const content = await fs.readFile(file)
    hash.update(rel)
    hash.update('\0')
    hash.update(content)
    hash.update('\0')
  }

  return hash.digest('hex')
}
