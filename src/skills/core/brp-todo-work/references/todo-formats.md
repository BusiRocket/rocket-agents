# TODO and log formats

## State legend

Add it to `TODO.md` when absent:

- `[ ]` pending
- `[~]` in progress, partially complete, or implemented but not validated
- `[!]` blocked by a named condition
- `[x]` verified complete
- `[-]` obsolete or superseded by a named replacement

Mark `[~]` as soon as work lands without completion evidence. Keep `[!]` in
`TODO.md` with the exact blocker and the smallest unblock action. Mark `[x]`
only when implementation, validation and intent agree. Use `[-]` only when the
original task is no longer valid, and name why. Merge duplicates and update
stale wording in place. Closed entries do not accumulate in the active backlog.

## `TODO.md` header

```md
# TODO

> Consolidated from the accessible Claude, Codex, Cursor, and Antigravity
> project history. Last reviewed: YYYY-MM-DD. History coverage: Complete |
> Partial.
>
> States: `[ ]` pending · `[~]` partial or unverified · `[!]` blocked · `[x]`
> verified complete · `[-]` obsolete or superseded. Closed work moves to
> `TODO_LOG.md`.
```

For partial coverage add one short sentence naming what was unavailable. No
executive summary.

## `TODO_LOG.md`

One entry per task or tightly related group, grouped by year and month, in a
single root file:

```md
# TODO Log

> Searchable record of closed project work. Active work lives in `TODO.md`.

## 2026

### 2026-07

- [x] 2026-07-23 — **Backend:** Prevent duplicate message records.
  - Result: Added an idempotent insert boundary.
  - Evidence: `pnpm test -- message-persistence`; commit or PR when available.
  - Files: `src/messages/insertMessage.ts`, `test/message-persistence.test.ts`.

- [-] 2026-07-23 — **Infrastructure:** Replace Redis with PostgreSQL.
  - Resolution: Superseded by the accepted Redis retention decision in ADR-12.
```

Evidence is a test name, command result, commit, PR, issue or report reference,
not a transcript. Treat the log as append-only history: correct material
mistakes with an explicit amendment rather than rewriting past evidence. Archive
only complete old years under `docs/todo-log/YYYY.md` if the file becomes
unwieldy, and never split more granularly than one file per year.
