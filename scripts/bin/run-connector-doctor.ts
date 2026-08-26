import { main } from '../commands/connectorDoctor'

main().catch(() => {
  console.error('connector doctor failed unexpectedly')
  process.exitCode = 2
})
