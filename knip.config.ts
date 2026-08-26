import { createKnipConfig } from '@busirocket/quality-config/knip'
import type { KnipConfiguration } from 'knip'

const baseline = createKnipConfig({
  framework: 'ts-package',
}) as KnipConfiguration

const config: KnipConfiguration = {
  ...baseline,
  // Most of this repo is tooling run by hand or by package scripts, not a
  // library entry: without these, everything under scripts/ and machine/ reads
  // as dead and the packages only they use -- ajv, ajv-formats -- read as
  // unused dependencies.
  // Entry points are the CLIs the package scripts invoke -- 63 files across
  // bin/, commands/ and a few *_TEST.ts verifiers -- plus the *_TEST.ts
  // fixtures those verifiers read. Narrowing entry to bin/ and commands/ alone
  // reported 298 files as dead, because the verifiers reach the rest;
  // widening it to all of scripts/** hid 47 genuinely unreferenced exports by
  // making every helper its own root. This is the middle, and it is the one
  // that matches how the repo is actually run.
  entry: [
    ...(baseline.entry as string[]),
    'scripts/bin/**/*.{ts,mts,mjs}',
    'scripts/commands/**/*.{ts,mts,mjs}',
    'scripts/**/*_TEST.{ts,mts}',
    'scripts/golden/**/*.{ts,mts,mjs}',
    'machine/**/*.{ts,mts,mjs}',
  ],
  project: [
    ...(baseline.project as string[]),
    'scripts/**/*.{ts,mts,mjs}',
    'machine/**/*.{ts,mts,mjs}',
  ],
  // System tools the scripts shell out to, not packages: installed by
  // Homebrew, pipx or a global npm, and knip cannot resolve any of them.
  ignoreBinaries: [
    'gitleaks',
    'skillkit',
    'pipx',
    'skills-ref',
    'codex',
    'claude',
    'gemini',
    'antigravity',
    'uvx',
    'jq',
    'rg',
    'shellcheck',
    'sqlite3',
  ],
  // Files nothing reachable from the CLIs imports. Frozen rather than deleted
  // because removing product code is the owner's call; delete a file and its
  // line here together. Tracked under "Baseline gate debt" in TODO.md.
  ignore: [
    // A CLI whose single export nothing imports: it is invoked as a command,
    // and the export is the unit boundary this repo enforces.
    'scripts/commands/buildZip.ts',
    'scripts/analyzers/countOccurrences.ts',
    'scripts/analyzers/jaccardSimilarity.ts',
    'scripts/analyzers/overlapScore.ts',
    'scripts/analyzers/semanticCoherenceWarning.ts',
    'scripts/builders/activationSignature.ts',
    'scripts/builders/addQualityWarning.ts',
    'scripts/builders/createSkillQuality.ts',
    'scripts/classifiers/classifySkill.ts',
    'scripts/constants/ALL_RULES_MAX_CHARS_WARN.ts',
    'scripts/constants/ALL_RULES_PATH.ts',
    'scripts/constants/ANTIGRAVITY_DIR.ts',
    'scripts/constants/CLAUDE_MAX_CHARS.ts',
    'scripts/constants/CLAUDE_RULES_DIR.ts',
    'scripts/constants/CODEX_DEFAULT_RULES_PATH.ts',
    'scripts/constants/CODEX_RULES_DIR.ts',
    'scripts/constants/CURSOR_DIR.ts',
    'scripts/constants/DIST_PACKAGES_DIR.ts',
    'scripts/constants/JSON_REPORT.ts',
    'scripts/constants/MD_REPORT.ts',
    'scripts/constants/REPORTS_DIR.ts',
    'scripts/constants/RULE_MAX_CHARS_WARN.ts',
    'scripts/constants/RULES_INDEX_ONLY.ts',
    'scripts/constants/SCHEMA_PATH.ts',
    'scripts/constants/SKILLS_DIST_DIR.ts',
    'scripts/constants/SKILLS_SRC_DIR.ts',
    'scripts/constants/SNAPSHOT_DIR.ts',
    'scripts/constants/VALID_SKILL_CLASSES.ts',
    'scripts/constants/WINDSURF_DIR.ts',
    'scripts/detectors/hasLegacyInlineRules.ts',
    'scripts/detectors/mentionsTooling.ts',
    'scripts/extractors/extractActivationSection.ts',
    'scripts/extractors/extractRules.ts',
    'scripts/extractors/extractRulesIndexRules.ts',
    'scripts/lib/conversations/mergeConversationRecords.ts',
    'scripts/lib/conversations/readExistingConversationArchive.ts',
    'scripts/lib/conversations/types/MergedConversationRecords.ts',
    'scripts/lib/guidance/types/ValidationResult.ts',
    'scripts/lib/link/operations/backupExistingPath.ts',
    'scripts/lib/link/operations/copyFileToGlobal.ts',
    'scripts/lib/link/operations/linkManyWithBackup.ts',
    'scripts/lib/link/operations/linkRuleTarget.ts',
    'scripts/lib/link/operations/linkSkillsToTarget.ts',
    'scripts/lib/link/operations/runLinkScript.ts',
    'scripts/lib/machine/domains/mcp/constants/CODEX_TOP_SECTION_PATTERN.ts',
    'scripts/lib/rules/renderers/renderBundleMd.ts',
    'scripts/lib/rules/renderers/renderBundleWithMdcFrontmatter.ts',
    'scripts/lib/rules/renderers/renderClaude.ts',
    'scripts/lib/skills/matchers/matchBoolean.ts',
    'scripts/lib/skills/matchers/matchValue.ts',
    'scripts/lib/skills/parsers/parseOpenAiYaml.ts',
    'scripts/lib/skills/parsers/parseOpenAiYamlContent.ts',
    'scripts/operations/hashDirectory.ts',
    'scripts/renderers/renderMarkdown.ts',
    'scripts/renderers/renderQualityMarkdown.ts',
    'scripts/reporters/fail.ts',
    'scripts/reporters/pass.ts',
    'scripts/types/QualityEntry.ts',
    'scripts/types/Report.ts',
    'scripts/types/SkillReport.ts',
    'src/index.ts',
    'knip.config.ts',
    'Refine',
    'entry',
    'pattern',
    '(no',
    'matches)',
    'scripts/golden/**/*.{ts,mts,mjs}',
    'knip.config.ts',
    'Refine',
    'entry',
    'pattern',
    '(no',
    'matches)',
    'machine/**/*.{ts,mts,mjs}',
    'knip.config.ts',
    'Refine',
    'entry',
    'pattern',
    '(no',
    'matches)',
  ],
}

export default config
