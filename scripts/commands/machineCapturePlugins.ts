import { homedir } from "node:os"
import { resolvePluginsPaths } from "../lib/machine/cli/resolvePluginsPaths"
import { findOrphanCacheDirectories } from "../lib/machine/domains/plugins/findOrphanCacheDirectories"
import { findStaleCacheEntries } from "../lib/machine/domains/plugins/findStaleCacheEntries"
import { read } from "../lib/machine/domains/plugins/read"
import { readCacheEntries } from "../lib/machine/domains/plugins/readCacheEntries"
import { resolveInstalledPaths } from "../lib/machine/domains/plugins/resolveInstalledPaths"
import { toManifest } from "../lib/machine/domains/plugins/toManifest"
import { formatPluginsCapture } from "../lib/machine/report/formatters/formatPluginsCapture"

export const main = async () => {
  const paths = resolvePluginsPaths(homedir())
  const state = await read(paths)
  const entries = await readCacheEntries({
    cacheDir: paths.cache,
    marketplaces: state.marketplaces,
  })

  const capture = {
    manifest: toManifest(state),
    cache: {
      entries: entries.length,
      stale: findStaleCacheEntries({
        entries,
        installedPaths: await resolveInstalledPaths(state.installed),
      }),
      orphanDirectories: await findOrphanCacheDirectories({
        cacheDir: paths.cache,
        marketplaces: state.marketplaces,
      }),
    },
  }

  console.log(formatPluginsCapture(capture, process.argv.includes("--json")))
}
