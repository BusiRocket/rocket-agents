import { main } from '../commands/agentDoctor'

main().catch(() => {
  console.error('agent doctor failed unexpectedly')
  process.exitCode = 2
})
