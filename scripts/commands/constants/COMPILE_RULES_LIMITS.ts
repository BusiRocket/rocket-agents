/**
 * `CLAUDE_MAX_CHARS` bounds the generated always-on bootstrap index. It exists
 * because that file is loaded into EVERY session on every machine, so each
 * character is paid for on every turn; the number encodes the "under 200 lines
 * in each always-loaded CLAUDE.md" target from the Claude Code overlay.
 *
 * Raised from 15,000 to 15,500 on 2026-09-08, deliberately and once: the index
 * had reached 14,979 with 21 characters of headroom, so the next always-on rule
 * anyone wrote overflowed it — and until the same day that overflow was
 * invisible, because the compile printed its error and exited 0 while
 * `clean:dist` had already deleted every global rule. The rule that hit it was
 * `global/process-hygiene`, which is operational safety rather than optional
 * guidance.
 *
 * The alternative was trimming the router's per-rule descriptions, and it was
 * rejected on purpose: those parentheticals are the routing signal that tells a
 * model when to load a rule, so shortening them to buy space degrades the thing
 * the index exists for.
 *
 * If this needs raising again, that is the signal to retire rules rather than
 * to add another 500 — the budget is the forcing function, not the obstacle.
 */
export const COMPILE_RULES_LIMITS = {
  CLAUDE_MAX_CHARS: 15_500,
  ALL_RULES_MAX_CHARS_WARN: 2_000_000,
  RULE_MAX_CHARS_WARN: 30_000,
} as const
