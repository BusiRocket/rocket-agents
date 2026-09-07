# The routing map, and how it learns

## Where it lives

    ~/.agents/learning/mail-triage/_global.json      rules true for every account
    ~/.agents/learning/mail-triage/<address>.json    rules for one account

Both are versioned in `rocket-agents-library`, so every decision is a diff with
an author and a date. That is the whole point of keeping them here rather than
in Vexa's own `rules` table: a routing choice is a judgement about someone's
business, and it should be reviewable as one.

Vexa's `rules` table is the complement, not the competitor. It applies
`sender`/`domain`/`subject` matches server-side between passes, so once a rule
here has proven itself, mirroring the dull ones (newsletters, notifications)
into that table keeps the inbox clean without anyone running this skill. Mirror
only what is stable; never mirror a rule that produces a TODO.

## Shape

```json
{
  "version": 1,
  "account": "info@busirocket.com",
  "rules": [
    {
      "match": { "from": "sa@ahrefs.com" },
      "folder": "INBOX.Proyectos.SEO",
      "todo": { "repo": "~/p/busirocket", "section": "SEO health" },
      "why": "site audit alerts; a crawl failure is actionable, the rest is noise",
      "learned": "2026-09-07"
    },
    {
      "match": { "domain": "instagram.com" },
      "folder": "INBOX.Proveedores.Facebook",
      "todo": null,
      "why": "recaps, never actionable",
      "learned": "2026-09-07"
    }
  ]
}
```

- `match` takes `from` (exact address), `domain`, or `subject` (substring). The
  most specific match wins; `_global.json` loses to the account file.
- `folder` is the wire path, exactly as `vexa folders list` prints it.
- `todo` is `null` for pure filing, or names the repository that owns the work
  and the section its entries belong under.
- `why` is not decoration. A rule whose reason nobody can reconstruct is a rule
  nobody dares change.

## Writing back

Three moments, and only three:

1. **A sender no rule covered was classified and the human did not correct it.**
   Write the rule with `"learned"` set to today.
2. **The human corrected a decision.** Their correction replaces the rule, and
   `why` records what was wrong with the old one. A correction always wins over
   an inference.
3. **A destination folder no longer exists.** Mark the rule
   `"broken": "<what happened>"` instead of deleting it, and surface it in the
   report. A rule that fails silently is worse than no rule.

Never write a rule from a single message when the sender has one message in the
whole store: one arrival is not a pattern. Wait for the second.

## Deciding a folder for a sender with no rule

In order, stopping at the first that answers:

1. **An existing folder already holds mail from this sender.** Use it. The
   account's taxonomy is the client's own filing habit and it beats any scheme
   invented here.
2. **The sender is a vendor, a client or a project** that has a folder. Use it,
   even if this particular message is unusual.
3. **`is_noreply` or `list_count > 0`, and `replied_count == 0`.** It is a
   broadcaster: newsletters and notifications, filed by what it is about.
4. **Nothing fits.** Leave it in the inbox and say so. Inventing a folder for
   one message is how a taxonomy rots.

## What becomes a TODO

An item earns a TODO when someone is waiting, money is involved, or a service is
degraded. Not when a message merely looks important. A recurring alert becomes
one TODO describing the pattern with its count and window - forty-six copies of
the same Cloudflare alert are one finding, not forty-six.
