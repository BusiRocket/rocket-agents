import type { QualityEntry } from '../types/QualityEntry'

export const renderQualityMarkdown = (entries: QualityEntry[]) => {
  const lines = ['# Skills Quality Report', '']

  for (const entry of entries) {
    lines.push(`## ${entry.name}`)
    lines.push('')
    lines.push(`- path: ${entry.relativePath}`)
    lines.push(`- skillClass: ${entry.skillClass ?? 'unknown'}`)
    lines.push(`- score: ${entry.score.toString()}`)

    if (entry.warnings.length === 0) {
      lines.push('- warnings: none')
    } else {
      lines.push('- warnings:')
      for (const warning of entry.warnings) {
        lines.push(`  - ${warning}`)
      }
    }
    lines.push('')
  }

  return `${lines.join('\n')}\n`
}
