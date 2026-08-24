# TODO — agents-tools

> Consolidated from the accessible Claude, Codex, Cursor, and Antigravity project history plus the
> `~/p` meta backlog (routed 2026-08-13) and the archived `BusiRocket/agents-skills` backlog. Last
> reviewed: 2026-08-24. History coverage: Partial — Claude Code transcripts before 2026-07-19 no
> longer exist on disk (repo work starts 2026-02-27), and the 2026-07-19 audit scratchpad reports
> (`findings.md`, `findings30.md`) were reconstructed from Codex rollouts, not read from disk. Open
> items from `TODO-skills-audit.md` (append-only audit history) are tracked here; that file is no
> longer a backlog.
>
> States: `[ ]` pending · `[~]` partial or unverified · `[!]` blocked · `[x]` verified complete ·
> `[-]` obsolete or superseded. Closed work moves to `TODO_LOG.md`.

## Router and hooks

- [ ] Round 2 audit re-run with the revised metrics: directive adherence (the one that matters),
      router coverage (baseline 172/1053 = 16%) and hand-measured lane precision. Include the known
      frontend miss: a plain "check this header on mobile" trigger test (2026-07-19) fired no design
      skill. Baselines and metric definitions in `TODO-skills-audit.md`.

## Skills

- [ ] Candidate skills from the Codex 30-day pass, unbuilt: `communications-work-intake` (13
      sessions; Slack/Discord/WhatsApp/email intake, wider than `stakeholder-recap`) and
      `document-intake-reconciler` (Downloads/PDF/OCR triage into Holded).
- [ ] Pilot skill-creator-style blind A/B evals on one BRP skill (with-skill vs without-skill,
      isolated contexts); if pass rates match, the skill adds nothing. Also pressure-test skill
      wording adversarially (Superpowers method). Source:
      `~/p/brain/topics/claude-skills-ecosystem.md`.
- [ ] Evaluate a conversation-only "grill" gate skill for business/marketing decisions (offer,
      positioning, pricing), modeled on Pocock's grill-me as used by practitioners on non-code
      ideas: questions in rounds (dependent questions wait), ~46 questions / 4 rounds as an ordinary
      session, ends when nothing is left to ask, and the pushback rule ("a session with no pushback
      is a session you didn't need"). Source: `~/p/brain/topics/claude-skills-ecosystem.md`
      (2026-08-19 section).
- [ ] Candidate BRP rule/hook: require a screen-recording video attached to any PR that changes UI
      state (steipete's one-line AGENTS.md rule at openclaw; GitHub accepts programmatic video
      upload — worked example openclaw/openclaw#124013). Fits next to the existing
      evidence-before-claims posture. Source: `~/p/brain/topics/claude-code-practice.md` (2026-08-19
      X sweep section).

## Skills library cleanup

> Decided 2026-08-17: curate one list and link it to every IDE including Antigravity, rather than
> the current split where Claude Code is offered 13 skills and the other 94 bundles reach only
> Codex. Nothing is deleted; unused bundles leave the default fan-out and stay in the repo.
> Measurements: `~/p/dotfiles/docs/machine-inventory/skills-triage.md`.

- [ ] Link the curated list into `~/.claude/skills` and into Antigravity (`~/.gemini/config/skills`,
      which currently carries only the 7 BRP skills). Claude Code sees 13 of 273 skills today and
      all 13 are BRP; the rest were never offered to it.
- [ ] Build `communications-work-intake`: Discord, Slack, WhatsApp and email intake to context plus
      drafted reply. 141 requests across four projects in 30 days; `stakeholder-recap` covers only
      the narrower recap shape and fired once. Largest measured gap.
- [ ] Build a screenshot-to-component skill for the real stack (shadcn/Radix/Tailwind, project
      tokens, existing components). 182 requests arrive as pasted screenshots; the seven design
      skills installed are all about taste or review and none does this job. Use `ckm-ui-styling` as
      source material, not as a competitor.
- [ ] Extend the business lane next to `invoice-quarter-close` (27 invocations, the most-used
      non-Superpowers skill): contracts review and modification (26 requests) and digital PDF
      signing (12) have no coverage.
- [ ] Build a background-job watch procedure: 44 requests asking for progress on long-running jobs,
      with no skill and only `/loop` as a harness feature.
- [ ] Delete the 16 Java/Spring-only bundles (14 `unit-test-*` plus `clean-architecture` and
      `docs-updater`). Body scan confirms no other tech signal, and no Spring codebase exists in
      `~/p`.
- [ ] Review skill by skill against the work actually done here, deciding for each what it does and
      whether it earns its place. This is the real cleanup: the library is an accumulation of
      experiments that were never triaged. Start with the six bundles holding ~170 SKILL.md files
      and one recorded call between them (`engineering-advanced-skills` 47, `marketing-skills` 45,
      `engineering-skills` 37, `product-skills` 17, `ra-qm-skills` 14, `pm-skills` 8), then the 21
      Java/Spring `unit-test-*` bundles, which match no codebase in `~/p`.
- [ ] Resolve the capabilities that exist on several surfaces at once: `frontend-design` is both an
      `~/.agents` bundle and an official plugin, both called 11 times; `context7` is a plugin, an
      MCP server and an always-on rule. Pick one surface each.
- [ ] Re-check `brp-rust-quality` and `lovable-sync` after another month. Both are linked and had
      zero calls in the 30-day window, but both are recent and narrow, so the window is too short to
      conclude anything.
- [ ] Re-run the classification for `pm-skills/SKILL.md` and `drizzle-orm-patterns/SKILL.md`, the
      two the mining pass dropped.

## Skill library and learning loop

> Shipped 2026-08-18: the four curation states, seeding from the lock, per-skill curation, linking
> what is adopted, the transcript observer, trigger learning with secret redaction, delegated
> classification, the router audit, proposals and automatic parking behind a grace period. Claude
> Code went from 13 skills offered to 30. Spec and plan:
> `docs/superpowers/specs/2026-08-18-skill-library-and-learning-loop-design.md`.

- [!] Check the weekly loop reports (`~/.agents-learning/reports/`, LaunchAgent
  `com.cristian.library-loop`, Sundays 06:30) and whether the promoted skills fire. A promotion that
  does not change invocation counts is a proposal to demote, and that is the first real test of
  whether any of this works. Blocked on the clock: first run is 2026-08-23. Note the agent was
  pointing at the pre-rename directory and would have failed silently; repaired and reloaded
  2026-08-22 (see `TODO_LOG.md`), so 2026-08-23 is the first run that can actually produce a report.
  The first run also does the full classification pass (~26 agy batches), so expect it to take a
  while and check `~/.agents-learning/loop.log` if the report is missing.
- [ ] Exercise patch reapplication against a real fork. Implemented and tested for the conflict
      case, never run for real, because nothing is forked yet.
- [ ] Codex-side usage stays unmeasured. `library:observe-codex` refuses to report it: an anchored
      read pattern returns 912, 911 and 913 across unrelated skills, which is a catalogue listing,
      not use. Either Codex gains a real invocation signal or proposals stay Claude-scoped.
- [ ] Decide what to do with the 87 parked entries, now that parking is cheap and reversible. The 16
      Java/Spring bundles are the obvious first pass.

## Machine provisioning

> Scope decided 2026-08-17: this repo stays public and data-free and holds the engine (schemas,
> capture readers, per-target renderers, CLI). The manifests carrying real values stay in the
> private `BusiRocket/dotfiles` repo, which already owns brew, shell, symlinks, launchd and secrets.
> Measured inventories behind these items: `~/p/dotfiles/docs/machine-inventory/`.

- [!] Complete account-local authentication on `macmini`. Managed configuration is converged, but
  `agents:doctor` still reports Cursor MCP failed; Claude needs Cloudflare in personal and Favish
  plus OpenSEO in personal. ZeroHedge is optional and absent in both Claude profiles. Authentication
  requires the user's browser/account session and must not be copied from another machine. User
  decision 2026-08-22: will log in on the mini on demand, when those services are next needed there
  — not a scheduled task. Follow `docs/runbooks/claude-connector-authentication.md`, then verify
  with `pnpm run connectors:doctor -- --json` and `pnpm run agents:doctor -- --json` on the mini.
- [~] Plugin manifest: capture, schema, parser, planner and the `machine:diff` lane are built and
  verified (2026-08-22, see `TODO_LOG.md`). Remaining: (a) author the private `plugins.json` in
  `BusiRocket/dotfiles` from `pnpm run machine:capture:plugins -- --json`, which is where the real
  values belong; (b) build apply, which is a machine mutation and needs authorization.
- [ ] Plugin cache hygiene: the one-off sweep is done (2026-08-22, 2.5 GB to 271 MB, see
      `TODO_LOG.md`). What remains is the recurring policy: the orphan directories accumulated at
      roughly 768 in ten days, so decide whether an apply step prunes them on a schedule. Two
      constraints the sweep proved: resolve install paths through `realpath` (13 of 37 plugins are
      recorded through the `~/.claude-favish/plugins` symlink), and resolve `settings.json`
      references, not only `installed_plugins.json` — `statusLine` pointed at a version that read as
      stale.
- [~] Services: schema, both renderers and the diff domain are built and verified (2026-08-22 and
  2026-08-24, see `TODO_LOG.md`). `machine:diff` compares each declared service against the unit
  files its init system reads and reports `create`/`update` per file. Remaining: (a) write the real
  service descriptions, which carry machine values and belong in the private dotfiles repo; (b) an
  apply step that writes and reloads the units, which is a machine mutation and needs authorization;
  (c) decide whether apply may remove undeclared units, which the planner does not do today. The 25
  live LaunchAgents stay hand-written until then.
- [ ] Profiles: the selector landed 2026-08-24 (`full`, `lite`, `--profile` on `machine:diff`, see
      `TODO_LOG.md`), so the blocker is gone. What remains is the other half of the original item:
      the targets are only meaningful on the diff side, since apply still hard-codes `full` and has
      no plugins or services domain to select. Smallest next step: thread the profile through
      `machineApply.ts` when those apply domains exist.
- [ ] Record install provenance for the tools that still have none. Resolved 2026-08-22: `codegraph`
      is the global npm package `@colbymchenry/codegraph@1.5.0` and Serena is the uv tool
      `serena-agent@1.7.0`, so the gap was the sweep, not the tools — it must read `npm ls -g` and
      `uv tool list`, which it does not. `claude` (2.1.239) and `cursor-agent` (2026.08.11-e8db854)
      are self-updating installers under `~/.local/share`, recoverable by re-running the installer
      but unpinned. `agy` 1.1.17 and `herdr` 0.8.0 remain the real gap: bare arm64 Mach-O binaries
      in `~/.local/bin` with no package, no installer and no recoverable source, so both are lost if
      the disk is. Smallest action: extend the sweep to the two package managers, then archive the
      `agy` and `herdr` binaries somewhere durable.
- [ ] `config` apply must merge, never replace: third-party tools (orca, atuin, warp) inject hooks
      into `settings.json` without asking, and a full rewrite drops them. Verified 2026-08-22 that
      this is a constraint on unbuilt code, not a live defect: there is no `config` domain, and the
      one settings writer that exists (`domains/security/writeClaudeSettings.ts`) already spreads
      the existing document. Carry the constraint into the domain when it is built.

## Supply chain and secrets

- [!] Rotate the still-live credentials recovered on 2026-08-17 from `~/.gemini/mcp_config.json` (2
  GitHub PATs, Context7, Bright Data, Firecrawl, Browser Use, n8n JWT, Brave Search; the two
  ZeroHedge MongoDB URIs only need revoking). Values and uses in
  `~/p/brain/business/misc-credentials.md`. State 2026-08-22: user explicitly deferred the rotation
  ("de momento no voy a rotar ninguna"); neo cleanup done (no `mcp_config.json` in `/root/.gemini`,
  and `p/brain`/`p/vault` copies deleted); remaining exposure surface is `portatil`'s legacy
  `~/.gemini` (machine unreachable 2026-08-22 — delete it when the laptop is next on the network)
  plus the providers themselves. Unblock action when resumed: the per-provider dashboard checklist
  from the 2026-08-22 session.
- [ ] Install `detect-secrets` as a pre-commit hook and enable GitHub secret scanning on the active
      repos. A leaked AWS key was used 11 minutes after the push in one documented case. Cheap,
      one-time. Source: `~/p/brain/topics/app-security.md`.
- [ ] `poirocket` was flagged in the 2026-08-13 publish-token keyword sweep but has no checkout
      under `~/p`, so the 2026-08-22 audit could not cover it (the other 15 flagged repos are done,
      see `TODO_LOG.md`). Clone or locate it and check its workflows for long-lived registry tokens.
- [ ] Adopt pnpm 11 supply-chain controls across the other `~/p` repos: `minimumReleaseAge: 1440`
      (24h cooldown defeats the compromised-token window) and `blockExoticSubdeps: true`. Needs Node
      22 and pnpm 11; check per repo. This repository was verified compliant 2026-08-22
      (`pnpm-workspace.yaml`), so only the cross-project sweep remains and it is out of this
      repository's scope — file per repo when each is next touched. Source:
      `~/p/brain/topics/supply-chain-security.md`.
- [!] Add `uv export --format requirements.txt` to any CI that adopts `uv`, as the exit ramp now
  that OpenAI owns it — one line, converts lock-in into a preference. Blocked by its own
  precondition: a 2026-08-22 sweep of `~/p/*/.github/workflows` found no workflow using `uv`.
  Unblock action: apply it in the first workflow that adopts `uv`. Source:
  `~/p/brain/topics/supply-chain-security.md`.

## Harness

- [ ] Dependency sweep for native replacements across the `~/p` frontends: `Intl.*` for formatting,
      `crypto.randomUUID`, `structuredClone`, `URLSearchParams`, `AbortController`. Measured
      elsewhere: audit vulnerabilities 17 -> 5. Fewer deps also shrinks the supply-chain surface.
      Source: `~/p/brain/topics/web-platform.md`.
- [ ] Decide whether to keep the `security-review` auto fan-out: measured 2026-08-13 at ~$2,691/30d
      list-price equivalent (2,324 sessions, ~77/day, Opus 4.7) with a ~1.7% candidate-flag rate and
      no confirmed real finding in the sampled verdicts. Options: keep (subscription absorbs it),
      scope to risky paths only, or disable. Numbers in `TODO_LOG.md` 2026-08-13.

## Repository hygiene

- [ ] Delete the merged branch `feat/skill-router-reliability` once its remote state is checked. Its
      worktree was removed 2026-08-22 and the branch is fully merged into `main` (0 unique commits),
      so the ref is the only leftover. Confirm no remote tracks it first.

## Cross-project

- [ ] `~/p/dotfiles` (filed there 2026-08-22, four LaunchAgent items): plists are copied rather than
      linked so installed copies drift silently — proven by the `library-loop` agent, which still
      carried the pre-rename path while the dotfiles copy did not; `sync-all-safe` is drifted now
      with no obvious authoritative side; `sync-conversations` and `sync-projects` are declared but
      never installed; and every plist hardcodes an absolute home path that the new
      `domains/services` schema would reject. Filed, not executed — dotfiles owns launchd.

- [ ] `~/p` meta backlog: `~/p/agents-tools` is an empty leftover directory from the rename to
      `rocket-agents`, holding only an empty `.serena`. Because it sits inside the `~/p` git repo,
      any `git` command run there silently resolves to the `~/p` meta repo, which is how it was
      found (2026-08-22, a `git status` there reported `~/p/TODO.md` as modified). Smallest action:
      delete the directory from `~/p`. Filed here rather than executed - the target is another
      repository.

- [ ] `~/p/RocketUpdater` (no TODO.md there yet): commit or discard its untracked `.serena/` state —
      already named in `~/p/osseus/TODO.md`'s `.serena` entry, which can carry it; smallest action
      is closing it from the Osseus entry when either repo is next touched.
