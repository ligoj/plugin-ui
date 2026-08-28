import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { LjPageHeader } from '@ligoj/host'
import ProjectListView from '../views/ProjectListView.vue'

function jsonResponse(body) {
  return Promise.resolve({
    ok: true, status: 200,
    headers: { get: (k) => (k === 'content-type' ? 'application/json' : null) },
    json: () => Promise.resolve(body), text: () => Promise.resolve(JSON.stringify(body)),
  })
}

describe('ProjectListView — toolbar plugin actions', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    globalThis.fetch = vi.fn(() => jsonResponse({ data: [], recordsTotal: 0 }))
  })

  it("targets 'project' and supplies a reload", async () => {
    const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/:pathMatch(.*)*', component: { template: '<div />' } }] })
    const w = mount(ProjectListView, { shallow: true, global: { plugins: [router] } })
    await flushPromises()
    const header = w.findComponent(LjPageHeader)
    expect(header.props('actionsTarget')).toBe('project')
    const context = header.props('actionsContext')()
    expect(typeof context.reload).toBe('function')
    const before = globalThis.fetch.mock.calls.length
    context.reload()
    await flushPromises()
    expect(globalThis.fetch.mock.calls.length).toBeGreaterThan(before)
  })
})
