import { promises as fs } from 'node:fs'
import { setTimeout as delay } from 'node:timers/promises'

/**
 * Hold an exclusive claim on the archive for the moment of publication.
 *
 * The merge itself runs unlocked and can take minutes; only the verify-then-
 * rename at the end is serialized, so the window a stale lock could block is
 * seconds rather than the length of an import. Correctness does not rest on
 * this: the revision check inside the section refuses a lost update even if
 * the lock were bypassed entirely. This exists to make that refusal rare
 * rather than to make it unnecessary.
 */
export const withArchiveWriteLock = async <T>(
  archive: string,
  publish: () => Promise<T>,
): Promise<T> => {
  // The section is a verify and a rename, so a holder still here after a
  // minute is wreckage rather than a slow writer.
  const staleAfterMs = 60_000
  const retryMs = 100
  const lock = `${archive}.write-lock`
  const deadline = Date.now() + 120_000
  for (;;) {
    try {
      const handle = await fs.open(lock, 'wx', 0o600)
      try {
        await handle.writeFile(`${String(process.pid)}\n`)
      } finally {
        await handle.close()
      }
      break
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error
      // A holder that died mid-publication leaves the file behind. The
      // section is short, so anything older than a minute is wreckage.
      const age = await fs
        .stat(lock)
        .then((stats) => Date.now() - stats.mtimeMs)
        .catch(() => 0)
      if (age > staleAfterMs) {
        await fs.rm(lock, { force: true })
        continue
      }
      if (Date.now() > deadline)
        throw new Error(`timed out waiting for ${lock}`, { cause: error })
      await delay(retryMs)
    }
  }
  try {
    return await publish()
  } finally {
    await fs.rm(lock, { force: true })
  }
}
