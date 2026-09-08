import fs from 'node:fs/promises'
import path from 'node:path'
import { COMPILE_RULES_LIMITS } from './constants/COMPILE_RULES_LIMITS'

/**
 * Fails the compile when the rules Claude Code loads into EVERY session grow
 * past their budget.
 *
 * This is the budget that was missing. `CLAUDE_MAX_CHARS` bounds
 * `dist/markdown/CLAUDE.md`, which is linked to no IDE and read only by the
 * verifier — so for two years the guarded artifact was the one nobody loads,
 * while the always-on rule bodies, which every session pays for on every turn,
 * grew unbudgeted to 36 KB.
 *
 * Unscoped rules (`alwaysApply`, no `paths:`) are the ones that cost this;
 * path-scoped rules load lazily when a matching file is opened and are not
 * counted. Keeping a rule unscoped is therefore a deliberate purchase of
 * context in every session, and this is where that purchase is checked.
 */
export async function assertAlwaysOnRuleBudget(
  claudeRulesDir: string,
): Promise<void> {
  const globalDir = path.join(claudeRulesDir, 'global')
  const names = await fs.readdir(globalDir).catch(() => [])
  const sizes = await Promise.all(
    names
      .filter((name) => name.endsWith('.md'))
      .map(async (name) => {
        const body = await fs.readFile(path.join(globalDir, name), 'utf8')
        return { name, chars: body.length }
      }),
  )
  const total = sizes.reduce((sum, entry) => sum + entry.chars, 0)
  if (total <= COMPILE_RULES_LIMITS.ALWAYS_ON_MAX_CHARS) {
    console.log(
      `Always-on rules: ${String(total)} chars across ${String(sizes.length)} files (budget ${String(COMPILE_RULES_LIMITS.ALWAYS_ON_MAX_CHARS)}).`,
    )
    return
  }
  const worst = [...sizes]
    .sort((a, b) => b.chars - a.chars)
    .slice(0, 3)
    .map((entry) => `${entry.name} (${String(entry.chars)})`)
    .join(', ')
  throw new Error(
    `Always-on rules exceed their budget: ${String(total)} > ${String(COMPILE_RULES_LIMITS.ALWAYS_ON_MAX_CHARS)} chars across ${String(sizes.length)} files. ` +
      `Every session pays this on every turn. Largest: ${worst}. ` +
      'Retire a rule, scope one with `globs:` so it loads lazily, or move a procedure into a skill.',
  )
}
