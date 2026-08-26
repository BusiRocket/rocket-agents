import { promises as fs } from 'node:fs'
import path from 'node:path'
import type { RuleTarget } from '../types/RuleTarget'
import { cleanGlobalPrefix } from './cleanGlobalPrefix'
import { ensureParentDirectory } from './ensureParentDirectory'
import { linkOneWithBackup } from './linkOneWithBackup'

export const linkRuleTarget = async (ruleTarget: RuleTarget) => {
  let cleaned: string[] = []

  if (ruleTarget.cleanup) {
    cleaned = await cleanGlobalPrefix(
      ruleTarget.cleanup.dir,
      ruleTarget.cleanup.prefix,
    )
  }

  let linked = 0
  let copied = 0

  for (const link of ruleTarget.links) {
    await ensureParentDirectory(link.target)

    if (link.method === 'copy') {
      const sourceStat = await fs.lstat(link.source)

      await fs.mkdir(path.dirname(link.target), { recursive: true })

      if (sourceStat.isDirectory()) {
        await fs.rm(link.target, { recursive: true, force: true })

        await fs.cp(link.source, link.target, {
          recursive: true,
          dereference: true,
        })
      } else {
        const content = await fs.readFile(link.source, 'utf8')

        await fs.rm(link.target, { force: true })
        await fs.writeFile(link.target, content, 'utf8')
      }

      copied++
    } else {
      await linkOneWithBackup({ source: link.source, target: link.target })
      linked++
    }
  }

  return { cleaned, linked, copied }
}
