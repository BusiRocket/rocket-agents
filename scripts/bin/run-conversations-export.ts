import { main } from '../commands/conversationsExport'

main().catch(() => {
  console.error('Conversation export failed unexpectedly')
  process.exitCode = 2
})
