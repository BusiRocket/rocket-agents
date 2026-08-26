import { readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Read every SKILL.md under src/skills and return its frontmatter block.
 *
 * @returns {{ name: string; frontmatter: string }[]} - One entry per skill, named
 *   by its containing directory. Files without a frontmatter fence yield "".
 */
export const collectSkillFrontmatter = (): {
  name: string
  frontmatter: string
}[] => {
  const repoRoot = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../../..',
  )
  const skillsDir = path.join(repoRoot, 'src/skills')

  const walk = (dir: string): string[] =>
    readdirSync(dir).flatMap((entry) => {
      const full = path.join(dir, entry)
      if (statSync(full).isDirectory()) return walk(full)
      return entry === 'SKILL.md' ? [full] : []
    })

  return walk(skillsDir).map((file) => ({
    name: path.basename(path.dirname(file)),
    frontmatter:
      /^---\n([\s\S]*?)\n---/.exec(readFileSync(file, 'utf8'))?.[1] ?? '',
  }))
}
