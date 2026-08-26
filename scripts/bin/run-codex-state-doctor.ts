import { main } from '../commands/codexStateDoctor'

main().catch(() => {
  console.error('Codex state doctor failed unexpectedly')
  process.exitCode = 2
})
