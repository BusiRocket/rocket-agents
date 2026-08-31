# TODO — rocket-agents

> Consolidated from the accessible Claude, Codex, Cursor, and Antigravity
> project history plus the `~/p` meta backlog (routed 2026-08-13) and the
> archived `BusiRocket/agents-skills` backlog. Last reviewed: 2026-08-24, when
> the library's own content decisions moved to
> `~/p/rocket-agents-library/TODO.md` and every remaining item was given an
> explicit disposition. History coverage: Partial — Claude Code transcripts
> before 2026-07-19 no longer exist on disk (repo work starts 2026-02-27), and
> the 2026-07-19 audit scratchpad reports (`findings.md`, `findings30.md`) were
> reconstructed from Codex rollouts, not read from disk. Open items from
> `TODO-skills-audit.md` (append-only audit history) are tracked here; that file
> is no longer a backlog.
>
> States: `[ ]` pending · `[~]` partial or unverified · `[!]` blocked · `[x]`
> verified complete · `[-]` obsolete or superseded. Closed work moves to
> `TODO_LOG.md`.

## Skills library cleanup

> Decided 2026-08-17: curate one list and link it to every IDE including
> Antigravity, rather than the current split where Claude Code is offered 13
> skills and the other 94 bundles reach only Codex. Nothing is deleted; unused
> bundles leave the default fan-out and stay in the repo. Measurements:
> `~/p/dotfiles/docs/machine-inventory/skills-triage.md`.
>
> The content decisions moved to `~/p/rocket-agents-library/TODO.md` on
> 2026-08-24 - deleting the Java/Spring bundles, the skill-by-skill triage, the
> 87 parked entries, the multi-surface capabilities, the two dropped
> classifications, the re-check window, and the five measured-but- unbuilt skill
> gaps. They are decisions about that repository's contents, and executing them
> here would edit another repo. What stays below is the part this engine owns.

Nothing open: the curated list reaches Claude and Antigravity, and the remaining
content decisions live in `~/p/rocket-agents-library/TODO.md`.

## Skill library and learning loop

> Shipped 2026-08-18: the four curation states, seeding from the lock, per-skill
> curation, linking what is adopted, the transcript observer, trigger learning
> with secret redaction, delegated classification, the router audit, proposals
> and automatic parking behind a grace period. Claude Code went from 13 skills
> offered to 30. Spec and plan:
> `docs/superpowers/specs/2026-08-18-skill-library-and-learning-loop-design.md`.

- [!] Exercise patch reapplication against a real fork. Implemented and tested
  for the conflict case, never run for real. Blocked on its own precondition:
  nothing in the library is forked yet, so there is no upstream change to
  reapply a local patch onto. Unblock action: the first time a library skill is
  forked and its upstream moves, run the reapplication then.
- [!] Decide what to do with the 87 parked entries. Moved 2026-08-24 to
  `~/p/rocket-agents-library/TODO.md`, where the entries live; it is a content
  decision about that repository, not about this engine. Blocked here only in
  the sense that this repo cannot execute it.

## Machine provisioning

> Scope decided 2026-08-17: this repo stays public and data-free and holds the
> engine (schemas, capture readers, per-target renderers, CLI). The manifests
> carrying real values stay in the private `BusiRocket/dotfiles` repo, which
> already owns brew, shell, symlinks, launchd and secrets. Measured inventories
> behind these items: `~/p/dotfiles/docs/machine-inventory/`.

- [!] Complete account-local authentication on `macmini`. Managed configuration
  is converged, but `agents:doctor` still reports Cursor MCP failed; Claude
  needs Cloudflare in personal and Favish plus OpenSEO in personal. ZeroHedge is
  optional and absent in both Claude profiles. Authentication requires the
  user's browser/account session and must not be copied from another machine.
  User decision 2026-08-22: will log in on the mini on demand, when those
  services are next needed there — not a scheduled task. Follow
  `docs/runbooks/claude-connector-authentication.md`, then verify with
  `pnpm run connectors:doctor -- --json` and `pnpm run agents:doctor -- --json`
  on the mini.
- [ ] Decide whether `context7` should reach gemini and cursor. Now executable
      in isolation: `machine:apply -- --domain mcp`. It is the only real gap
      `machine:diff` reports after the 2026-08-31 manifest repair: the manifest
      declares it for codex, gemini and cursor, and only codex has it. Applying
      writes into two other tools' configuration and needs `CONTEXT7_API_KEY`,
      so it waits for a yes. Everything else - plugins, security, capabilities,
      services - is converged.
- [~] Install provenance: the archive half is done (2026-08-24, see
  `TODO_LOG.md` — `agy` 1.1.19 and `herdr` 0.8.0 copied to
  `~/p/_archivar/handmade-binaries/` with SHA-256 sums; `npm ls -g` and
  `uv tool list` re-confirmed codegraph and serena-agent live in package
  managers). Remaining: extend the dotfiles runtime-inventory sweep method to
  read the two package managers (filed in `~/p/dotfiles/TODO.md`), and note that
  `agy` self-updates (1.1.17 -> 1.1.19 in two days), so the archive is a
  disaster copy, not a pin.
- [ ] `config` apply must merge, never replace: third-party tools (orca, atuin,
      warp) inject hooks into `settings.json` without asking, and a full rewrite
      drops them. Verified 2026-08-22 that this is a constraint on unbuilt code,
      not a live defect: there is no `config` domain, and the one settings
      writer that exists (`domains/security/writeClaudeSettings.ts`) already
      spreads the existing document. Carry the constraint into the domain when
      it is built.

## Supply chain and secrets

- [!] Rotate the still-live credentials recovered on 2026-08-17 from
  `~/.gemini/mcp_config.json` (2 GitHub PATs, Context7, Bright Data, Firecrawl,
  Browser Use, n8n JWT, Brave Search; the two ZeroHedge MongoDB URIs only need
  revoking). Values and uses in `~/p/brain/business/misc-credentials.md`. State
  2026-08-22: user explicitly deferred the rotation ("de momento no voy a rotar
  ninguna"); neo cleanup done (no `mcp_config.json` in `/root/.gemini`, and
  `p/brain`/`p/vault` copies deleted); remaining exposure surface is
  `portatil`'s legacy `~/.gemini` (machine unreachable 2026-08-22 — delete it
  when the laptop is next on the network) plus the providers themselves. Unblock
  action when resumed: the per-provider dashboard checklist from the 2026-08-22
  session.
- [ ] Install `detect-secrets` as a pre-commit hook and enable GitHub secret
      scanning on the active repos. A leaked AWS key was used 11 minutes after
      the push in one documented case. Cheap and one-time, but it is a
      multi-repo change and enabling scanning is a write to GitHub settings, so
      it needs authorization and a named repo list before anything is installed.
      Tracked here by the 2026-08-13 routing decision even though execution
      spans `~/p`. Source: `~/p/brain/topics/app-security.md`.
- [ ] Adopt pnpm 11 supply-chain controls across the other `~/p` repos:
      `minimumReleaseAge: 1440` (24h cooldown defeats the compromised-token
      window) and `blockExoticSubdeps: true`. Needs Node 22 and pnpm 11; check
      per repo. This repository was verified compliant 2026-08-22
      (`pnpm-workspace.yaml`), so only the cross-project sweep remains and it is
      out of this repository's scope — file per repo when each is next touched.
      Source: `~/p/brain/topics/supply-chain-security.md`.
- [!] Add `uv export --format requirements.txt` to any CI that adopts `uv`, as
  the exit ramp now that OpenAI owns it — one line, converts lock-in into a
  preference. Blocked by its own precondition: a 2026-08-22 sweep of
  `~/p/*/.github/workflows` found no workflow using `uv`. Unblock action: apply
  it in the first workflow that adopts `uv`. Source:
  `~/p/brain/topics/supply-chain-security.md`.

## Harness

- [ ] Dependency sweep for native replacements across the `~/p` frontends:
      `Intl.*` for formatting, `crypto.randomUUID`, `structuredClone`,
      `URLSearchParams`, `AbortController`. Measured elsewhere: audit
      vulnerabilities 17 -> 5. Fewer deps also shrinks the supply-chain surface.
      Out of this repository's scope to execute - it changes other projects'
      dependencies - so the smallest real step is to run it in one frontend when
      that project is next open, and file the result there. Tracked here by the
      2026-08-13 routing decision. Source: `~/p/brain/topics/web-platform.md`.

## Conversations export

- [~] Canonical event IDs: the producer side landed 2026-08-31 (`0f7217d`) - an
  event id is now `sha256(conversation_record_id, old_id)`, schema version 2,
  and version 1 records still read. Measured on the live Cursor archive: 119
  cross-conversation collisions under the old rule, 0 under the new one.
  **Remaining, and it is Atrium's side:** its synthesis registry
  (`~/.local/share/atrium/synthesis/records/*.json`) durably stores `event_ids`,
  `episode_id` and job keys, so until it is re-keyed `synthesize` treats
  unchanged episodes as new and `ingest-synthesis` indexes both generations,
  silently doubling synthesis results. The re-key is deterministic - the new id
  is a pure function of the old - so no re-synthesis and no model quota is
  needed. Running it against `~/.local/share/atrium` is durable-data work and
  waits for an explicit go.
- [~] Oversized artifacts vs export. **Streaming shipped 2026-08-31**: a
  `.jsonl` artifact over the 64 MiB bound is now normalized line by line
  (`streamJsonlConversationRecord`), so the bound applies per record instead of
  per file, and the codex source exports `complete: true` with `skipped: 0` and
  16,424 records - the three oversized rollouts included. `--allow-partial` is
  back to being a rare recovery flag. **Remaining**: fragmenting a normalized
  conversation that exceeds the record cap is still unbuilt and, measured on
  2026-08-31, still unneeded - the largest serialized record in a full codex
  export is 8.4 MB against a 64 MiB cap. Build it when a real conversation
  approaches the cap, not before. Files over the bound that are not
  line-delimited still fail, and are reported as skips rather than silently
  truncated.

## Cross-project

Nothing open.

## Baseline gate debt

Adoptados los gates de `@busirocket` en pleno el 2026-08-26.

Nada abierto: los 60 ficheros muertos se borraron el 2026-08-31 y `knip` entro
en `pnpm run check` a traves de `check:quality`.
