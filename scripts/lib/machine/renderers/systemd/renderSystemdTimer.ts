import { toOnCalendar } from "./toOnCalendar"
import type { ServiceDefinition } from "../../domains/services/types/ServiceDefinition"

export const renderSystemdTimer = (service: ServiceDefinition): string | undefined => {
  if (service.schedule === undefined) {
    return undefined
  }

  return [
    "[Unit]",
    `Description=${service.name} timer`,
    "",
    "[Timer]",
    `OnCalendar=${toOnCalendar(service.schedule)}`,
    "Persistent=true",
    "",
    "[Install]",
    "WantedBy=timers.target",
    "",
  ].join("\n")
}
