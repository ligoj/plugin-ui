import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount, flushPromises } from '@vue/test-utils'
import ProjectEditDialog from '../views/ProjectEditDialog.vue'

function jsonResponse(body) {
  return Promise.resolve({
    ok: true, status: 200,
    headers: { get: (k) => (k === 'content-type' ? 'application/json' : null) },
    json: () => Promise.resolve(body), text: () => Promise.resolve(JSON.stringify(body)),
  })
}

describe('ProjectEditDialog — team leader search', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    globalThis.fetch = vi.fn(() => jsonResponse({ data: [{ id: 'fdaugan', firstName: 'Fabrice', lastName: 'Daugan' }], recordsTotal: 1 }))
  })

  it('sends the typed text as the DataTables search criterion the user API reads', async () => {
    const w = mount(ProjectEditDialog, { shallow: true, props: { modelValue: true, project: null } })
    await flushPromises()
    w.vm.leaderSearch = 'Fabrice'
    await w.vm.loadLeaders()
    const url = String(globalThis.fetch.mock.calls.at(-1)[0])
    expect(url).toContain('rest/service/id/user?')
    expect(url).toContain('search[value]=Fabrice')
    expect(url).not.toContain('q=')
    expect(w.vm.leaderItems).toEqual([{ id: 'fdaugan', label: 'fdaugan — Fabrice Daugan' }])
  })

  it('sends no criterion when nothing is typed', async () => {
    const w = mount(ProjectEditDialog, { shallow: true, props: { modelValue: true, project: null } })
    await flushPromises()
    w.vm.leaderSearch = '   '
    await w.vm.loadLeaders()
    const url = String(globalThis.fetch.mock.calls.at(-1)[0])
    expect(url).toContain('rest/service/id/user?rows=20')
    expect(url).not.toContain('search')
  })
})
