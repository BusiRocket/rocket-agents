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
- [ ] Turn on GitHub secret scanning and push protection, then close the hook
      gap. Surveyed 2026-08-31: of 134 repositories under `~/p`, 18 carry a
      secret hook (all lefthook + gitleaks, this repo among them) and 116 carry
      none. But the per-repo hook is the weaker lever - it only guards the
      machine it is installed on. GitHub's own scanning is free on public
      repositories and can be defaulted for a whole organisation, and it is
      **disabled**: verified against `BusiRocket/rocket-agents`, which returns
      `secret_scanning: disabled, push_protection: disabled`. Private
      repositories return `null` for both, so they need Advanced Security and
      stay on hooks. The user-owned public surface is 14 repositories under
      BusiRocket and 18 under CristianDeluxe; Favish and client organisations
      are not ours to change. Smallest step, and it needs a yes because it
      writes GitHub settings: enable the organisation default for those two,
      then add gitleaks to the private repositories that are actually active.
      Source: `~/p/brain/topics/app-security.md`.
- [ ] Adopt pnpm 11 supply-chain controls across the other `~/p` repos:
      `minimumReleaseAge: 1440` (a 24h cooldown defeats the compromised-token
      window) and `blockExoticSubdeps: true`. Surveyed 2026-08-31: of 135
      repositories, 44 use pnpm and only 9 declare `minimumReleaseAge` - this
      repository among them. The other 35 are listed by the survey command
      below; several are dormant, so the useful cut is the ones still being
      installed. Executing it here would edit other repositories, so it stays a
      per-repo action taken when each is next touched. Command:
      `for d in ~/p/*/; do ... grep minimumReleaseAge ...` (see `TODO_LOG.md`
      2026-08-31 for the exact sweep). Source:
      `~/p/brain/topics/supply-chain-security.md`.
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

- [ ] Remote-export adapter family (ChatGPT, Grok): design spiked 2026-09-01 at
      `~/p/atrium/docs/designs/remote-export-adapter-family.md` — inbox
      directory of vendor ZIPs content-addressed on arrival, vendor parser,
      shared redaction and manifest path, `complete:false` with per-source
      `exportedAt` staleness. Both vendors ship official JSON account exports
      (ChatGPT Settings -> Data Controls; Grok `accounts.x.ai/data`); no
      scraping. Smallest next step: request both exports, drop them in the inbox
      layout, write the ChatGPT `conversations.json` parser against the real
      file.

- [~] Canonical event IDs. Producer side landed 2026-08-31 (`0f7217d`,
  `5560479`): the id is `sha256(conversation_record_id, old_id)`, schema version
  2, version 1 still readable, and records are upgraded at the store's read
  boundary so a manifest can never outrank the records under it. Measured on the
  live Cursor archive: 119 cross-conversation collisions under the old rule, 0
  under the new one. Atrium's side is built too - `atrium rekey-synthesis`
  (`b76e0ea`, plus the backup in `c6b0b47`) re-keys the 16,148 synthesis records
  deterministically instead of paying for their output twice; verified here at
  85 tests passing and a plan of 16,148 with 0 collisions, nothing written.
  **Remaining, and it needs a window rather than more code:** upgrade the
  archive records, then `rekey-synthesis --apply`, then `ingest-synthesis`, with
  the drip loop paused. That is durable-data work on two stores and waits for an
  explicit go. Exposure is smaller than it looks: `mergeFragment` returns
  `duplicate` on an unchanged `contentSha256`, so only conversations whose
  source artifact changes flip to v2 ids.
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

- [ ] `redactSensitiveText` is not idempotent:
      `Authorization: Bearer     [REDACTED:token]` re-matches its own marker on
      every pass - the text is stable, the count is not. So
      `provenance.redactions` inflates on every re-capture of unchanged text,
      and any "does this still need redaction?" check has to compare text rather
      than counts. Found 2026-08-31 while measuring the archive; it made a first
      measurement wrong by 515 records. Owned by the archive-format session
      while it holds `scripts/lib/conversations/`.
- [ ] Event text contains raw U+2028 and U+2029, and Node's `readline` treats
      both as line terminators while `JSON.parse` accepts them unescaped inside
      strings. Measured on the live archive: 1,690 U+2028 plus 3 U+2029, so a
      readline-based reader sees 32,434 lines where the file has 30,741 and
      mangles 1,634 records into unparseable fragments. Reproduced twice.
      Nothing in this repository is affected - `forEachLfLine` splits on `\n`
      alone - and Atrium's archive readers iterate the file handle, which is
      also safe; Python's `str.splitlines()` would not be. The rule for any new
      format and any new consumer: split on `\n` only, never `readline` or
      `splitlines`. A first version of this entry blamed lone CR; the archive
      contains zero CR bytes, and the corrected cause was found by probing each
      separator class.
- [ ] Redaction cannot reach an already-archived record. `contentSha256` hashes
      the source artifact, so `mergeFragment` returns `duplicate` when the
      source is unchanged and an improved redactor never revisits the record;
      when the source does change, event ids derive from the redacted text, so
      the re-redacted event gets a new id and the reducer keeps both variants.
      Measured 2026-08-31: across all 30,740 records and 1,704,054 events, the
      current redactor would change nothing, so this is a contingency rather
      than a live exposure - and the sources themselves are unredacted plaintext
      on disk, so rotation, not scrubbing, is the control for a leaked
      credential. The fix in any format is an explicit withdraw-and-republish
      path; recorded for whichever archive format lands.
- [~] Segment archive, stage 2 (`8cc2849`). Landed: atomic content-addressed
  publication (temp write, file fsync, hard link, directory fsync), the
  generation manifest and its base sentinel, one disposable SQLite state holding
  segments, fragments, materialized records, artifact fingerprints and pending
  Atrium deliveries, incremental capture keyed by
  `(source, relativePath, storageKind)` over an `O_NOFOLLOW` fingerprint, a
  chunked v1 migration, a verifier that builds its own state, and
  `conversations:capture|migrate-segments|verify-segments|benchmark-segments`.
  Measured on 25,000 synthetic artifacts, one process per pass: warm no-op 1.91s
  reading 0 bytes and writing no segment; one changed artifact 1.72s reading
  only its 2,096 bytes; one new conversation 1.59s; peak RSS 261 MB on the
  changed pass. Against the measured v1 baselines of 226.91s and 132.36s that is
  132x and 83x. **Remaining, and it is stage 3:** erasure apply/verify, object
  transport between installations, handing the pending slice to
  `atrium ingest --partial`, and the scheduler/hook freeze sentinel. Nothing is
  pointed at `~/.local/share/rocket-agents` yet.
- [ ] JSONL suffix resume is deliberately unbuilt. A changed artifact is
      recaptured whole. Measured at 25,000 artifacts the changed pass costs
      1.72s against a 22.691s bound, so the checkpoint machinery - prefix chunk
      hashes, a cached normalized accumulator, an incomplete-tail boundary - is
      correctness surface nobody is paying for yet. Build it when a real
      artifact misses the bound, not before.
- [ ] A capture publishes at most 2,000 fragments per segment
      (`CONVERSATION_SEGMENT_FRAGMENT_LIMIT`). The bound exists because staged
      fragments live in memory: at 25,000 artifacts in one segment, peak RSS
      reached 602 MB and the segment was 44 MB. The number is a guess informed
      by one measurement; revisit it when the first real seeding pass runs.

## Cross-project

Nothing open.

## Baseline gate debt

Adoptados los gates de `@busirocket` en pleno el 2026-08-26.

Nada abierto: los 60 ficheros muertos se borraron el 2026-08-31 y `knip` entro
en `pnpm run check` a traves de `check:quality`.
