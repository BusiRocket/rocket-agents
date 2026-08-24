import { join } from "node:path"
import { resolveClaudeSettingsPaths } from "./resolveClaudeSettingsPaths"
import type { PluginsPaths } from "../domains/plugins/types/PluginsPaths"

export const resolvePluginsPaths = (home: string): PluginsPaths => ({
  marketplaces: join(home, ".claude", "plugins", "known_marketplaces.json"),
  installed: join(home, ".claude", "plugins", "installed_plugins.json"),
  cache: join(home, ".claude", "plugins", "cache"),
  settings: resolveClaudeSettingsPaths(home),
})
