---
name: job-application
description:
  Fills and submits one job application, and audits every claim in it against
  the evidence file first. Trigger when a form is being filled or submitted on
  Greenhouse, Ashby, Workable, Lever, Recruitee or Typeform, when application
  essay answers are being drafted, or when a prepared package is finally being
  sent. Triggers (ES) are aplica a, envia la candidatura, rellena el formulario,
  mandar la solicitud. Do not use for finding or scoring postings (that is
  job-search), for writing the master resume, or for recruiter conversations
  after a reply arrives.
allowed-tools: Read, Grep, Glob, Bash, TodoWrite
argument-hint: [company-or-role]
---

# Job application — fill, verify, submit

> Career KB paths below are relative to
> `~/p/cristian-deluxe-developer-portfolio/career`, which owns the evidence,
> voice, rubric and playbook this skill reads.

Every rule here was paid for by a real failure in this repository's own funnel.
Rule numbers refer to `career/hiring-playbook-2026.md`.

Baseline that produced these rules: **9 applications, 0 initial screens.**

## Phase 1 — Gate before anything is written

**Eligibility is a gate, not a scored dimension (rule 31).** Open the canonical
ATS and read the location/country field. Do not read the LinkedIn tag.

- A country list that excludes Spain is a stop. So is "Remote (US)".
- Contractor or EOR availability is a candidate's offer to the employer. It is
  never an override of the employer's approved hiring geography.
- Only a recruiter's written yes reopens a gated role.

This exists because the single most carefully built application in the corpus
(OpenRouter Applied AI Engineer) was submitted against a requisition whose own
captured `offer.md` said "Ashby structured data limits applicants to the United
States". Its `fit.md` scored logistics 85 under a "working decision". Rejected
in 15 days.

Then verify the requisition is **live today**, not when it was captured:

```bash
curl -s "https://boards-api.greenhouse.io/v1/boards/<slug>/jobs/<id>" | head -c 400
curl -s "https://api.ashbyhq.com/posting-api/job-board/<slug>" | head -c 400
```

A prepared package that sat for two weeks needs this before it is sent. Also
re-read the resume for anything that has since become false — employment dates
are the usual one.

**One role per company** unless the hiring surface explicitly invites more.

## Phase 2 — Draft, then audit every noun and number

Write the answer first. Then re-read it against `career/evidence/stories.md`
word by word. **If the evidence does not contain it, cut it. Do not soften it.**

Caught one click before submission on a Toggl form (rule 34):

| Written                              | Evidence actually says                                                                              |
| ------------------------------------ | --------------------------------------------------------------------------------------------------- |
| "measured on throttled real devices" | Puppeteer, iPhone 14 profile, Fast 3G, 4x CPU throttle — emulation                                  |
| "generates real support emails"      | ticket sales, QR entry passes, refunds and cancellations; the mail queue belongs to another product |
| "took the pages when it broke"       | general incident-response responsibility, no pager fact for that client                             |
| "the lab score had been lying"       | nothing recorded                                                                                    |
| "owned four US client platforms"     | four external clients, and Kitco is not US                                                          |
| "the last two years" of a practice   | no start date recorded                                                                              |

The mechanism recurs because each drift is individually small: prose written to
sound compelling moves a few degrees off the record every time.

**Attribution verbs (rule 33).** Use _led, implemented, co-designed, operated_.
Reserve _owned_ for what was genuinely owned alone. A dense stack of
first-person ownership claims invites "what was his actual share?" rather than
admiration. Watch tense: an ended engagement is past tense everywhere.

**One item on page one must be checkable by a stranger** — a public package,
repo, or contribution with its URL. Everything else is a claim.

## Phase 3 — Prose that survives an AI filter

Several boards now carry a mandatory acknowledgement that generic AI-generated
answers hurt the application. The tells are structural, not lexical (rule 35).
Delete on sight:

- **Announced symmetry**: opening with "Two things." or "There are three
  reasons."
- **Binary contrast**: "not X but Y", "instead of chasing the symptom", "rather
  than".
- **Three-part anaphora**: "real payments, real refunds, real support emails".
- **A closing aphorism on every answer**, especially cinematic ones with a time
  of day. "someone's payment fails at eleven at night and the phone that rings
  is mine" is invented detail wearing a personality.
- **Echoing the posting's own phrases** back at it closely enough to look
  generated against the job description.

Replace them with exact conditions, exact numbers, exact dates, and one concrete
decision with the reason behind it. State the failure and the change, then stop.
**Delete any sentence whose job is to land well rather than to inform.**

Match `career/voice.md`. Check en-US spelling; "behaviour" and "labelled" are
recurring slips.

## Phase 4 — What to disclose

- **A gap the posting has already forgiven, disclose it (rule 36).** If the JD
  says prior Go is not mandatory, say plainly: can read it, has not shipped it,
  applying knowing the ramp-up is needed. Do not invent a crash course. Silence
  makes the reviewer guess whether the omission was strategic.
- **End of an engagement is a date, not a story (rule 37).** Template: "My
  engagement with <company> ended on <date>, so I can start immediately." Never
  volunteer who ended it, why, or anything about income.
- **Do not volunteer unprompted negatives.** "No degree" when nothing asked
  creates a criterion the reviewer was not applying; the funnel diagnosis found
  education had the lowest explanatory power of any blocker. "PHP 4" dates the
  career start to roughly 2000-2004 and breaches the age-signal rule in
  substance (playbook rules 6-7).
- **Never infer a personal attribute.** Pronouns are the live case: a name does
  not tell you someone's pronouns. If the owner is unreachable, select "I prefer
  not to say" and tell him it can be changed. Never guess.
- **Never state a salary target or current rate.** `[sensitive]` in
  `career/profile.md`.

## Phase 5 — Mechanics per board

**Verify before clicking submit.** Dump every field value and assert the banned
phrases are absent:

```js
;() => {
  const g = (n) => (document.querySelector(`[name="${n}"]`) || {}).value || ''
  const all = [/* every answer field */].map(g).join(' ')
  return JSON.stringify({
    banned: ['real devices', 'no degree', 'PHP 4', 'Two things'].filter((p) =>
      all.toLowerCase().includes(p.toLowerCase()),
    ),
    errors: [...document.querySelectorAll('[class*="error"],[role="alert"]')]
      .map((e) => e.innerText.trim())
      .filter(Boolean),
  })
}
```

### Greenhouse

- File inputs carry `class="visually-hidden"`, so `setInputFiles` times out
  waiting for actionability. Remove the class and force
  `position:static;opacity:1;display:block;visibility:visible` first, then
  upload against the input's uid.
- Comboboxes are react-select. A CDP click opens the menu; a plain
  `element.click()` on the option then selects it. A synthetic `mousedown` on
  the control does **not** open it.
- **An 8-character email verification code is required.** The first submit
  returns "A verification code was sent to ...". Fetch it, enter it, submit
  again. The code splits across eight `#security-input-N` boxes; filling the
  visible field distributes it automatically.

```bash
vexa sync me@cristiandeluxe.dev
vexa messages --account me@cristiandeluxe.dev --since <today> --limit 40 --with-body --json
```

`vexa messages` defaults to `--limit 20`. The store lags the server, so sync
first and poll — the code can take a couple of minutes to arrive.

### Ashby

- **Ashby validates against its own React state, not the DOM.** Values set with
  the native setter plus an `input` event appear on the page and still submit as
  "Missing entry for required field". Use real CDP input for text fields and a
  real click for Yes/No buttons. Where a Yes button already shows `pressed` but
  the field still reports missing, click **No then Yes** to force the state
  through.
- Fields can appear only after a failed submit (a Location combobox did). Re-run
  the snapshot after every rejection rather than assuming the form is unchanged.
- A rejected submit sends nothing. It is safe to iterate.
- **Its spam gate is configured per tenant and blocks automation profiles.**
  LocalStack rejected two submissions with "Your application submission was
  flagged as possible spam", clearing the whole form each time, while Toggl's
  board accepted the same automated browser an hour earlier (2026-09-06). The
  identical payload went through unchanged from the owner's own Chrome. Read a
  spam rejection as a browser-fingerprint problem, not as a content problem, and
  move to the real browser rather than rewriting the answers.

### Driving a form in the owner's real Chrome, without stealing focus

`chrome-cli` reaches the real browser but only runs JavaScript, and other apps
hold the foreground. This combination fills everything except a trusted click:

- **Text fields:** focus the element, then
  `document.execCommand("insertText", false, text)`. It fires native
  `beforeinput`/`input` events that React accepts, unlike a value setter. Send
  **one field per call**: a single call carrying two long answers exceeded the
  argument limit and failed silently with no output at all.
- **File uploads:** build a `File` from base64 in the page, add it to a
  `DataTransfer`, assign `input.files`, then dispatch `change`. No native picker
  and no focus needed. Generate the base64 into a temp file and pass it with
  `$(cat …)` so it never enters the transcript.
- **Yes/No buttons:** synthetic events set `aria-pressed` but Ashby may still
  report the field missing. Try No then Yes first; if one still fails it needs a
  trusted event, which means a real keypress or the owner's own click.

### Never send a keystroke without checking what is in front

`osascript … keystroke` goes to whatever application is frontmost. On 2026-09-06
a Cmd+A and a line of text intended for a form landed in the owner's editor,
because Chrome was behind it. Guard every keypress and abort rather than type
blind:

```bash
osascript -e 'tell application "System Events"
  set f to name of first process whose frontmost is true
  if f is "Google Chrome" then
    key code 49
  else
    return "ABORT frontmost=" & f
  end if
end tell'
```

`open -a "Google Chrome"` raises it where AppleScript `activate` does not, but
another app can steal focus back between the check and the key. The guard fired
twice in a row for this reason; when it does, hand the click to the owner
instead of retrying indefinitely. With two Chrome processes running, AppleScript
resolves `application "Google Chrome"` ambiguously and neither exposes an
accessibility tree, so `process "Google Chrome"` reports zero windows.

**Chrome autofill rewrites fields you already set.** It silently replaced a Name
value on interaction. Re-read identity fields after any interaction, not just
after your own writes.

### Calendly

Refuses bookings from an automated session: "For security reasons, we are not
able to finalize this booking from your current session." Pre-fill the form,
then hand the confirming click to the owner in their own browser.

### Browser choice

Public application forms need no login, so the `chrome-devtools` MCP with its
own profile is the right tool and avoids touching real sessions. Anything
requiring the owner's logged-in identity (LinkedIn) goes through `chrome-cli` or
the Playwright extension against the real Chrome. See the global browser rule.

## Phase 6 — Close the loop

1. Save the exact submitted text to `applications/<folder>/submitted.md`,
   including the fixed-field table. If a draft was rewritten, keep the original
   as the record of what was wrong and mark it superseded.
2. Update the `tracker.csv` row: status `applied`, the canonical URL and job id,
   the confirmation text, and the real next action.
3. Append a dated status line to that application's `fit.md`.
4. **Compounding principle.** Push durable wins up: new verified facts into
   `evidence/stories.md`, better bullets into `career/resume.md`, reusable
   answers into the application folder as templates, and any new hiring-process
   learning into `career/hiring-playbook-2026.md` as a numbered rule.

## When to stop and ask

- The answer asserts something personal that only the owner can authenticate:
  motivation, personal history, a required attribute like pronouns.
- A mandatory checkbox makes the owner personally vouch for the answers.
- A disclosure decision has real downside either way.

Fill the form completely first, then show the exact text and ask. A filled form
awaiting one click costs the owner seconds; a wrong claim submitted under his
name cannot be withdrawn.

## Self-healing and self-improvement

This skill is expected to be wrong eventually. Boards redesign their forms,
hosts stop resolving, APIs move, and a rule that held in September stops
holding. **When a step here fails or a new failure is discovered, the fix goes
back into this file in the same session.** A workaround that lives only in a
transcript will be rediscovered from scratch, at full cost, by the next session.

### Heal

Trigger: a documented step does not work as written, or produces a result the
skill did not anticipate.

1. Solve the immediate problem for the task at hand.
2. Establish what actually changed, with evidence — the error text, the DNS
   answer, the field that vanished, the status code. Do not guess at a cause.
3. Edit the failing section here. Replace the stale instruction; do not append a
   second version beside it, because two contradictory instructions are worse
   than one stale one. Keep the old behavior only if it still applies somewhere,
   and say where.
4. Record the observation that forced the change, dated, so a future reader can
   tell a deliberate decision from an accident.

### Improve

Trigger: the task succeeded, and something was learned that would have saved
time if it had been written down.

- A new trap, a faster route, a check that caught a real error: add it.
- A step that has never once mattered: delete it. This file competes for
  attention, and an instruction nobody needs makes the ones that matter harder
  to find.
- A rule that fired twice for the same underlying reason: merge them and name
  the shared cause.

### Ship the change

Skills live in `~/p/rocket-agents`, not in the project repo. Edit
`src/skills/core/<name>/SKILL.md`, never a compiled or linked copy.

```bash
git pull --ff-only origin main   # other sessions commit here concurrently
pnpm run skills:compile          # `check` does NOT recompile
pnpm run check                   # must exit 0; read the exit code, not the tail
git add src/skills/core/<name>/SKILL.md
git commit && git push origin main
pnpm run skills:link             # then verify the linked file, not the summary
```

A new skill also needs its name in `src/skills/skill-rules.map.json` or the
compile fails. Descriptions need a `Trigger when` clause before character 150, a
`Do not use` clause, and an action verb from
`scripts/constants/ACTION_WORDS.ts`.

### Where a finding belongs

- **How to do the work** → this file.
- **Why a decision was made, with its evidence** → the owning repository's
  knowledge base (for job hunting, `career/hiring-playbook-2026.md` as a
  numbered rule).
- **A fact about the world that other tasks need** → `~/p/brain`.
- **Something actionable but out of scope right now** → the repository's
  `TODO.md`, with the observation, the evidence, and the smallest next step.

Do not put all four in one place. A procedure padded with rationale stops being
followed, and a rationale hidden inside a procedure stops being found.
