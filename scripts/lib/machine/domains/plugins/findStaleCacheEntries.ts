import type { CacheEntry } from "./types/CacheEntry"

export const findStaleCacheEntries = ({
  entries,
  installedPaths,
}: {
  entries: CacheEntry[]
  installedPaths: string[]
}): CacheEntry[] => {
  const referenced = new Set(installedPaths)

  return entries.filter((entry) => !referenced.has(entry.path))
}
