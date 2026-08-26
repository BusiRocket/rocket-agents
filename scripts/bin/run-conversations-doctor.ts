import { main } from '../commands/conversationsDoctor'

main().catch(() => {
  console.error('Conversation doctor failed unexpectedly')
  process.exitCode = 2
})
