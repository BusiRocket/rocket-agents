import { main } from '../commands/conversationsImport'

main().catch(() => {
  console.error('Conversation import failed unexpectedly')
  process.exitCode = 2
})
