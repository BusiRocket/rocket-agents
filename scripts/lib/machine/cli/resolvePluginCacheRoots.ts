import { join } from 'node:path'
import { toRealPath } from '../domains/plugins/toRealPath'

/**
 * Every spelling of the plugin cache a settings file can use. The two profiles
 * reach the same directory through different roots -- `~/.claude-favish/plugins`
 * is a symlink -- so a path written through one is invisible to a search that
 * only knows the other, and the real path is a third spelling again.
 */
export const resolvePluginCacheRoots = async (
  home: string,
): Promise<string[]> => {
  const declared = [
    join(home, '.claude', 'plugins', 'cache'),
    join(home, '.claude-favish', 'plugins', 'cache'),
  ]
  const resolved = await Promise.all(declared.map(toRealPath))

  return [...new Set([...declared, ...resolved])].sort((left, right) =>
    left.localeCompare(right),
  )
}
