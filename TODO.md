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

- [ ] Re-check `orca-cli` routing after another audit window. Decision 2026-08-24: `loop` got its
      lane (see `TODO_LOG.md`); `claude-in-chrome`, `dataviz`/`artifact-design` and `codex` were
      declined because their measured phrases are context statements or approvals with no
      generalizable trigger; `orca-cli` (2 hits, one an approval, but "el navegador de orca" is
      distinctive) was the only marginal case worth revisiting if it keeps appearing.

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

- [~] Verify the second, unattended weekly-loop run: the 6-hourly `--if-due 7` schedule still has to
  prove it catches up after sleep without a manual kickstart (check `~/.agents-learning/reports/`
  after 2026-08-31). The judgement half closed 2026-08-24 (see `TODO_LOG.md`): the report's own park
  proposals were reviewed and endorsed - 11 promoted skills with zero invocations ride the auto-park
  grace period, and the promotions that fired (frontend-design, computer-use, orca-cli, the core
  lanes) stay.
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
- [~] Plugin manifest: capture, schema, parser, planner, the `machine:diff` lane and apply are all
  built and verified (2026-08-22 and 2026-08-24, see `TODO_LOG.md`). Apply drives the `claude
  plugin` CLI rather than editing its state files, and reports a version pin as manual work because
  the CLI cannot install a specific version. Remaining: author the private `plugins.json` in
  `BusiRocket/dotfiles` from `pnpm run machine:capture:plugins -- --json`, which is where the real
  values belong; until it exists, the plugins domain reports `skipped`. Running apply against this
  machine still needs explicit authorization.
- [~] Plugin cache hygiene: the one-off sweep is done (2026-08-22, 2.5 GB to 271 MB) and the
  recurring policy is decided (2026-08-24): `machine:apply -- --prune-cache` removes cache
  directories belonging to no known marketplace, opt-in rather than automatic. Stale *version*
  entries inside known marketplaces are deliberately still not pruned, because capture does not
  resolve `settings.json` references and a `statusLine` can point into a version that reads as
  stale. Remaining: teach capture to resolve those references, then decide whether version pruning
  can be safe. The `realpath` constraint (13 of 37 plugins are recorded through the
  `~/.claude-favish/plugins` symlink) is already honoured by `toRealPath`.
- [~] Services: schema, both renderers, the diff domain and apply are built and verified
  (2026-08-22 and 2026-08-24, see `TODO_LOG.md`). Apply writes each drifted unit and loads it
  (launchd `bootout`+`bootstrap`, systemd one `daemon-reload` plus `enable --now` on the timer),
  and the removal question is answered: apply never removes an undeclared unit, so the 25
  hand-written LaunchAgents are safe. Remaining: write the real service descriptions, which carry
  machine values and belong in the private dotfiles repo; until they exist the services domain
  reports `skipped`. Running apply against this machine still needs explicit authorization.
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
      repos. A leaked AWS key was used 11 minutes after the push in one documented case. Cheap,
      one-time. Source: `~/p/brain/topics/app-security.md`.
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

- [ ] `RUN_LIVE_PROBE_TEST` flakes under machine load: its live probes run with a ~1s timeout, and
      with load average ~40 (many concurrent agent sessions) spawn latency alone exceeds it - all
      failures land at ~1003ms. Observed 2026-08-24: pass 8/0 standalone on a quiet machine, fail
      3-5 both standalone and inside `pnpm run check` while loaded, with identical code. Smallest
      fix: raise the test's probe timeout or make it load-aware; until then a red check on a busy
      machine needs one quiet-machine rerun before it is believed.

- [ ] Dependency sweep for native replacements across the `~/p` frontends: `Intl.*` for formatting,
      `crypto.randomUUID`, `structuredClone`, `URLSearchParams`, `AbortController`. Measured
      elsewhere: audit vulnerabilities 17 -> 5. Fewer deps also shrinks the supply-chain surface.
      Source: `~/p/brain/topics/web-platform.md`.
- [ ] Decide whether to keep the `security-review` auto fan-out: measured 2026-08-13 at ~$2,691/30d
      list-price equivalent (2,324 sessions, ~77/day, Opus 4.7) with a ~1.7% candidate-flag rate and
      no confirmed real finding in the sampled verdicts. Options: keep (subscription absorbs it),
      scope to risky paths only, or disable. Numbers in `TODO_LOG.md` 2026-08-13.

## Cross-project

- [ ] `~/p/RocketUpdater` (no TODO.md there yet): commit or discard its untracked `.serena/` state —
      already named in `~/p/osseus/TODO.md`'s `.serena` entry, which can carry it; smallest action
      is closing it from the Osseus entry when either repo is next touched.
