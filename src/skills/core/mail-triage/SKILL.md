---
name: mail-triage
description:
  Files every inbox message into the account's own folder taxonomy and extracts
  the actionable ones into TODOs in the repo that owns the work. Trigger when
  the ask is to look at the mail, clear or organise an inbox, turn mail into
  tasks, or archive what is already handled, for one account or for all of them.
  Triggers (ES) are mira el correo, revisa el buzon, ordena la bandeja, pasa el
  correo a TODOs, archiva lo hecho. Do not use for composing or answering a
  single message, for reading one thread to answer a question, or for the
  quarterly invoice reconciliation (invoice-quarter-close).
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, TodoWrite
argument-hint: [account-address | --all]
---

## Rules

- **The store is the truth, the CLI is the hands.** Read state with
  `vexa folders list` and `vexa messages`; mutate only with `vexa move` and
  `vexa trash`. Never write to `vexa.db` directly - the app is usually running
  against it.
- **Archiving is authorised, deleting is not.** Filing into folders and creating
  folders need no approval. `vexa trash` needs the human to say yes to that
  specific list, every time. Nothing is ever expunged.
- **Never send.** Drafting a reply is in scope; sending one is a separate ask.
- **A TODO goes to the repository that owns the work**, never to a mailbox inbox
  file. `~/p/TODO.md` is the fallback for what no repository owns, under a dated
  `## <Account> mailbox pass (YYYY-MM-DD)` section - that convention already
  exists there, follow it.
- **Every TODO carries its evidence**: sender, date, and the quoted line that
  makes it actionable. A TODO that cannot be traced back to a message is a
  guess.
- Read `references/vexa-store.md` before the first command and
  `references/routing.md` before writing any rule.

## Workflow

1. **Load the rules.** `learning/mail-triage/_global.json` then `<account>.json`
   from the same directory (see `references/routing.md`). The per-account file
   wins. Note which senders in the inbox no rule covers - those are the only
   ones needing judgement.
2. **Census.** `vexa folders list <account>` for the destinations that exist,
   and `vexa messages --account <a> --folder-role inbox` for what is in the
   inbox. Group by sender. Do not read bodies yet.
3. **Classify the uncovered senders**, cheapest signal first: the sender profile
   (`vexa sender-profiles`) says whether anyone ever replied to them, and
   enrichment says what the classifier thought - when it ran. Read a body only
   when the subject genuinely does not settle it.
4. **Plan, and let the human see it.** One line per rule: sender, destination,
   count, and whether it produces a TODO. Dry-run every rule (`--dry-run` prints
   `would_move`) before applying anything.
5. **Apply, batched by destination.** Group every sender that shares a
   destination into one `vexa move` call with repeated `--from`. Measured
   2026-09-07: about 10 s per invocation against about 1 s per message, so
   batching is worth roughly five times on a real pass.
6. **Verify, then heal.** Re-read the folder counts and compare against the
   plan. Any rule that moved fewer than `would_move`, returned `failed` ids or
   errored gets one retry; see the failure table in `references/vexa-store.md`
   for which errors are worth retrying and which need a different action. Report
   what still fails. Never report a pass as clean without this step.
7. **Write the TODOs**, routed per the Rules above, and update the routing map
   with what was learned (`references/routing.md`, "Writing back").
8. **List the deletion candidates and stop.** Cold outreach and dead
   subscriptions go in a list for the human, not to `vexa trash`.

## Output

- Return: messages filed and where, the inbox count before and after, the TODOs
  written with their repository, the deletion candidates awaiting a decision,
  and anything that failed twice with its exact error.
