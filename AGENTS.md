# Rocket Agents repository instructions

## What this is

This public TypeScript control plane owns BRP policy, adapters, diagnostics,
machine convergence, and safe conversation transport. Changes can alter the
agent environment on every linked client.

**Do not run `machine:apply`, `machine:rollback`, `rules:link`, `skills:link`,
`hooks:link`, a conversation `--apply` against durable user data, or a release
without explicit human authorization.** Read-only inspection, builds, tests,
doctors, diffs, conversation dry-runs, and apply-path tests wholly contained in
a newly created OS temporary directory are safe.

## Branch model

`main` is the default branch and tracks `origin/main`. Make changes on the
current user-selected branch; never rewrite shared history.

## Build and run

- Runtime: Node 22.13 or newer; package manager: pnpm 11.15.0.
- Install: `pnpm install --frozen-lockfile`.
- Build generated rules, skills, agents, and plugins: `pnpm run build`.
- Full formatting, lint, type, test, portability, and hygiene gate:
  `pnpm run check`.
- Generated output under `dist/` is ignored. Edit canonical sources under `src/`
  and `scripts/`.

## Smoke test

Verified commands:

```bash
pnpm run type-check
pnpm run conversations:test
pnpm run conversations:doctor -- --source pi --json
```

The first two exit zero. The doctor returns JSON with `ok: true`; an unavailable
optional source is reported rather than treated as a failure.

## Distribution

This repository is not a hosted service. `pnpm run build` creates local
distribution artifacts. Link commands copy or link those artifacts into
user-level agent configuration and therefore count as machine mutations.
Releases use the `brp-release` workflow.

## Cross-repo interactions

- `~/p/rocket-agents-library` owns curated skill sources consumed by the linker.
- `~/p/dotfiles` owns host bootstrap, private machine manifests, and scheduled
  invocations.
- `~/p/mempalace` owns derived conversation indexing and semantic retrieval.
- `~/p/brain` owns deliberate, human-authored knowledge.

## Security

- Never commit secrets or captured conversations. Tracked manifests contain
  environment references, never credential values.
- Conversation capture is read-only. Exports redact recognized secrets, omit
  credential stores, reject unsafe paths, use SHA-256 manifests, and write mode
  `0600`.
- SQLite sources are queried read-only through allowlisted conversation tables;
  databases, cookies, auth state, and sidecars are never transported.

## Conventions

- All code, comments, docs, identifiers, and commit messages are English.
- One file contains one exported unit and one responsibility. Dependencies are
  explicit imports.
- Existing migrations require explicit user confirmation before editing.
- Use `apply_patch` for source edits. Stage only intended paths; never use
  `git add -A`.
