import { matchBoolean } from '../matchers/matchBoolean'
import { matchValue } from '../matchers/matchValue'
import { stripQuotes } from '../transformers/stripQuotes'

export const parseOpenAiYamlContent = (content: string) => {
  const interfaceDisplayName = stripQuotes(
    matchValue(content, /^\s{2}display_name:(.*)$/m),
  )
  const interfaceShortDescription = stripQuotes(
    matchValue(content, /^\s{2}short_description:(.*)$/m),
  )
  const interfaceDefaultPrompt = stripQuotes(
    matchValue(content, /^\s{2}default_prompt:(.*)$/m),
  )

  const interfaceBrandColor = stripQuotes(
    matchValue(content, /^\s{2}brand_color:(.*)$/m),
  )

  const interfaceIconSmall = stripQuotes(
    matchValue(content, /^\s{2}icon_small:(.*)$/m),
  )

  const interfaceIconLarge = stripQuotes(
    matchValue(content, /^\s{2}icon_large:(.*)$/m),
  )
  const allowImplicitInvocation = matchBoolean(
    content,

    /^\s{2}allow_implicit_invocation:(.*)$/m,
  )

  const skillClass = stripQuotes(
    matchValue(content, /^\s{2}skill_class:(.*)$/m),
  )

  const requiresReferences = matchBoolean(
    content,
    /^\s{2}requires_references:(.*)$/m,
  )

  const failureMode = stripQuotes(
    matchValue(content, /^\s{2}failure_mode:(.*)$/m),
  )

  const toolDependencyCount = (content.match(/^\s{4}- type:(.*)$/gm) ?? [])
    .length

  return {
    raw: content,
    interface: {
      hasSection: /^interface:\s*$/m.test(content),
      displayName: interfaceDisplayName,
      shortDescription: interfaceShortDescription,
      defaultPrompt: interfaceDefaultPrompt,
      brandColor: interfaceBrandColor,
      iconSmall: interfaceIconSmall,
      iconLarge: interfaceIconLarge,
    },
    policy: {
      hasSection: /^policy:\s*$/m.test(content),
      allowImplicitInvocation,
    },
    busirocket: {
      hasSection: /^busirocket:\s*$/m.test(content),
      skillClass,
      requiresReferences,
      failureMode,
    },
    dependencies: {
      hasSection: /^dependencies:\s*$/m.test(content),
      hasToolsSection: /^\s{2}tools:\s*$/m.test(content),
      toolDependencyCount,
    },
  }
}
