/**
 * `CLAUDE_MAX_CHARS` bounds `dist/markdown/CLAUDE.md`, the generated bootstrap
 * index — 78% of which is the rules router, a flat list of all 117 rules.
 *
 * CORRECTED 2026-09-08. An earlier version of this comment claimed the file is
 * "loaded into EVERY session on every machine". It is not, and that error is
 * worth keeping visible: `IDE_RULE_TARGETS` links `dist/global/.claude/rules`
 * for Claude Code and deliberately does NOT link this file, so as not to
 * clobber the lean hand-written `~/.claude/CLAUDE.md`. Cursor, Codex,
 * Antigravity and Windsurf each take a different artifact. Nothing installs
 * this one; only the golden-master verifier reads it.
 *
 * So this budget guards a build artifact, not a context cost, and it was raised
 * from 15,000 to 15,500 on 2026-09-08 to admit one rule entry. That raise was
 * defensible only because the number governs nothing a model loads — had it
 * been the real cost, the right answer would have been to retire a rule.
 *
 * The cost that IS paid on every turn is `ALWAYS_ON_MAX_CHARS` below, which
 * until the same day had no budget at all. That is the one to defend.
 */
export const COMPILE_RULES_LIMITS = {
  CLAUDE_MAX_CHARS: 15_500,
  /**
   * The bytes Claude Code loads into EVERY session: the unscoped rule bodies
   * under `dist/global/.claude/rules/global`. Enforced by
   * `assertAlwaysOnRuleBudget`, and the budget that actually costs tokens —
   * see the note on CLAUDE_MAX_CHARS for why the other one does not.
   *
   * Set on 2026-09-08 at 26,000 against a measured 24,608.
   *
   * The first version of this budget said 38,000 against 36,103, because it
   * counted every file in the directory. Three of the ten carry `paths:` and
   * load only when a matching file is opened, so 11,495 of those characters
   * were never paid on an ordinary turn. A budget measuring the wrong set is
   * the same failure as CLAUDE_MAX_CHARS above, one directory further in.
   */
  ALWAYS_ON_MAX_CHARS: 26_000,
  ALL_RULES_MAX_CHARS_WARN: 2_000_000,
  RULE_MAX_CHARS_WARN: 30_000,
} as const
