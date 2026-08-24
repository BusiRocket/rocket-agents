export interface PluginChange {
  operation: "install" | "remove" | "pin" | "enable" | "disable"
  id: string
  detail: string
}
