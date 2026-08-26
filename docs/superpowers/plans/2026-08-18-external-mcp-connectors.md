# External MCP Connector Reliability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make external MCP connector status precise and actionable across
profiles, complete the required authentications, and diagnose the ZeroHedge HTTP
503 at the service boundary.

**Architecture:** A secret-free connector manifest describes expected profile
scope and probe type. The doctor maps reachability, authentication, protocol,
and upstream availability separately. Interactive OAuth remains an explicit
operational step. ZeroHedge diagnosis follows the request from client through
hosted proxy to service and upstream dependency.

**Tech Stack:** TypeScript, native `fetch`, MCP initialize requests, Claude and
Codex read-only CLI status commands, ZeroHedge's existing repository tooling.

**Spec:**
`docs/superpowers/specs/2026-08-18-agent-platform-reliability-design.md`

## Global Constraints

- No tokens, cookies, authorization headers, account IDs, or response bodies in
  tracked files or reports.
- `401` and OAuth challenges map to `auth-required`, not `failed`.
- `429` and `5xx` preserve retry metadata and identify the responding boundary.
- Do not increase timeouts to hide an immediate 503.
- Authentication is performed once per intended profile and verified from that
  same profile.
- Use `brp-traffic-client` only if a browser or proxy capture is needed to
  reproduce ZeroHedge; its result must become a direct HTTP probe rather than
  permanent browser automation.
- Every task ends with a commit and `git push origin HEAD`.

---

### Task 1: Declare connector expectations without credentials

**Files:**

- Create: `machine/connectors.json`
- Create: `scripts/lib/connectors/constants/CONNECTOR_STATUSES.ts`
- Create: `scripts/lib/connectors/types/ConnectorStatus.ts`
- Create: `scripts/lib/connectors/types/ConnectorDefinition.ts`
- Create: `scripts/lib/connectors/types/ConnectorManifest.ts`
- Create: `scripts/lib/connectors/parseConnectorManifest.ts`
- Test: `scripts/lib/connectors/PARSE_CONNECTOR_MANIFEST_TEST.ts`

Declare:

- Context7, Serena, and CodeGraph as required machine-managed MCP servers for
  Claude personal, Claude Favish, and Codex.
- Cloudflare as an account-managed plugin connector expected in both Claude
  profiles.
- OpenSEO as an HTTP MCP server expected in Claude personal only.
- ZeroHedge as an account-managed hosted connector expected in both Claude
  profiles.

- [ ] Write parser tests rejecting literal headers, cookies, token query
      parameters, and unknown profiles.
- [ ] Require a probe kind, expected profiles, ownership kind, and criticality
      for each connector.
- [ ] Implement parsing with the existing credential-literal detector.
- [ ] Run
      `npx tsx --test scripts/lib/connectors/PARSE_CONNECTOR_MANIFEST_TEST.ts`.
- [ ] Run `pnpm run format && pnpm run lint:fix`.
- [ ] Commit and push:

```bash
git add machine/connectors.json scripts/lib/connectors
git commit -m "feat: declare external connector expectations"
git push origin HEAD
```

---

### Task 2: Probe HTTP MCP reachability and protocol state

**Files:**

- Create: `scripts/lib/connectors/types/HttpProbeResult.ts`
- Create: `scripts/lib/connectors/buildMcpInitializeRequest.ts`
- Create: `scripts/lib/connectors/classifyHttpProbe.ts`
- Create: `scripts/lib/connectors/probeHttpMcp.ts`
- Test: `scripts/lib/connectors/CLASSIFY_HTTP_PROBE_TEST.ts`
- Test: `scripts/lib/connectors/PROBE_HTTP_MCP_TEST.ts`

The probe sends a bounded MCP `initialize` request with a synthetic client name
and no credential unless the target-native client owns OAuth. Tests use a local
HTTP server and cover 200 protocol success, 401, 403, 429 with `Retry-After`,
503, timeout, invalid JSON, and non-MCP 200.

- [ ] Write the local server tests.
- [ ] Implement `fetch` with `AbortSignal.timeout`, bounded response reads, and
      header allowlisting.
- [ ] Return status, boundary, HTTP code, retry delay, and a safe summary only.
- [ ] Never return the response body or request headers.
- [ ] Run both focused tests.
- [ ] Run `pnpm run format && pnpm run lint:fix`.
- [ ] Commit and push:

```bash
git add scripts/lib/connectors
git commit -m "feat: classify HTTP MCP connector health"
git push origin HEAD
```

---

### Task 3: Observe account-managed connectors per Claude profile

**Files:**

- Create: `scripts/lib/connectors/types/ProfileConnectorResult.ts`
- Create: `scripts/lib/connectors/readClaudeConnectorStatus.ts`
- Create: `scripts/lib/connectors/inspectProfileConnectors.ts`
- Test: `scripts/lib/connectors/READ_CLAUDE_CONNECTOR_STATUS_TEST.ts`
- Create: `scripts/commands/connectorDoctor.ts`
- Create: `scripts/bin/run-connector-doctor.ts`
- Modify: `package.json`

Use `CLAUDE_CONFIG_DIR` to query each profile. Parse only connector names and
status categories from `claude mcp list` or supported debug output. Discard raw
output after classification.

- [ ] Build fixtures for connected, authentication-needed, unavailable,
      disabled, and duplicate connector statuses.
- [ ] Add `connectors:doctor` and `connectors:test` scripts.
- [ ] Run the doctor for personal and Favish profiles with `--json`.
- [ ] Confirm Cloudflare and OpenSEO are `auth-required` where appropriate and
      ZeroHedge is `failed` with responding boundary `hosted-connector` and
      HTTP 503.
- [ ] Feed connector summaries into `agents:doctor` without duplicating probes.
- [ ] Run `pnpm run format && pnpm run lint:fix`.
- [ ] Commit and push:

```bash
git add package.json scripts/bin scripts/commands scripts/lib/connectors scripts/commands/agentDoctor.ts
git commit -m "feat: add profile-aware connector diagnostics"
git push origin HEAD
```

---

### Task 4: Complete Cloudflare and OpenSEO authentication

**Files:**

- Create: `docs/runbooks/claude-connector-authentication.md`
- Modify: `machine/connectors.json` only if observed profile scope differs from
  the approved policy

This task contains the only unavoidable interactive browser steps. The personal
Cloudflare profile currently needs authentication for four endpoints; Favish is
already connected and must only be verified.

- [ ] In the personal profile, run these commands and complete each OAuth
      browser flow:

```bash
claude mcp login plugin:cloudflare:cloudflare-api
claude mcp login plugin:cloudflare:cloudflare-bindings
claude mcp login plugin:cloudflare:cloudflare-builds
claude mcp login plugin:cloudflare:cloudflare-observability
claude mcp login openseo
```

- [ ] Verify Favish without changing its credentials:

```bash
CLAUDE_CONFIG_DIR="$HOME/.claude-favish" claude mcp list
```

- [ ] Keep OpenSEO `not-applicable` for Favish because it is not declared in
      that profile.
- [ ] After each login, run
      `pnpm run connectors:doctor -- --profile <profile> --json`.
- [ ] Write these exact profile-safe login and verification commands in the
      runbook. Describe browser account choices in prose and never record the
      selected account identifier.
- [ ] Run every non-interactive runbook command exactly as written.
- [ ] Run `pnpm run format && pnpm run lint:fix`.
- [ ] Commit and push:

```bash
git add docs/runbooks/claude-connector-authentication.md machine/connectors.json
git commit -m "docs: add profile-safe connector authentication runbook"
git push origin HEAD
```

---

### Task 5: Diagnose and repair ZeroHedge at the failing boundary

**Repositories:**

- Diagnostic tooling: `/Users/cristiandeluxe/p/agents-tools`
- Service implementation: `/Users/cristiandeluxe/p/zerohedge-mcp`

**Files in this repository:**

- Create: `scripts/lib/connectors/probeZeroHedgeBoundary.ts`
- Test: `scripts/lib/connectors/PROBE_ZEROHEDGE_BOUNDARY_TEST.ts`
- Create: `docs/runbooks/zerohedge-connector.md`

**Files in `zerohedge-mcp`:** determine from its `AGENTS.md`, package scripts,
deployment manifest, and failing request path before editing. Do not preselect
an implementation file without that repository's rules and reproduction
evidence.

- [ ] Read `zerohedge-mcp/AGENTS.md` and every imported instruction relevant to
      the failing files.
- [ ] Run its existing check and health commands before changing code.
- [ ] Reproduce the 503 through the hosted connector and then directly against
      the deployed service endpoint.
- [ ] If the hosted request must be captured, use `brp-traffic-client` to
      produce a redacted direct HTTP reproducer and commit no capture file.
- [ ] Determine whether the 503 originates in Anthropic's connector proxy,
      ZeroHedge deployment, or its upstream data provider. Record status,
      timing, and request ID only when safe.
- [ ] Add a failing regression test in `zerohedge-mcp` at the identified
      boundary.
- [ ] Apply the smallest service fix, run that repository's full check, commit,
      and push it using its existing git identity.
- [ ] Add the stable direct health probe and operational runbook in this
      repository.
- [ ] Run `pnpm run connectors:test` and both Claude profile connector doctors.
- [ ] Run `pnpm run format && pnpm run lint:fix`.
- [ ] Commit and push this repository:

```bash
git add docs/runbooks/zerohedge-connector.md scripts/lib/connectors
git commit -m "fix: add ZeroHedge connector boundary diagnostics"
git push origin HEAD
```

---

### Task 6: Final connector verification and failure policy

**Files:**

- Modify: `scripts/lib/platform-health/healthExitCode.ts`
- Modify: `README.md`
- Modify: `docs/ide-setup.md`

- [ ] Required local MCP failures exit 1 for active clients.
- [ ] Missing OAuth exits 1 only after the connector's authentication task is
      marked required for that profile; otherwise it is a visible degraded
      state.
- [ ] An optional external 503 is degraded with retry guidance; a required
      connector 503 exits 1.
- [ ] Run live discovery for Context7, Serena, and CodeGraph in Codex and both
      Claude profiles.
- [ ] Run Cloudflare and OpenSEO tool discovery in every authenticated profile.
- [ ] Run one read-only ZeroHedge tool call in both profiles.
- [ ] Document actual status without tool output or account data.
- [ ] Run `pnpm run check:all && git diff --check`.
- [ ] Commit and push:

```bash
git add README.md docs/ide-setup.md scripts/lib/platform-health/healthExitCode.ts
git commit -m "test: enforce connector reliability policy"
git push origin HEAD
```

## Completion Gate

Run:

```bash
pnpm run check:all
pnpm run connectors:doctor -- --json
pnpm run agents:doctor -- --json
claude mcp list
CLAUDE_CONFIG_DIR="$HOME/.claude-favish" claude mcp list
codex mcp list
git status --short --branch
```

Expected: baseline MCP servers pass discovery, authenticated connectors are
healthy per profile, ZeroHedge no longer returns an unexplained 503, reports
contain no secrets, and both repositories that changed are clean and synced.
