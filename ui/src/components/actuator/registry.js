/*
 * Maps each Spring Boot Actuator endpoint id to its dedicated, user-friendly
 * Vue renderer. ActuatorView falls back to the raw JSON view when an endpoint
 * has no entry here (or when the user toggles the raw view).
 */
import ActHealth from './ActHealth.vue'
import ActInfo from './ActInfo.vue'
import ActMetrics from './ActMetrics.vue'
import ActEnv from './ActEnv.vue'
import ActBeans from './ActBeans.vue'
import ActMappings from './ActMappings.vue'
import ActConfigProps from './ActConfigProps.vue'
import ActConditions from './ActConditions.vue'
import ActLoggers from './ActLoggers.vue'
import ActThreadDump from './ActThreadDump.vue'
import ActCaches from './ActCaches.vue'
import ActScheduledTasks from './ActScheduledTasks.vue'
import ActSbom from './ActSbom.vue'
import ActStartup from './ActStartup.vue'

export const ACTUATOR_RENDERERS = {
  health: ActHealth,
  info: ActInfo,
  metrics: ActMetrics,
  env: ActEnv,
  beans: ActBeans,
  mappings: ActMappings,
  configprops: ActConfigProps,
  conditions: ActConditions,
  loggers: ActLoggers,
  threaddump: ActThreadDump,
  caches: ActCaches,
  scheduledtasks: ActScheduledTasks,
  sbom: ActSbom,
  startup: ActStartup,
}
