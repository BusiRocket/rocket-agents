---
name: browser-session-safety
description:
  Driving or troubleshooting a real browser — chrome-cli, Playwright MCP, Chrome
  profiles and identities, and reading or clicking a logged-in page. Trigger
  when a task is about to issue its first browser command, when a browser action
  fails for want of an identity or a login, and when a window or tab that is not
  certainly yours is about to be closed. Do not use for fetching a public URL or
  for headless test runs of your own app.
allowed-tools: Read, Grep, Glob, Bash
---

# Browser control: the real Chrome, never a fresh profile

Owner preference (2026-09-01, extended 2026-09-03). The user's real Chrome
carries what an automation browser cannot reproduce: 18 authenticated profiles,
the 1Password extension in each, and the trusted-device state banks demand. A
browser launched with a temporary or isolated profile has none of it and is
unusable for any logged-in site, so do not launch one for that.

1. **chrome-cli first** (`/opt/homebrew/bin/chrome-cli`) for anything it
   answers: list, open, close and activate tabs and windows across every
   profile, navigate, reload, `source`, `execute <js>`. One Bash call, no MCP
   session. Wrap `execute` in `timeout 25`.

   **Never pass `-t <tab-id>` to `execute`.** It fails with "No matching handler
   found" every time; without the flag the identical script on the identical tab
   returns its value (measured 2026-09-08). The error names nothing real, so it
   reads like a permissions or multi-instance problem and sends you chasing
   "Permitir JavaScript desde Eventos de Apple", stray Chrome processes and CDP
   ports - a whole session was lost to that once. `execute` runs against the
   **active tab of the frontmost window**, so the working shape is: open the URL
   in the right identity, raise that window, then call `execute` bare.

   **Always return a string from `execute`.** A script whose last expression is
   a number or `undefined` crashes chrome-cli with
   `-[__NSCFNumber UTF8String]: unrecognized selector` and a full Objective-C
   stack — the JavaScript already ran, so the work is done and only the reply is
   lost, but the trace reads like a broken browser. Wrap the result in
   `String()` or end with a literal (measured 2026-09-11).

**`open -na` does not open a new window.** It reuses an existing window of that
profile and adds a tab to it, so the window you think you created is the user's,
with their tabs in it. Never close a Chrome window by id to tidy up after
yourself: count its tabs first, and prefer leaving it open.

```bash
open -na "Google Chrome" --args --profile-directory="Profile 2" "<url>"
osascript -e 'tell application "Google Chrome"
  activate
  repeat with i from 1 to count of windows
    if id of window i is <WINDOW-ID> then set index of window i to 1
  end repeat
end tell'
timeout 25 chrome-cli execute 'document.body.innerText.slice(0,2000)'
```

This reads and drives **SPAs**, which is what makes it worth preferring:
`source` returns the served shell, `execute` sees the rendered DOM, so an
Angular console like Google Play answers the second and not the first. Read with
`innerText`, find controls by their text, and click them with `.click()` rather
than coordinates. Three routes that look plausible for SPA work and are not:
Chrome does not expose its accessibility tree unless an assistive technology is
attached, no CDP port listens by default, and copying a profile's cookies into
another Chrome profile does not carry a Google session - those are bound to the
device and profile on purpose, and moving them around is session handling you
should not be doing anyway. With two Chrome instances running (a
Playwright-launched one beside the real one) AppleScript may resolve "Google
Chrome" to the wrong process; chrome-cli still hits the real one.

2. **Playwright `--extension` MCP for the rest**: DOM snapshots and element
   interaction, screenshots, network, console on a real tab, connected through
   the Playwright Extension installed in the Default, Favish and BusiRocket
   profiles. Each server's env carries one profile's connection token, so it
   attaches with no dialog, and the server name says which Chrome profile it
   reaches: in the personal Claude profile `playwright-chrome` is the Default
   (djcristiandeluxe) Chrome profile and `playwright-busirocket` the BusiRocket
   one; in the Favish Claude profile `playwright-chrome` is the Favish one. The
   three tokens are recorded in the brain's access map
   (`business/access-map.md`, Chrome profiles section). Each server works on one
   selected tab at a time: `browser_tabs` lists what is reachable, and other
   tabs join by being dragged into its tab group. The `chrome-devtools` MCP
   launches its own persistent profile instead; keep it for our own apps and for
   traces, not for logged-in sites. Do not attach it to the real Chrome with
   `--autoConnect`: it auto-attaches to every one of the ~400 open tabs and
   never answers. Claude in Chrome only acts inside its own tab group and needs
   a manual Connect per profile, so it is the last of these.
3. **A separate browser only when unavoidable** (parallel runs, tests of our own
   app that must not touch real sessions), and then always a persistent profile
   on the real Google Chrome binary with the 1Password extension installed there
   once: the `chrome-devtools` MCP's own profile, or
   `~/.agent-chrome/<identity>`. Never `--isolated`, a tmp user-data-dir, or
   bundled Chromium for a logged-in site. CDP on the default user-data-dir needs
   the `chrome://inspect/#remote-debugging` toggle (on since 2026-09-02) and a
   permission dialog per client; on any other directory it needs
   `--user-data-dir` (Chrome 136+).
4. Orca's embedded browser is driven through the `orca-cli` skill, and desktop
   app windows or webviews outside Chrome through `computer-use`.
