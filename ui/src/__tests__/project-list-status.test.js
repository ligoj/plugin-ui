/*
 * The status column of the project list: the status badge of each project, from the last known statuses of its
 * subscriptions (GET rest/subscription/status/{project}, loaded when the row appears), refreshed on click.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { useAuthStore, useI18nStore } from '@ligoj/host'
import ProjectListView from '../views/ProjectListView.vue'
import enMessages from '../i18n/en.js'

const PROJECTS = { data: [{ id: 1, name: 'A', pkey: 'a', nbSubscriptions: 3 }, { id: 2, name: 'B', pkey: 'b', nbSubscriptions: 0 }], recordsTotal: 2, recordsFiltered: 2 }
// Last status event of each subscription having one, keyed by subscription
const STATUS = { 10: { subscription: 10, value: 'UP' }, 11: { subscription: 11, value: 'DOWN' } }

function json(body) { return { ok: true, status: 200, headers: { get: () => 'application/json' }, json: () => Promise.resolve(body), text: () => Promise.resolve(JSON.stringify(body)) } }
const stubs = {
  LjPageHeader: { template: '<div><slot name="actions" /></div>' },
  LjSearch: true, LjButton: true, LjConfirmDialog: true, ProjectEditDialog: true, RowActionsCog: true,
  // The table requests its first page on mount and renders the status cell of each row
  LjDataTable: {
    props: ['headers', 'items'],
    emits: ['update:options'],
    mounted() { this.$emit('update:options', { page: 1, itemsPerPage: 25, sortBy: [] }) },
    template: '<div><div v-for="it in items" :key="it.id" class="row" :data-id="it.id"><slot name="cell.status" :item="it" /></div></div>',
  },
  NodeStatusBadge: { name: 'NodeStatusBadge', props: ['subStats', 'nodeStats', 'refreshing', 'hint', 'readonly'], emits: ['refresh'], template: '<i class="badge" />' },
}

async function mountList() {
  const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/:pathMatch(.*)*', component: { template: '<div />' } }] })
  const w = mount(ProjectListView, { global: { stubs, plugins: [router] } })
  await flushPromises()
  return w
}
const badgeOf = (w, id) => w.find(`.row[data-id="${id}"]`).findComponent({ name: 'NodeStatusBadge' })
const gets = () => globalThis.fetch.mock.calls.map(([u]) => String(u))

const RealObserver = globalThis.IntersectionObserver
beforeEach(() => {
  setActivePinia(createPinia())
  useI18nStore().merge(enMessages, 'en')
  // Every row is in view at once
  globalThis.IntersectionObserver = class { constructor(cb) { this.cb = cb } observe() { this.cb([{ isIntersecting: true }], this) } disconnect() {} unobserve() {} }
  globalThis.fetch = vi.fn((url) => {
    const u = String(url)
    if (u.includes('rest/subscription/status/refresh')) return Promise.resolve(json({}))
    if (u.includes('rest/subscription/status/1')) return Promise.resolve(json(STATUS))
    if (u.includes('rest/project/1')) return Promise.resolve(json({ id: 1, subscriptions: [{ id: 10 }, { id: 11 }, { id: 12 }] }))
    return Promise.resolve(json(PROJECTS))
  })
})
afterEach(() => { globalThis.IntersectionObserver = RealObserver })

describe('ProjectListView status column', () => {
  it('is the first column', async () => {
    useAuthStore().session = { admin: true }
    const w = await mountList()
    expect(w.findComponent(stubs.LjDataTable).props('headers')[0]).toMatchObject({ key: 'status', icon: 'mdi-heart-pulse' })
  })

  it('shows the last known statuses of the subscriptions of each project, nothing without subscription', async () => {
    useAuthStore().session = { admin: true }
    const w = await mountList()
    expect(badgeOf(w, 1).props()).toMatchObject({ subStats: { total: 3, up: 1, down: 1, unknown: 1 }, nodeStats: null, refreshing: false, hint: 'Click: subscriptions', readonly: false })
    expect(badgeOf(w, 2).exists()).toBe(false)
    expect(gets().filter((u) => u.includes('rest/subscription/status/'))).toEqual(['rest/subscription/status/1'])
  })

  it('refreshes the subscriptions of the project on click, then reloads its statuses', async () => {
    useAuthStore().session = { admin: true }
    const w = await mountList()
    badgeOf(w, 1).vm.$emit('refresh', false)
    await flushPromises()
    const after = gets().slice(-3)
    expect(after).toEqual(['rest/project/1', 'rest/subscription/status/refresh?id=10&id=11&id=12', 'rest/subscription/status/1'])
  })

  it('shows the statuses only to a user who may not refresh them', async () => {
    useAuthStore().session = { roles: ['USER'], apiAuthorizations: [{ method: 'GET', pattern: '^rest/project.*' }, { method: 'GET', pattern: '^rest/subscription/status/\\d+' }] }
    const w = await mountList()
    expect(badgeOf(w, 1).props('readonly')).toBe(true)
  })
})
