/*
 * HomeView KPI cards: each one shows only when the session may call the API feeding it, and that API is not
 * called otherwise (no error notification for a user without the permission).
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount, flushPromises } from '@vue/test-utils'
import { useAuthStore, useI18nStore } from '@ligoj/host'
import enMessages from '../i18n/en.js'
import HomeView from '../views/HomeView.vue'

function json(body) { return { ok: true, status: 200, headers: { get: () => 'application/json' }, json: () => Promise.resolve(body), text: () => Promise.resolve(JSON.stringify(body)) } }
const urls = () => globalThis.fetch.mock.calls.map(([u]) => String(u))

async function kpiLabels(session) {
  useAuthStore().session = session
  const w = mount(HomeView, { shallow: true })
  await flushPromises()
  return w.vm.kpis.map((k) => k.l)
}

const SUBSCRIPTION_KPIS = [enMessages['home.kpi.projects'], enMessages['home.kpi.tools'], enMessages['home.kpi.subscriptions']]
const USERS_KPI = enMessages['home.kpi.users']

beforeEach(() => {
  setActivePinia(createPinia())
  useI18nStore().merge(enMessages, 'en')
  globalThis.fetch = vi.fn(() => Promise.resolve(json({})))
})

describe('HomeView KPI permissions', () => {
  it('shows every KPI to an administrator', async () => {
    expect(await kpiLabels({ admin: true, roles: ['ADMIN'] })).toEqual([...SUBSCRIPTION_KPIS, USERS_KPI])
    expect(urls()).toContain('rest/system/user?rows=1&page=1')
  })

  it('hides the users KPI and skips its call without GET rest/system/user', async () => {
    expect(await kpiLabels({ roles: ['USER'], apiAuthorizations: [{ method: 'GET', pattern: '^rest/subscription.*' }] })).toEqual(SUBSCRIPTION_KPIS)
    expect(urls().filter((u) => u.includes('rest/system/user'))).toEqual([])
    expect(urls()).toContain('rest/subscription')
  })

  it('hides the subscription KPIs and skips their call without GET rest/subscription', async () => {
    expect(await kpiLabels({ roles: ['USER'], apiAuthorizations: [{ method: 'GET', pattern: '^rest/system/user.*' }] })).toEqual([USERS_KPI])
    expect(urls()).not.toContain('rest/subscription')
  })

  it('shows no KPI without any permission', async () => {
    expect(await kpiLabels({ roles: ['USER'], apiAuthorizations: [] })).toEqual([])
  })
})
