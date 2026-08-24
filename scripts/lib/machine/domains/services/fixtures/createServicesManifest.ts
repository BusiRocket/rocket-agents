import { createServiceDefinition } from "./createServiceDefinition"
import type { ServicesManifest } from "../types/ServicesManifest"

export const createServicesManifest = (): ServicesManifest => ({
  version: 1,
  services: [createServiceDefinition()],
})
