import { main } from '../commands/codexSessionArchive'

main().catch(() => {
  console.error('Codex session archive failed unexpectedly')
  process.exitCode = 2
})
