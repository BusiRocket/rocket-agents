import type { PluginsApplyResult } from "./types/PluginsApplyResult"
import type { MachineStatus } from "../../types/MachineStatus"

export const toPluginsApplyStatus = ({
  result,
  pruned,
}: {
  result: PluginsApplyResult
  pruned: number
}): MachineStatus => {
  if (result.failed.length > 0) {
    return "failed"
  }

  return result.applied.length + pruned === 0 ? "converged" : "changed"
}
