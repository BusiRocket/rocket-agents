import path from 'node:path'
import { ROOT } from './ROOT'

export const CLAUDE_RULES_DIR = path.join(
  ROOT,
  'dist',
  'global',
  '.claude',
  'rules',
)
