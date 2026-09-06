---
name: job-search
description:
  Finds live job postings, fetches each full description, and reviews it against
  the fit rubric before anything is written. Trigger when new openings are
  wanted, when a specific posting has to be looked up, when the application
  pipeline is being refreshed, or when postings need triaging into the career
  KB. Triggers (ES) are buscar ofertas, nuevas vacantes, refrescar el pipeline,
  mira esta oferta. Do not use for filling or submitting a form (that is
  job-application), or for editing the master resume.
allowed-tools: Read, Grep, Glob, Bash, WebFetch, TodoWrite
argument-hint: [keywords-or-job-id]
---

# Job Search — LinkedIn CLI + career KB triage

Bridges the `linkedin-search` CLI from `~/p/ai-job-search` (upstream:
MadsLorentzen/ai-job-search) into this repo's career KB flow
(`career/README.md`).

## CLI (runs with bun, zero deps, no auth)

Run from any directory:

```bash
# Search (10 results/page)
bun run /Users/cristiandeluxe/p/ai-job-search/.agents/skills/linkedin-search/cli/src/cli.ts \
  search -q "<keywords>" -l "<place>" [--remote remote] [--jobage 7] [--page N] [--format table]

# Full job description by LinkedIn job ID or URL (canonical ingest source)
bun run /Users/cristiandeluxe/p/ai-job-search/.agents/skills/linkedin-search/cli/src/cli.ts \
  detail <id|url> --format plain
```

- `-l` is required. Useful values: `"European Union"`, `"Spain"`, `"Remote"`,
  `"United States"`. Combine with `--remote remote`.
- LinkedIn ToS: personal use, low volume. Do not batch-hammer; space calls.

## Triage flow (each posting)

1. **Dedupe** against `career/applications/tracker.csv` (company+role) and
   `career/applications/_triage-*.md`. Already tracked -> skip.
2. **Score** against `career/fit-rubric.md` (5 dimensions + deal-breakers).
   Posting text only; `detail <id>` gives the full JD.
3. **Verdict >= 75 (apply now)**: create
   `career/applications/<yyyy-mm>-<company>-<role>/offer.md` from
   `applications/_template/offer.md`, resolving to the canonical ATS first
   (playbook rules 25-26: LinkedIn tags lie — verify legal entity, country list,
   req liveness, level bar).
4. **Append a row** to `tracker.csv` for every scored posting, including skips
   (status `discarded`, one-line reason).
5. Verdicts 55-74: log with `next_action` = the one cheap question (recruiter
   DM, eligibility check). No deliverables until resolved.

## Sources feeding this pipeline

- This CLI (proactive search).
- LinkedIn alert emails via Spark CLI + doveadm triage (see
  `applications/_triage-2026-07-11-linkedin.md` for the worked pattern).

## After applying — close the loop

Update the tracker row (`applied`, then
`screening|interview|offer|rejected| no_response`) and append a status line to
that application's `fit.md`. Distil durable learnings into
`career/hiring-playbook-2026.md` and recurring preferences into
`career/profile.md` (compounding principle).

## Self-healing and self-improvement

This skill is expected to be wrong eventually. Boards redesign their forms,
hosts stop resolving, APIs move, and a rule that held in September stops
holding. **When a step here fails or a new failure is discovered, the fix goes
back into this file in the same session.** A workaround that lives only in a
transcript will be rediscovered from scratch, at full cost, by the next session.

### Heal

Trigger: a documented step does not work as written, or produces a result the
skill did not anticipate.

1. Solve the immediate problem for the task at hand.
2. Establish what actually changed, with evidence — the error text, the DNS
   answer, the field that vanished, the status code. Do not guess at a cause.
3. Edit the failing section here. Replace the stale instruction; do not append a
   second version beside it, because two contradictory instructions are worse
   than one stale one. Keep the old behavior only if it still applies somewhere,
   and say where.
4. Record the observation that forced the change, dated, so a future reader can
   tell a deliberate decision from an accident.

### Improve

Trigger: the task succeeded, and something was learned that would have saved
time if it had been written down.

- A new trap, a faster route, a check that caught a real error: add it.
- A step that has never once mattered: delete it. This file competes for
  attention, and an instruction nobody needs makes the ones that matter harder
  to find.
- A rule that fired twice for the same underlying reason: merge them and name
  the shared cause.

### Ship the change

Skills live in `~/p/rocket-agents`, not in the project repo. Edit
`src/skills/core/<name>/SKILL.md`, never a compiled or linked copy.

```bash
git pull --ff-only origin main   # other sessions commit here concurrently
pnpm run skills:compile          # `check` does NOT recompile
pnpm run check                   # must exit 0; read the exit code, not the tail
git add src/skills/core/<name>/SKILL.md
git commit && git push origin main
pnpm run skills:link             # then verify the linked file, not the summary
```

A new skill also needs its name in `src/skills/skill-rules.map.json` or the
compile fails. Descriptions need a `Trigger when` clause before character 150, a
`Do not use` clause, and an action verb from
`scripts/constants/ACTION_WORDS.ts`.

### Where a finding belongs

- **How to do the work** → this file.
- **Why a decision was made, with its evidence** → the owning repository's
  knowledge base (for job hunting, `career/hiring-playbook-2026.md` as a
  numbered rule).
- **A fact about the world that other tasks need** → `~/p/brain`.
- **Something actionable but out of scope right now** → the repository's
  `TODO.md`, with the observation, the evidence, and the smallest next step.

Do not put all four in one place. A procedure padded with rationale stops being
followed, and a rationale hidden inside a procedure stops being found.
