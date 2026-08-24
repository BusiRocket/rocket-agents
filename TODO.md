# TODO — rocket-agents

> Consolidated from the accessible Claude, Codex, Cursor, and Antigravity project history plus the
> `~/p` meta backlog (routed 2026-08-13) and the archived `BusiRocket/agents-skills` backlog. Last
> reviewed: 2026-08-24, when the library's own content decisions moved to
> `~/p/rocket-agents-library/TODO.md` and every remaining item was given an explicit disposition.
> History coverage: Partial — Claude Code transcripts before 2026-07-19 no longer exist on disk
> (repo work starts 2026-02-27), and the 2026-07-19 audit scratchpad reports (`findings.md`,
> `findings30.md`) were reconstructed from Codex rollouts, not read from disk. Open items from
> `TODO-skills-audit.md` (append-only audit history) are tracked here; that file is no longer a
> backlog.
>
> States: `[ ]` pending · `[~]` partial or unverified · `[!]` blocked · `[x]` verified complete ·
> `[-]` obsolete or superseded. Closed work moves to `TODO_LOG.md`.

## Router and hooks

- [ ] Re-check `orca-cli` routing after another audit window. Decision 2026-08-24: `loop` got its
      lane (see `TODO_LOG.md`); `claude-in-chrome`, `dataviz`/`artifact-design` and `codex` were
      declined because their measured phrases are context statements or approvals with no
      generalizable trigger; `orca-cli` (2 hits, one an approval, but "el navegador de orca" is
      distinctive) was the only marginal case worth revisiting if it keeps appearing.

## Skills

- [ ] Pilot blind A/B evals on one BRP skill (with-skill vs without-skill, isolated contexts); if
      pass rates match, the skill adds nothing. Also pressure-test skill wording adversarially
      (Superpowers method). Needs authorization before running: every arm is a paid model call, and
      a meaningful sample is many of them. `claude plugin eval` exists as the harness, so the
      missing piece is a decision on which skill and how many cases, not tooling. Source:
      `~/p/brain/topics/claude-skills-ecosystem.md`.
- [ ] Decide whether to build a conversation-only "grill" gate skill for business decisions (offer,
      positioning, pricing), modeled on Pocock's `grill-me`: refuses to write anything, interviews
      instead; questions in rounds, with a question that depends on an unanswered one held for a
      later round; ~46 questions across 4 rounds is an ordinary session; ends when nothing is left
      to ask; questions needing something to react to are deferred to a mockup step. The rule that
      makes it work is the user's, not the skill's - "a session with no pushback from you is a
      session you didn't need". Cost reference: `/grilling` is 345 tokens invoked, because a
      gate-shaped skill keeps its body on demand. Blocked on a user decision, and if taken it needs
      a brainstorming session first: the question set is the product, not the wrapper. Source:
      `~/p/brain/topics/claude-skills-ecosystem.md` (2026-08-19 section).
- [ ] Candidate BRP rule/hook: require a screen-recording video attached to any PR that changes UI
      state (steipete's one-line AGENTS.md rule at openclaw; GitHub accepts programmatic video
      upload - worked example openclaw/openclaw#124013). Fits next to the existing
      evidence-before-claims posture. Blocked on a user decision rather than on work: a rule here
      changes the agent contract on every linked client, and this one would make a class of PR
      impossible to finish without recording a video. Source:
      `~/p/brain/topics/claude-code-practice.md` (2026-08-19 X sweep section).

## Skills library cleanup

> Decided 2026-08-17: curate one list and link it to every IDE including Antigravity, rather than
> the current split where Claude Code is offered 13 skills and the other 94 bundles reach only
> Codex. Nothing is deleted; unused bundles leave the default fan-out and stay in the repo.
> Measurements: `~/p/dotfiles/docs/machine-inventory/skills-triage.md`.
>
> The content decisions moved to `~/p/rocket-agents-library/TODO.md` on 2026-08-24 - deleting the
> Java/Spring bundles, the skill-by-skill triage, the 87 parked entries, the multi-surface
> capabilities, the two dropped classifications, the re-check window, and the five measured-but-
> unbuilt skill gaps. They are decisions about that repository's contents, and executing them here
> would edit another repo. What stays below is the part this engine owns.

- [ ] Link the curated list into `~/.claude/skills` and into Antigravity (`~/.gemini/config/skills`,
      which currently carries only the 7 BRP skills). Claude Code sees 13 of 273 skills today and
      all 13 are BRP; the rest were never offered to it. This is a machine mutation (`skills:link`)
      and needs explicit authorization.

## Skill library and learning loop

> Shipped 2026-08-18: the four curation states, seeding from the lock, per-skill curation, linking
> what is adopted, the transcript observer, trigger learning with secret redaction, delegated
> classification, the router audit, proposals and automatic parking behind a grace period. Claude
> Code went from 13 skills offered to 30. Spec and plan:
> `docs/superpowers/specs/2026-08-18-skill-library-and-learning-loop-design.md`.

- [~] Verify the second, unattended weekly-loop run: the 6-hourly `--if-due 7` schedule still has to
  prove it catches up after sleep without a manual kickstart (check `~/.agents-learning/reports/`
  after 2026-08-31). The judgement half closed 2026-08-24 (see `TODO_LOG.md`): the report's own park
  proposals were reviewed and endorsed - 11 promoted skills with zero invocations ride the auto-park
  grace period, and the promotions that fired (frontend-design, computer-use, orca-cli, the core
  lanes) stay.
- [!] Exercise patch reapplication against a real fork. Implemented and tested for the conflict
  case, never run for real. Blocked on its own precondition: nothing in the library is forked yet,
  so there is no upstream change to reapply a local patch onto. Unblock action: the first time a
  library skill is forked and its upstream moves, run the reapplication then.
- [!] Decide what to do with the 87 parked entries. Moved 2026-08-24 to
  `~/p/rocket-agents-library/TODO.md`, where the entries live; it is a content decision about that
  repository, not about this engine. Blocked here only in the sense that this repo cannot execute
  it.

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
- [~] Plugin manifest: capture, schema, parser, planner, the `machine:diff` lane and apply are all
  built and verified (2026-08-22 and 2026-08-24, see `TODO_LOG.md`). Apply drives the
  `claude plugin` CLI rather than editing its state files, and reports a version pin as manual work
  because the CLI cannot install a specific version. Remaining is one command, now that
  `machine:capture:plugins -- --manifest` emits the declarable shape - the `--json` capture never
  parsed, because it carries tri-state `enablement` while the manifest wants boolean `enabled`
  (found and fixed 2026-08-24):
  `pnpm run machine:capture:plugins -- --manifest > <dotfiles>/machine/plugins.json`. Verified to
  converge - that file diffed against this machine reports `plugins: converged, 0 changes` across
  all 37 plugins. Writing it into `BusiRocket/dotfiles` is a write to another repo, and running
  apply against this machine still needs explicit authorization; until the file exists the plugins
  domain reports `skipped`.
- [~] Plugin cache hygiene: the one-off sweep is done (2026-08-22, 2.5 GB to 271 MB) and the
  recurring policy is decided (2026-08-24): `machine:apply -- --prune-cache` removes cache
  directories belonging to no known marketplace, opt-in rather than automatic. Stale _version_
  entries inside known marketplaces are deliberately still not pruned, because capture does not
  resolve `settings.json` references and a `statusLine` can point into a version that reads as
  stale. Remaining: teach capture to resolve those references, then decide whether version pruning
  can be safe. The `realpath` constraint (13 of 37 plugins are recorded through the
  `~/.claude-favish/plugins` symlink) is already honoured by `toRealPath`. The accumulation rate is
  confirmed rather than assumed: `machine:capture:plugins` reported 19 orphan directories on
  2026-08-24, two days after the sweep that took the cache to zero.
- [~] Services: schema, both renderers, the diff domain and apply are built and verified (2026-08-22
  and 2026-08-24, see `TODO_LOG.md`). Apply writes each drifted unit and loads it (launchd
  `bootout`+`bootstrap`, systemd one `daemon-reload` plus `enable --now` on the timer), and the
  removal question is answered: apply never removes an undeclared unit, so the 25 hand-written
  LaunchAgents are safe. Remaining: write the real service descriptions, which carry machine values
  and belong in the private dotfiles repo; until they exist the services domain reports `skipped`.
  Running apply against this machine still needs explicit authorization.
- [~] Install provenance: the archive half is done (2026-08-24, see `TODO_LOG.md` — `agy` 1.1.19 and
  `herdr` 0.8.0 copied to `~/p/_archivar/handmade-binaries/` with SHA-256 sums; `npm ls -g` and
  `uv tool list` re-confirmed codegraph and serena-agent live in package managers). Remaining:
  extend the dotfiles runtime-inventory sweep method to read the two package managers (filed in
  `~/p/dotfiles/TODO.md`), and note that `agy` self-updates (1.1.17 -> 1.1.19 in two days), so the
  archive is a disaster copy, not a pin.
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
      repos. A leaked AWS key was used 11 minutes after the push in one documented case. Cheap and
      one-time, but it is a multi-repo change and enabling scanning is a write to GitHub settings,
      so it needs authorization and a named repo list before anything is installed. Tracked here by
      the 2026-08-13 routing decision even though execution spans `~/p`. Source:
      `~/p/brain/topics/app-security.md`.
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
      Out of this repository's scope to execute - it changes other projects' dependencies - so the
      smallest real step is to run it in one frontend when that project is next open, and file the
      result there. Tracked here by the 2026-08-13 routing decision. Source:
      `~/p/brain/topics/web-platform.md`.
- [ ] Decide the `security-guidance@claude-plugins-official` review layer. Identified 2026-08-24:
      this is not a local hook but the official plugin enabled in `~/.claude/settings.json`, and it
      has three layers - regex pattern warnings on edit (free), an LLM diff review on every turn end
      (the expensive one, Opus 4.7 by default), and an agentic reviewer on `git commit`. Cost is
      layer 2: ~$2,691/30d list-price equivalent (2,324 sessions, ~77/day) measured 2026-08-13, 1.7%
      escalation rate, no confirmed real finding in the sampled verdicts. Still running at the same
      rate - 450 of 756 sessions in the 7 days to 2026-08-24, 17 escalations. The levers are
      environment variables, so the choice is finer than keep/disable: `ENABLE_STOP_REVIEW=0` drops
      only layer 2 and keeps patterns plus commit review (recommended), `SECURITY_REVIEW_MODEL`
      moves it to a cheap model, `ENABLE_CODE_SECURITY_REVIEW=0` drops all LLM review,
      `SECURITY_GUIDANCE_DISABLE=1` kills the plugin. Needs a user decision; it changes machine
      configuration. Numbers in `TODO_LOG.md` 2026-08-13.

## Cross-project

- [ ] `~/p/RocketUpdater` (no TODO.md there yet): commit or discard its untracked `.serena/` state —
      already named in `~/p/osseus/TODO.md`'s `.serena` entry, which can carry it; smallest action
      is closing it from the Osseus entry when either repo is next touched.
