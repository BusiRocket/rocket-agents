import { promises as fs } from 'node:fs'
import path from 'node:path'
import { cleanGlobalPrefix } from './cleanGlobalPrefix'
import { ensureParentDirectory } from './ensureParentDirectory'
import { linkOneWithBackup } from './linkOneWithBackup'

export const linkSkillsToTarget = async ({
  sourceDir,
  targetDir,
  skillNames,
  prefix,
  flatten = false,
}: {
  sourceDir: string
  targetDir: string
  skillNames: string[]
  prefix: string
  flatten?: boolean
}) => {
  await fs.mkdir(targetDir, { recursive: true })
  await ensureParentDirectory(targetDir + '/_')

  const cleaned = await cleanGlobalPrefix(targetDir, prefix)

  const linked = []

  for (const skillName of skillNames) {
    const source = `${sourceDir}/${skillName}`
    const targetName = flatten ? path.basename(skillName) : skillName
    const target = `${targetDir}/${targetName}`
    const result = await linkOneWithBackup({ source, target })

    if (result.status !== 'unchanged') {
      linked.push(skillName)
    }
  }

  return { cleaned, linked }
}
