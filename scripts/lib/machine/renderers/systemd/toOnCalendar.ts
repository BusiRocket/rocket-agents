import { SYSTEMD_WEEKDAYS } from "./SYSTEMD_WEEKDAYS"
import type { ServiceSchedule } from "../../domains/services/types/ServiceSchedule"

export const toOnCalendar = (schedule: ServiceSchedule): string => {
  const time = `${String(schedule.hour).padStart(2, "0")}:${String(schedule.minute).padStart(2, "0")}:00`
  const day = schedule.weekday === undefined ? undefined : SYSTEMD_WEEKDAYS[schedule.weekday]

  return day === undefined ? `*-*-* ${time}` : `${day} *-*-* ${time}`
}
