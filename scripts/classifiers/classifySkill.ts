export const classifySkill = ({
  hasSkillMd,
  hasFrontmatter,
  hasName,
  hasDescription,
  hasOpenAiYaml,
  hasLegacy,
}: Record<string, unknown>) => {
  if (!hasSkillMd || !hasFrontmatter || !hasName || !hasDescription)
    return 'blocked'
  if (hasOpenAiYaml && !hasLegacy) return 'auto-migrable'
  return 'manual-migration'
}
