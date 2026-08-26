import { main } from '../commands/auditSkillPortability'

main().catch(() => {
  console.error('skill portability audit failed unexpectedly')
  process.exitCode = 2
})
