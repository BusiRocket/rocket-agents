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

## Codex skills budget

- [x] Codex skills budget: `skills:link` now generates the trim. Codex treats
      `~/.agents/skills` as a discovery root and finds 314 `SKILL.md` there,
      which overflows its skills context budget: it then strips every
      description and omits skills, so it can route to none of them. Disabling
      the aggregate parents does nothing because the nested children are
      discovered independently. `pnpm run skills:link` writes 270
      `enabled = false` entries between `# BEGIN/END generated skills trim`
      markers in `~/.codex/config.toml`, derived from what was actually linked
      into `~/.claude/skills`, so the trim cannot drift from the curated set.
      See `TODO_LOG.md` for the evidence and for the token measurement that
      turned out to be unreliable.

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

- [ ] Deliver the curated list to Antigravity. Claude is done: it already
      carries all 42 curated skills natively (verified 2026-08-25,
      `library:link --target claude` plans 42 with 0 foreign and creates nothing
      new), so the original framing - "Claude Code sees 13 of 273" - was stale
      by a week. Antigravity is the real gap and the current tooling cannot fill
      it: `library:link` symlinks, while Antigravity's registry entry declares
      `linkStrategy: copy` with `flattenSkills`, and the dedicated
      `skills:link:antigravity` installs this repo's own `src/skills` rather
      than the curated library. Smallest next step: teach the Antigravity
      installer to read the curation manifest, or give `library:link` a copy
      strategy.

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
- [ ] Plugins apply against this machine is the only step left, and it needs
      explicit authorization. Everything else is done and verified (2026-08-22
      and 2026-08-24, see `TODO_LOG.md`): `machine/plugins.json` declares all 37
      plugins and diffs `converged`, so an apply today would be a no-op. The
      reason to run one is the next change, not this state. Note the one manual
      case the CLI forces: a version pin is reported, never executed, because
      `claude plugin install` has no version flag.
- [~] Plugin cache hygiene: the one-off sweep is done (2026-08-22, 2.5 GB to 271
  MB) and the recurring policy is decided (2026-08-24):
  `machine:apply -- --prune-cache` removes cache directories belonging to no
  known marketplace, opt-in rather than automatic. Stale _version_ entries
  inside known marketplaces are deliberately still not pruned, because capture
  does not resolve `settings.json` references and a `statusLine` can point into
  a version that reads as stale. Remaining: teach capture to resolve those
  references, then decide whether version pruning can be safe. The `realpath`
  constraint (13 of 37 plugins are recorded through the
  `~/.claude-favish/plugins` symlink) is already honoured by `toRealPath`. The
  accumulation rate is confirmed rather than assumed: `machine:capture:plugins`
  reported 19 orphan directories on 2026-08-24, two days after the sweep that
  took the cache to zero.
- [ ] Services: `machine/services.json` now describes
      `com.cristian.library-loop`, and the schema grew interval schedules to
      make that possible - the loop polls on `StartInterval` because a calendar
      slot the machine sleeps through is never caught up, and the schema had
      only calendar slots (2026-08-24, see `TODO_LOG.md`). `machine:diff`
      reports one `update` for it, and that update is cosmetic: `plutil` parses
      the rendered unit and the installed plist to identical JSON, so the
      difference is XML escaping of quotes only. Two things remain, both needing
      authorization: run an apply to canonicalise that one file, and decide
      whether the other 24 hand-written LaunchAgents get described here. Apply
      never removes an undeclared unit, so leaving them undeclared is safe.
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

- [ ] Canonical event IDs are conversation-local in practice:
      `scripts/lib/conversations/conversationEventFromRecord.ts:20` derives the
      event ID from `event_index + text` with no conversation or provider
      identity, and real cross-conversation collisions were measured on
      2026-08-27 (OpenCode: 17 collisions across 2,586 records; Cursor: 73
      across 67,568). Atrium works around it by keying on
      `sha256(conversation_id, event_id)`; the canonical contract should carry
      conversation identity in the event ID itself. Filed from
      `~/p/atrium/TODO.md`. **Held for a coordinated change (decided
      2026-08-31):** changing the ID changes a contract Atrium already consumes,
      so doing it here alone would duplicate records or break identity
      continuity on its side. Execute it together with Atrium's migration, in
      one pass, not as an isolated backlog item here.
- [ ] Find where Trae and Windsurf actually keep their conversations, if
      anywhere on this machine. Answered 2026-08-31 for the old question (the
      exporters were reading VS Code editor state, see `TODO_LOG.md`), and both
      now export zero records honestly. What is still unknown is whether either
      product stores dialogue somewhere outside the roots in
      `sourceDefinitions.ts`. Smallest step: use each app once, then diff the
      filesystem for what it wrote. Until then their entries in the source
      catalog are aspirational.
- [~] Oversized artifacts vs export, two stages. **Interim shipped 2026-08-27**
  (`bfa54ec`): `--allow-partial` writes the export with a manifest that declares
  `complete:false` and lists every skip; default stays fail-closed. That
  unblocked the codex source (4,356 records exported; the two >64 MiB rollouts
  2026-08-19T21-06-36 and 2026-08-26T13-41-24 remain skipped and declared).
  **Real fix still open**: stream JSONL artifacts line-by-line so the 64 MiB
  bound applies per line/record instead of per file
  (`readTextConversationDocument.ts` slurps whole files), normalize
  incrementally while hashing the source, and fragment a normalized conversation
  that exceeds the record cap deterministically. Then the two oversized rollouts
  get captured instead of skipped and `--allow-partial` returns to being a rare
  recovery flag. Shape agreed in the 2026-08-27 Atrium design consult; reject
  raising the limit or truncating files.

## Cross-project

- [ ] `~/p/RocketUpdater` (no TODO.md there yet): commit or discard its
      untracked `.serena/` state — already named in `~/p/osseus/TODO.md`'s
      `.serena` entry, which can carry it; smallest action is closing it from
      the Osseus entry when either repo is next touched.

## Baseline gate debt

Adoptados los gates de `@busirocket` en pleno el 2026-08-26.

- [ ] **80 ficheros que nada alcanzable desde los CLIs importa**, congelados en
      `ignore` dentro de `knip.config.ts`. El numero depende de que se declare
      como entry, y las dos configuraciones obvias mienten: con `scripts/**`
      entero como entry cada helper es su propia raiz y **nada** se reporta
      nunca (escondia 47 exports muertos); con solo `bin/` y `commands/` salian
      **298** ficheros muertos falsos, porque los verificadores `*_TEST.ts`
      alcanzan el resto. La configuracion actual usa las entradas reales -- los
      63 ficheros que invocan los `scripts` del `package.json`, mas los
      `*_TEST.ts` y `golden/` -- y da 80. Borrar fichero y linea a la vez.

- [~] **La capa ESLint sigue montada a mano y no compone
  `@busirocket/eslint-config`.** Ensambla los mismos plugins uno a uno (js,
  import-x, unicorn, sonarjs, boundaries, code-policy, check-file) mas
  `check-file`, que el baseline no trae. No se toco porque componer el paquete
  podria perder reglas. El coste de mantenerla aparte ya se vio en esta
  adopcion: `knip.config.ts` y `.dependency-cruiser.cjs` fallaban con "was not
  found by the project service", que es exactamente el problema que
  `createBaseConfig` resuelve con `allowDefaultProject` desde eslint-config
  0.6.0. Comparar regla a regla y decidir.

- [x] **`.prettierrc` y `prettier.config.mjs` se contradecian**: uno decia
      `trailingComma: "all"` y el otro `"es5"`. Uno de los dos estaba muerto y
      nadie lo sabia. `.prettierrc` borrado; la config ahora reexporta
      `@busirocket/prettier-config`.
