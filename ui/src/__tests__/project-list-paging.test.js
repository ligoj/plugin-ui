/*
 * ProjectListView pages, sorts and searches on the server: every table option
 * change issues a new rest/project request with the legacy DataTables params.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { LjDataTable, useAuthStore } from '@ligoj/host'
import ProjectListView from '../views/ProjectListView.vue'

function jsonResponse(body) {
  return Promise.resolve({
    ok: true, status: 200,
    headers: { get: (k) => (k === 'content-type' ? 'application/json' : null) },
    json: () => Promise.resolve(body), text: () => Promise.resolve(JSON.stringify(body)),
  })
}
const PAGE = (ids) => ({ data: ids.map((id) => ({ id, name: 'P' + id, pkey: 'p' + id, nbSubscriptions: id })), recordsTotal: 60, recordsFiltered: 60 })

function projectCalls() {
  return globalThis.fetch.mock.calls.map((c) => String(c[0])).filter((u) => u.startsWith('rest/project?')).map((u) => Object.fromEntries(new URLSearchParams(u.split('?')[1])))
}

describe('ProjectListView — server-side paging', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    globalThis.fetch = vi.fn((url) => {
      const q = Object.fromEntries(new URLSearchParams(String(url).split('?')[1] || ''))
      const page = Number(q.page || 1)
      return jsonResponse(PAGE([1, 2].map((i) => (page - 1) * 25 + i)))
    })
  })

  async function mountView() {
    const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/:pathMatch(.*)*', component: { template: '<div />' } }] })
    const w = mount(ProjectListView, { shallow: true, global: { plugins: [router] } })
    await flushPromises()
    return w
  }

  it('loads the first page sorted by name, exposing the server total to the table', async () => {
    const w = await mountView()
    expect(projectCalls()).toEqual([{ rows: '25', page: '1', sidx: 'name', sord: 'asc' }])
    const table = w.findComponent(LjDataTable)
    expect(table.props('itemsLength')).toBe(60)
    expect(table.props('items').map((r) => r.id)).toEqual([1, 2])
  })

  it('shows the team leader by the visual identifier, keeping the full name aside', async () => {
    useAuthStore().session = { applicationSettings: { data: { 'service:id:visual-id-name': 'customAttributes.employeeId' } } }
    globalThis.fetch = vi.fn(() => jsonResponse({ data: [{ id: 1, name: 'P1', pkey: 'p1', teamLeader: { id: 'fdaugan', firstName: 'Fabrice', lastName: 'Daugan', customAttributes: { employeeId: 'E-42' } } }], recordsTotal: 1, recordsFiltered: 1 }))
    const w = await mountView()
    const row = w.findComponent(LjDataTable).props('items')[0]
    expect(row.teamLeader).toBe('E-42')
    expect(row.teamLeaderName).toBe('Fabrice Daugan')
    expect(row.teamLeaderUser.id).toBe('fdaugan')
  })

  it('requests the page and sort the table asks for, mapping the subscriptions column', async () => {
    const w = await mountView()
    const table = w.findComponent(LjDataTable)
    table.vm.$emit('update:options', { page: 2, itemsPerPage: 25, sortBy: [{ key: 'subs', order: 'desc' }] })
    await flushPromises()
    expect(projectCalls().at(-1)).toEqual({ rows: '25', page: '2', sidx: 'nbSubscriptions', sord: 'desc' })
    expect(table.props('items').map((r) => r.id)).toEqual([26, 27])
  })

  it('searches on the server from the first page, keeping the current sort', async () => {
    vi.useFakeTimers()
    try {
      const w = await mountView()
      const table = w.findComponent(LjDataTable)
      table.vm.$emit('update:options', { page: 3, itemsPerPage: 25, sortBy: [{ key: 'createdDate', order: 'desc' }] })
      await flushPromises()
      w.vm.search = 'kyc'
      await vi.advanceTimersByTimeAsync(400)
      await flushPromises()
      expect(projectCalls().at(-1)).toEqual({ rows: '25', page: '1', sidx: 'createdDate', sord: 'desc', 'search[value]': 'kyc' })
    } finally {
      vi.useRealTimers()
    }
  })
})
