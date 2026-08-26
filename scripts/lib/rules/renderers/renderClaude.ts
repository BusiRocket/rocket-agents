import { renderBundleMd } from './renderBundleMd'

export const renderClaude = (bundle: { rel: string; content: string }[]) =>
  renderBundleMd('CLAUDE.md', bundle)
