import { promises as fs } from 'node:fs'
import path from 'node:path'
import { SRC_SKILLS_DIR } from '../constants/SRC_SKILLS_DIR'
import { ANTIGRAVITY_SKILLS_DIR } from '../lib/link/constants/ANTIGRAVITY_SKILLS_DIR'
import { copySkillToTargetWithTransform } from '../lib/link/operations/copySkillToTargetWithTransform'
import { listSkillDirs } from '../lib/link/operations/listSkillDirs'
import { rewriteAntigravityRuleRefs } from '../lib/link/operations/rewriteAntigravityRuleRefs'

export const installAntigravitySkills = async (): Promise<void> => {
  await fs.mkdir(ANTIGRAVITY_SKILLS_DIR, { recursive: true })

  const skillSourceDirs = await listSkillDirs(SRC_SKILLS_DIR)

  let installed = 0
  for (const sourceDir of skillSourceDirs) {
    const skillName = path.basename(sourceDir)
    const target = path.join(ANTIGRAVITY_SKILLS_DIR, skillName)
    await copySkillToTargetWithTransform({
      source: sourceDir,
      target,
      transformContent: rewriteAntigravityRuleRefs,
    })
    installed++
    console.log(`[antigravity] installed: ${skillName}`)
  }

  console.log(`\n[antigravity] Done. Installed ${String(installed)} skills.`)
}
