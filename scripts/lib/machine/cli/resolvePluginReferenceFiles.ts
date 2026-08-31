import { join } from 'node:path'

/**
 * User-level files that can name a plugin cache path. `settings.local.json`
 * and `.claude.json` are included because a `statusLine` or hook written by a
 * third-party tool lands in whichever of them that tool owns; project-scoped
 * settings inside a repository are deliberately out of reach, which is why
 * version pruning stays a report rather than an action.
 */
export const resolvePluginReferenceFiles = (home: string): string[] =>
  ['.claude', '.claude-favish'].flatMap((profile) => [
    join(home, profile, 'settings.json'),
    join(home, profile, 'settings.local.json'),
    join(home, profile, '.claude.json'),
  ])
