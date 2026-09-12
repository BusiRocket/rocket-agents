---
name: daily-tasks
description:
  Updates both Macs, syncs their repositories, upgrades dependencies and audits
  Atrium in one round. Trigger when the ask is the daily tasks, the daily round, updating the system and dependencies,
  syncing repos between the two Macs, or checking that Atrium is healthy and
  synced. Triggers (ES) are tareas diarias, rutina diaria, actualiza todo,
  sincroniza con el mini, revisa atrium. Do not use for one named repository's
  dependency upgrade, for a single git push, or for debugging Atrium's index
  (that is its own repository).
allowed-tools: Read, Grep, Glob, Bash, TodoWrite
argument-hint: [--dry-run] [--steps system,repos,ncu,atrium]
---

# Daily tasks — the maintenance round

One script does the work; this skill exists for what happens after it: reading
the report and deciding, line by line, what is fixed, what is recorded and what
is left alone. Run it, then read `~/p/.daily/last.md`.

```bash
bash ~/p/bin/daily/daily-tasks.sh              # everything, both Macs
bash ~/p/bin/daily/daily-tasks.sh --steps ncu  # one step again
bash ~/p/bin/daily/daily-tasks.sh --dry-run    # inventory, no writes
```

A full run takes an hour or more: the ncu step installs and verifies every owned
JavaScript repository sequentially, and the archive sync moves 46k records.
**REQUIRED SUB-SKILL:** use long-job-safety before launching it, and background
it with a guard on `~/p/.daily/logs/<date>/` moving. The steps are idempotent,
so a run cut short is finished by running it again.

## What the steps do and refuse

| step   | does                                                                                                                                                                         | refuses (PROBLEM)                                                                                       |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| system | RocketUpdater `--scheduled` here and on the mini                                                                                                                             | `SYSTEM_FAIL`; a degraded preflight defers work and reports `INFO SYSTEM_DEGRADED`                      |
| repos  | commits dirty repos owned by an org in `bin/daily/owned-orgs.txt`, rebases, pushes, on both Macs; then `repo-sync.sh` fast-forwards everything                               | `HUGE_DIRTY` (>200 files), `IN_PROGRESS`, `UNMERGED`, `SECRET_FILE`, `MARKERS`, `DIVERGED`, `PUSH_FAIL` |
| ncu    | `ncu -u` to latest in every owned repo with a package.json (minus `bin/daily/ncu-denylist.txt`), install, typecheck or build, commit `chore(deps)`, push; reverts what fails | `REVERTED` is not a PROBLEM: it is the expected outcome for a breaking major                            |
| atrium | `atrium status` and `atrium doctor` on both Macs, then `sync-conversations`                                                                                                  | `ATRIUM_STALE` (>24 h), `ATRIUM_DOCTOR`, `ARCHIVE_SYNC_FAIL`                                            |

## Acting on the report

Work the `## Problems` list top to bottom. Each line names its repository and
its host (`@local`, `@macmini`).

- **Fix in the run:** `PUSH_FAIL` (retry once, then treat as DIVERGED),
  `PULL_FAIL (p-root)` on the mini (fast-forward `~/p` there by hand and rerun
  `--steps repos`), `ARCHIVE_SYNC_FAIL` on a lock (rerun `--steps atrium` after
  the hourly refresh finishes), `SYSTEM_FAIL` when the log shows a transient
  network error.
- **Record, never resolve:** `HUGE_DIRTY`, `DIVERGED`, `SECRET_FILE`,
  `UNMERGED`, `IN_PROGRESS`, `MARKERS`. These are decisions about someone's
  work. Add one `TODO.md` entry per repository under the most relevant category
  with the line verbatim and the smallest next step.
- **Read before recording:** every `REVERTED`. Open
  `.daily/logs/<date>/ncu-<repo>.log`, name the package and the error, and
  record it in that repository's own `TODO.md` when the repository has one, else
  in `~/p/TODO.md`. A repository that reverts three days running needs a pinned
  version, not a fourth attempt.
- **Ignore:** `SKIP ACTIVE` (a live session), `SKIP NOT_OWNED`, `INFO OUTDATED`
  on repositories that are not ours.

Finish by committing and pushing `~/p` (its standing authorization covers this),
so the mini and the next session read the same `TODO.md`.

## Common mistakes

- Reading `OK` on the system step as "patched": check for `SYSTEM_DEGRADED`
  first. The mini runs hot and defers heavy work most days.
- Treating a `REVERTED` as a failure of the round. The round did its job: the
  repository is green and the breaking package is named in the log.
- Widening `owned-orgs.txt` to make a `SKIP NOT_OWNED` go away. Client and
  partner repositories are excluded on purpose; ask the owner.
- Running two rounds at once, or one during the hourly `atrium-refresh` on the
  same archive. The lock wait is bounded at ten minutes and then reports.
