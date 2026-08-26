import { main } from '../commands/codexSessionRestore'

main().catch(() => {
  console.error('Codex session restore failed unexpectedly')
  process.exitCode = 2
})
