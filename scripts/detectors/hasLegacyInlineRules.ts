export const hasLegacyInlineRules = (content: string) =>
  content.includes('## Dynamic Rules Ecosystem') ||
  content.includes('### Core / Global Rules')
