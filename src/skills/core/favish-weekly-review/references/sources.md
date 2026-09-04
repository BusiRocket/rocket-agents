# Where the week lives

Identifiers verified 2026-09-04. Re-verify an id after a long gap: Slack DM ids
and Everhour task ids are stable, Jira assignments are not.

## People and Slack

| Who         | Slack user    | Channel       | Role this matters for               |
| ----------- | ------------- | ------------- | ----------------------------------- |
| Cristian    | `U06N3KRFJ5Q` |               | own messages: `from:<@U06N3KRFJ5Q>` |
| Phil Loyd   | `U03GDTKKNPK` | `D06N3KWQXNW` | ATC, Ask ATC pitch, standups, Kitco |
| James       | `U03FYBQHP0D` | `D06N0N9MA6R` | CBS ExecEd tickets and PR reviews   |
| Cole Pacak  | `U0684GQKD`   | `D06MX1562QN` | estimates, hours, ticket pauses     |
| #favish-dev |               | `C03GA7N9JF6` | infra decisions, security threads   |

Searches that worked, through the claude.ai Slack connector:

- own messages: filters `from:<@U06N3KRFJ5Q> after:YYYY-MM-DD`, sort
  `timestamp`, `include_context: false`; more than 20 results need a second
  page.
- a DM: `slack_read_channel` with the DM id and `oldest` as a Unix epoch **of
  the right year** (a 2025 epoch silently returns year-old messages).
- huddles: the DM history shows `Slackbot: A huddle started`; the search keyword
  `huddle` finds nothing. Duration is not recorded; estimate 30 to 60 minutes
  from the surrounding messages.

## Jira (favish.atlassian.net, cloudId `de54f569-7c48-4be0-9f7c-37f053d93a18`)

- Week's issues:
  `(assignee = currentUser() OR reporter = currentUser() OR worklogAuthor = currentUser()) AND updated >= "<monday>" ORDER BY updated DESC`.
  Pass explicit `fields`; the default set with descriptions is 180 kB.
- Comments on a ticket: `getJiraIssue` with `fields: ["comment"]` and
  `responseContentFormat: markdown`.
- Projects: `CEERP2` (CBS platform), `CBSMARK26` (CBS marketing SEO), `FAV`
  (internal; `FAV-272` is the Standup task, `FAV-950` the Ask ATC prototype),
  `KM` and `KTM` (Kitco), `WA` (Wealth Advisor), `ATCM` and `ATCUI` (ATC), `ZH`.
- New CEERP2 issues auto-assign to Cole; a ticket assigned to him can still be
  Cristian's work, which is why the JQL includes `reporter = currentUser()`.

## Gmail (cristian@favish.com)

- Meeting notes: `from:gemini-notes@google.com` (Google Meet: standups,
  All-Hands, project syncs) and `from:no-reply@fathom.video` (Phil's Fathom
  recaps, sent about an hour after the call). Both list per-person action items;
  those are the commitments to check the following week.
- Jira digests: `from:jira@favish.atlassian.net`; the Thursday "weekly update"
  mail lists every mention.
- Everhour: `from:noreply@everhour.com` monthly summary on the 1st.
- Calendar: `list_events` Monday to Sunday. Standup 16:30 CEST daily (Phil),
  Weekly Favish All-Hands Monday 18:00 CEST, linked to `FAV-272`.

## Code

- Favish repos under `~/p`: `cbs-execed`, `cbs-alumni-edge`, `atc-intranet`,
  `atc-prototype`, `kitco-*`, `staffbase-*`, `thewealthadvisor`, `zerohedge-*`,
  `favish-gateway`, `favish-talk`.
- Per repo: `git fetch --all --prune`, then
  `git log --all --author=Cristian --since=<monday> --format='%ad %h %s' --date=short`,
  `git for-each-ref --sort=-committerdate refs/heads` for unpushed branches,
  `gh pr list --author @me --state all` and `gh pr view <n> --json comments` for
  review comments (inline threads need the GraphQL `reviewThreads` query).
- One loop over every repo, keeping only the Favish ones:

```bash
for r in ~/p/*/; do
  n=$(git -C "$r" log --all --author=Cristian --since=<monday> --oneline 2>/dev/null | wc -l | tr -d ' ')
  [ "$n" != 0 ] && echo "$n $r"
done
```

## Brain and memory

- `~/p/brain/projects/cbs-execed.md`, `atc-portal.md`, `kitco.md`,
  `favish-gateway.md`; `business/communication-norms.md` for the report shape.
- Project memories under
  `~/.claude-favish/projects/-Users-cristiandeluxe-p-<repo>/memory/` (and the
  `~/.claude` twin for the personal profile): ticket design notes, estimate
  history, the Everhour method.
- `atrium_recall` with the repo path lists the episodes already synthesized for
  that project.

## Claude session activity (evidence of hours, not hours)

Parses every transcript timestamp in both profiles, collapses gaps over 15
minutes, and prints active hours per project and day. It undercounts by roughly
a third: browser testing, Orca terminals and codex runs leave no transcript. Set
`start` to the Monday of the week.

```python
import glob, os, datetime, collections
from zoneinfo import ZoneInfo

tz = ZoneInfo("Europe/Madrid")
start = datetime.datetime(2026, 8, 31, tzinfo=tz)
end = start + datetime.timedelta(days=7)
roots = glob.glob(os.path.expanduser("~/.claude/projects/*")) + glob.glob(
    os.path.expanduser("~/.claude-favish/projects/*")
)
per = collections.defaultdict(list)
for r in roots:
    for f in glob.glob(r + "/*.jsonl"):
        if datetime.datetime.fromtimestamp(os.path.getmtime(f), tz) < start:
            continue
        for line in open(f, errors="ignore"):
            i = line.find('"timestamp":"')
            if i < 0:
                continue
            try:
                t = datetime.datetime.fromisoformat(
                    line[i + 13 : i + 37].replace("Z", "+00:00")
                ).astimezone(tz)
            except ValueError:
                continue
            if start <= t < end:
                per[os.path.basename(r)].append(t)
res = collections.defaultdict(lambda: collections.defaultdict(float))
for p, ts in per.items():
    ts.sort()
    s = last = ts[0]
    for t in ts[1:]:
        if (t - last).total_seconds() > 900:
            res[p][s.strftime("%a %d")] += (last - s).total_seconds() / 3600
            s = t
        last = t
    res[p][s.strftime("%a %d")] += (last - s).total_seconds() / 3600
for p in sorted(res, key=lambda p: -sum(res[p].values())):
    days = ", ".join(f"{d}:{h:.1f}" for d, h in sorted(res[p].items()))
    print(f"{sum(res[p].values()):5.1f}h {p:55s} {days}")
```
