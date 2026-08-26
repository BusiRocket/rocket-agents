import { main } from '../commands/conversationsRender'

main().catch(() => {
  console.error('Conversation render failed unexpectedly')
  process.exitCode = 2
})
