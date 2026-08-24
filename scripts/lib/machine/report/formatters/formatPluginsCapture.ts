import type { PluginsCapture } from "../../domains/plugins/types/PluginsCapture"

export const formatPluginsCapture = (capture: PluginsCapture, asJson: boolean) => {
  if (asJson) {
    return JSON.stringify(capture, null, 2)
  }

  const { manifest, cache } = capture
  const lines = [
    `marketplaces ${String(manifest.marketplaces.length)} plugins ${String(manifest.plugins.length)}`,
  ]

  for (const marketplace of manifest.marketplaces) {
    lines.push(`  ${marketplace.name.padEnd(28)} ${marketplace.source}`)
  }

  for (const plugin of manifest.plugins) {
    const personal = plugin.enablement["claude-personal"]
    const favish = plugin.enablement["claude-favish"]
    lines.push(
      `  ${plugin.id.padEnd(44)} ${plugin.version.padEnd(10)} personal=${personal} favish=${favish}`,
    )
  }

  lines.push(
    `cache entries ${String(cache.entries)} stale ${String(cache.stale.length)} orphan ${String(cache.orphanDirectories.length)}`,
  )

  for (const entry of cache.stale) {
    lines.push(`  stale  ${entry.marketplace}/${entry.plugin}/${entry.version}`)
  }

  for (const directory of cache.orphanDirectories) {
    lines.push(`  orphan ${directory}`)
  }

  return lines.join("\n")
}
