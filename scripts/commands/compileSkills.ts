import { promises as fs } from 'node:fs'
import path from 'node:path'
import { DIST_SKILLS_DIR } from '../constants/DIST_SKILLS_DIR'
import { DIST_SKILLS_PORTABLE_DIR } from '../constants/DIST_SKILLS_PORTABLE_DIR'
import { MANIFEST_PATH } from '../constants/MANIFEST_PATH'
import { SRC_SKILLS_DIR } from '../constants/SRC_SKILLS_DIR'
import { emitPortableSkillsFromDist } from '../lib/skills/emitters/emitPortableSkillsFromDist'
import { listSkillDirs } from '../lib/skills/loaders/listSkillDirs'
import { loadSkillRulesManifest } from '../lib/skills/loaders/loadSkillRulesManifest'
import type { SkillRulesManifest } from '../lib/skills/types/SkillRulesManifest'
import { validateSkillRulesManifestShape } from '../lib/skills/validators/validateSkillRulesManifestShape'
import { copyDirRecursive } from '../operations/copyDirRecursive'
import { parseSkillNameFromContent } from '../parsers/parseSkillNameFromContent'
import { validateManifestReferences } from '../validators/validateManifestReferences'
import { buildRuleRefSet } from './buildRuleRefSet'
import { upsertRulesIndex } from './upsertRulesIndex'

export const main = async () => {
  console.log(
    'Compiling skills into deterministic product-managed artifacts...',
  )

  const rawManifest = await loadSkillRulesManifest(MANIFEST_PATH)
  const shapeValidation = validateSkillRulesManifestShape(
    rawManifest as Record<string, unknown>,
  )
  if (shapeValidation.errors.length > 0) {
    throw new Error(
      `Invalid skill rules manifest:\n- ${shapeValidation.errors.join('\n- ')}`,
    )
  }

  const manifest = rawManifest as SkillRulesManifest

  const skillDirs = await listSkillDirs(SRC_SKILLS_DIR)
  if (skillDirs.length === 0) {
    throw new Error('No skills found in src/skills')
  }

  const skillNameToSourceDir = new Map<string, string>()
  for (const skillDir of skillDirs) {
    const skillMdPath = path.join(skillDir, 'SKILL.md')
    const content = await fs.readFile(skillMdPath, 'utf8')

    if (content.includes('## Dynamic Rules Ecosystem')) {
      throw new Error(
        `Legacy inline rules detected in source skill: ${skillMdPath}`,
      )
    }

    const skillName = parseSkillNameFromContent(content, skillMdPath)
    skillNameToSourceDir.set(skillName, skillDir)
  }

  const validRuleRefs = await buildRuleRefSet()
  const manifestErrors = validateManifestReferences(
    manifest,
    validRuleRefs,
    new Set(skillNameToSourceDir.keys()),
  )
  if (manifestErrors.length > 0) {
    throw new Error(
      `Skill manifest validation failed:\n- ${manifestErrors.join('\n- ')}`,
    )
  }

  await fs.rm(DIST_SKILLS_DIR, { recursive: true, force: true })

  const sortedSkillNames = Array.from(skillNameToSourceDir.keys()).sort(
    (a, b) => a.localeCompare(b),
  )
  for (const skillName of sortedSkillNames) {
    const sourceDir = skillNameToSourceDir.get(skillName)
    if (!sourceDir) continue
    const relative = path.relative(SRC_SKILLS_DIR, sourceDir)
    const distDir = path.join(DIST_SKILLS_DIR, relative)

    await copyDirRecursive(sourceDir, distDir)

    const distSkillMdPath = path.join(distDir, 'SKILL.md')
    const distContent = await fs.readFile(distSkillMdPath, 'utf8')
    const withRulesIndex = upsertRulesIndex(
      distContent,
      manifest.skills[skillName]?.rules ?? [],
    )

    if (withRulesIndex.includes('## Dynamic Rules Ecosystem')) {
      throw new Error(
        `Legacy rules block leaked into output: ${distSkillMdPath}`,
      )
    }

    await fs.writeFile(distSkillMdPath, withRulesIndex, 'utf8')
  }

  const portableCount = await emitPortableSkillsFromDist({
    distSkillsDir: DIST_SKILLS_DIR,
    distSkillsPortableDir: DIST_SKILLS_PORTABLE_DIR,
  })

  console.log(`Successfully compiled skills to ${DIST_SKILLS_DIR}`)
  console.log(
    `Emitted ${String(portableCount)} portable skills to ${DIST_SKILLS_PORTABLE_DIR}`,
  )
  console.log(
    'dist/skills is the Claude variant; dist/skills-portable is for other IDEs.',
  )
}
