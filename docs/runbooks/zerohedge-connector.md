# ZeroHedge Connector Boundary Runbook

Use this runbook when Claude reports `HTTP 503` for the hosted ZeroHedge
connector. Do not increase timeouts: the observed failure is immediate and
occurs before tool execution.

## Safe checks

Run the repository probe. It reads `/healthz`, performs an unauthenticated MCP
initialize request, and returns only status, boundary, timing, HTTP status, and
a safe summary:

```bash
pnpm exec tsx -e 'import { probeZeroHedgeBoundary } from "./scripts/lib/connectors/probeZeroHedgeBoundary.ts"; void probeZeroHedgeBoundary("https://mcp.zerohedge.net").then((result) => console.log(JSON.stringify(result, null, 2)))'
```

Check TLS and DNS without printing response bodies:

```bash
curl -sS -o /dev/null -w 'http=%{http_code} tls=%{ssl_verify_result} time=%{time_total}\n' --max-time 10 https://mcp.zerohedge.net/healthz
dig +short mcp.zerohedge.net A
openssl s_client -connect mcp.zerohedge.net:443 -servername mcp.zerohedge.net -verify_return_error </dev/null
```

Compare the DNS result with the production ingress address using the intended
Kubernetes context:

```bash
kubectl --context gke_favish-general_us-central1-a_ai-cluster -n zh-mcp get ingress zh-mcp-server -o wide
kubectl --context gke_favish-general_us-central1-a_ai-cluster -n zh-mcp get certificate,certificaterequest,order
kubectl --context gke_favish-general_us-central1-a_ai-cluster -n zh-mcp get pods,service,endpoints -o wide
```

## Resolved production boundary

- The legacy Claude connector used `mcp.zh.dev.favish.com`, whose MCP service
  had no ready endpoint and returned HTTP 503.
- `mcp.zerohedge.net` previously resolved to `35.196.136.19`, an ingress
  presenting the Kubernetes fake self-signed certificate.
- The production ingress at `34.70.102.43` had a ready service endpoint and a
  valid certificate for `mcp.zerohedge.net`.
- The `mcp.zerohedge.net` A record now resolves to `34.70.102.43`. TLS
  validation succeeds, `/healthz` returns HTTP 200, and an unauthenticated MCP
  initialize request reaches the expected HTTP 401 OAuth boundary.
- Claude now has an authenticated `ZeroHedge Production` remote connector using
  `https://mcp.zerohedge.net/mcp`.
- The retired `ZeroHedge` connector that used the unavailable development
  endpoint was removed from Claude Settings after the production connector
  passed its live health check.

Account-owned `claude.ai` connectors cannot be removed with `claude mcp remove`;
use Claude Settings when a future hosted connector replacement leaves a stale
account entry.

## Repair and verification

Changing public DNS or applying Kubernetes manifests is a production mutation.
Obtain the required approval before a future change. Do not replace the ready
certificate secret or copy credentials.

The DNS repair can be rolled back without changing Kubernetes resources by
restoring the previous `mcp.zerohedge.net` A record value, `35.196.136.19`, with
TTL 300 in the `zerohedge-net` managed zone.

Authenticate the production connector after the endpoint checks pass, or when
setting up another Claude account:

```bash
claude mcp login 'claude.ai ZeroHedge Production'
```

After the approved infrastructure change, rerun every safe check above, then
verify both profiles:

```bash
claude mcp list
CLAUDE_CONFIG_DIR="$HOME/.claude-favish" claude mcp list
pnpm run connectors:doctor -- --json
```

Success means TLS verification is clean, `/healthz` is HTTP 200, the
unauthenticated MCP request reaches the OAuth boundary, and
`ZeroHedge Production` reports connected with tools available.
