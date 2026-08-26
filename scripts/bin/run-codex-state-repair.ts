import { main } from '../commands/codexStateRepair'

main().catch(() => {
  console.error('Codex state repair failed unexpectedly')
  process.exitCode = 2
})
