// Load the sibling index.css at runtime. Vite's library build emits it as
// a separate file but does NOT add `import './index.css'` to the JS entry
// — so when the host dynamic-imports this bundle the stylesheet never
// loads and none of the scoped or global SFC styles apply. Injecting a
// <link rel="stylesheet"> resolved against import.meta.url keeps the
// approach path-agnostic (works under /ligoj/webjars/ui/vue/... in prod
// and under the dev proxy).
if (typeof document !== 'undefined') {
  const id = 'ligoj-plugin-ui-css'
  if (!document.getElementById(id)) {
    const link = document.createElement('link')
    link.id = id
    link.rel = 'stylesheet'
    link.href = new URL('./index.css', import.meta.url).href
    document.head.appendChild(link)
  }
}

/*
 * Plugin "ui" — Ligoj shared UI (dashboard, project browser, system admin,
 * API docs, subscribe wizard). Ported from the legacy Cascade.js
 * implementation that still lives at `../src/main/resources/META-INF/resources/webjars/`.
 *
 * Contract consumed by the Ligoj Vue host:
 *   - id         : stable plugin identifier
 *   - label      : display name
 *   - component  : root Vue component (the plugin shell)
 *   - routes     : dynamic routes registered at install time
 *   - install    : called once at registration; receives ctx.router
 *   - feature    : action dispatcher over the plugin's service functions
 *   - service    : raw service module
 *   - meta       : presentation hints (icon, color)
 *
 * Authored as source — compiled to `/webjars/ui/vue/index.js` by Vite.
 * Shared host surface is imported from `@ligoj/host` (kept external so the
 * plugin and host share the same pinia / reactive instances).
 */
import UiPlugin from './UiPlugin.vue'
import service from './service.js'

import HomeView from './views/HomeView.vue'
import ProjectListView from './views/ProjectListView.vue'
import ProjectDetailView from './views/ProjectDetailView.vue'
import ManualView from './views/ManualView.vue'

import SystemView from './views/SystemView.vue'
import SystemInfoView from './views/SystemInfoView.vue'
import SystemConfigurationView from './views/SystemConfigurationView.vue'
import SystemUserView from './views/SystemUserView.vue'
import SystemRoleView from './views/SystemRoleView.vue'
import SystemPluginView from './views/SystemPluginView.vue'
import SystemNodeView from './views/SystemNodeView.vue'
import SystemCacheView from './views/SystemCacheView.vue'
import SystemBenchView from './views/SystemBenchView.vue'

import ApiHomeView from './views/ApiHomeView.vue'
import ApiTokenView from './views/ApiTokenView.vue'

import SubscribeWizardView from './views/SubscribeWizardView.vue'

const features = {
  sample: service.sample,
}

const routes = [
  { path: '/home',                      name: 'ui-home',              component: HomeView },
  { path: '/home/manual',               name: 'ui-manual',            component: ManualView },
  { path: '/home/project',              name: 'ui-project-list',      component: ProjectListView },
  { path: '/home/project/:id',          name: 'ui-project-detail',    component: ProjectDetailView },

  { path: '/system',                    name: 'ui-system',            component: SystemView },
  { path: '/system/information',        name: 'ui-system-information', component: SystemInfoView },
  { path: '/system/configuration',      name: 'ui-system-configuration', component: SystemConfigurationView },
  { path: '/system/user',               name: 'ui-system-user',       component: SystemUserView },
  { path: '/system/role',               name: 'ui-system-role',       component: SystemRoleView },
  { path: '/system/plugin',             name: 'ui-system-plugin',     component: SystemPluginView },
  { path: '/system/node',               name: 'ui-system-node',       component: SystemNodeView },
  { path: '/system/cache',              name: 'ui-system-cache',      component: SystemCacheView },
  { path: '/system/bench',              name: 'ui-system-bench',      component: SystemBenchView },

  { path: '/api',                       name: 'ui-api',               component: ApiHomeView },
  { path: '/api/token',                 name: 'ui-api-token',         component: ApiTokenView },

  { path: '/subscribe',                            name: 'ui-subscribe',           component: SubscribeWizardView },
  // Project-scoped entry used by ProjectDetailView's "Add subscription" button.
  { path: '/home/project/:id/subscription',        name: 'ui-subscribe-project',   component: SubscribeWizardView },
]

export default {
  id: 'ui',
  label: 'UI',
  component: UiPlugin,
  routes,
  install({ router }) {
    for (const route of routes) {
      router.addRoute(route)
    }
  },
  feature(action, ...args) {
    const fn = features[action]
    if (!fn) throw new Error(`Plugin "ui" has no feature "${action}"`)
    return fn(...args)
  },
  service,
  meta: { icon: 'mdi-view-dashboard', color: 'indigo-darken-2' },
}

export { service }
export * from './useUiHelpers.js'
