import type { SkillReport } from './SkillReport'

export interface Report {
  generatedAt: string
  summary: {
    totalSkills: number
    classificationCounts: Record<string, number>
  }
  exceptions: { skill: string; reason: string }[]
  migrationOrder: string[]
  skills: SkillReport[]
}
