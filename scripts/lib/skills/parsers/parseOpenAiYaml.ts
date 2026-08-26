import { promises as fs } from 'node:fs'
import { parseOpenAiYamlContent } from './parseOpenAiYamlContent'

export const parseOpenAiYaml = async (filePath: string) =>
  parseOpenAiYamlContent(await fs.readFile(filePath, 'utf8'))
