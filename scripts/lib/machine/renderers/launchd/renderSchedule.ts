import { renderCalendarInterval } from "./renderCalendarInterval"
import { renderStartInterval } from "./renderStartInterval"
import type { ServiceSchedule } from "../../domains/services/types/ServiceSchedule"

export const renderSchedule = (schedule: ServiceSchedule): string[] =>
  schedule.intervalSeconds === undefined
    ? renderCalendarInterval(schedule)
    : renderStartInterval(schedule.intervalSeconds)
