export interface ClaudeSecurityPolicy {
  profiles: ["claude-personal", "claude-favish"]
  defaultMode: "auto"
  skipDangerousModePermissionPrompt: true
  remoteControlAtStartup: boolean
  remoteControlExceptionReason?: string
}
