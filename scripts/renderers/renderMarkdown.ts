import type { Report } from '../types/Report'

export const renderMarkdown = (report: Report) => {
  const lines = []
  lines.push('# Skills Compatibility Report')
  lines.push('')

  lines.push(`Generated at: ${report.generatedAt}`)
  lines.push('')
  lines.push('## Summary')
  lines.push('')

  lines.push(`- Total skills: ${String(report.summary.totalSkills)}`)

  lines.push(
    `- auto-migrable: ${String(report.summary.classificationCounts['auto-migrable'] ?? 0)}`,
  )

  lines.push(
    `- manual-migration: ${String(report.summary.classificationCounts['manual-migration'] ?? 0)}`,
  )

  lines.push(
    `- blocked: ${String(report.summary.classificationCounts.blocked ?? 0)}`,
  )
  lines.push('')
  lines.push('## Exceptions')
  lines.push('')

  if (report.exceptions.length === 0) {
    lines.push('- None')
  } else {
    for (const item of report.exceptions) {
      lines.push(`- ${item.skill}: ${item.reason}`)
    }
  }
  lines.push('')
  lines.push('## Migration Order')
  lines.push('')

  for (const item of report.migrationOrder) {
    lines.push(`- ${item}`)
  }
  lines.push('')
  lines.push('## Skills')
  lines.push('')

  for (const skill of report.skills) {
    lines.push(`### ${skill.name}`)
    lines.push('')
    lines.push(`- path: ${skill.relativePath}`)
    lines.push(`- classification: ${skill.classification}`)
    lines.push(
      `- frontmatterFields: ${skill.frontmatterFields.join(', ') || 'none'}`,
    )
    lines.push(`- hasOpenAiYaml: ${String(skill.hasOpenAiYaml)}`)
    lines.push(`- hasLegacyInlineRules: ${String(skill.hasLegacyInlineRules)}`)
    lines.push('')
  }

  return `${lines.join('\n')}\n`
}
