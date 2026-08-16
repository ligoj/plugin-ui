import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount, flushPromises } from '@vue/test-utils'
import { useI18nStore } from '@ligoj/host'
import enMessages from '../i18n/en.js'

// Deep link under test: /api?op=<method>|<path> must open the owning tag
// group + the operation body and highlight the operation card.
const OP_KEY = 'put|/service/id/container-scope'

vi.mock('vue-router', async (importOriginal) => ({
  ...(await importOriginal()),
  useRoute: () => ({ query: { op: OP_KEY }, params: {}, path: '/api' }),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}))

import ApiHomeView from '../views/ApiHomeView.vue'

const SPEC = {
  openapi: '3.0.1',
  info: { title: 'Ligoj API', version: '4.0.0' },
  tags: [{ name: 'project' }, { name: 'id' }],
  paths: {
    '/project/{id}': {
      get: { tags: ['project'], summary: 'Get a project', responses: {} },
      delete: { tags: ['project'], summary: 'Delete a project', responses: {} },
    },
    '/service/id/container-scope': {
      put: { tags: ['id'], summary: 'Update a scope', responses: {} },
    },
  },
}

function jsonResponse(body) {
  return {
    ok: true, status: 200,
    headers: { get: () => 'application/json' },
    clone() { return jsonResponse(body) },
    json: async () => body,
    text: async () => JSON.stringify(body),
  }
}

const stubs = {
  LjPageHeader: { template: '<div class="hdr"><slot name="actions" /></div>' },
  LjSearch: { props: ['modelValue'], template: '<input class="search" />' },
  'v-icon': true,
}

describe('ApiHomeView deep link (?op=…)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    useI18nStore().merge(enMessages, 'en')
    globalThis.fetch = vi.fn(() => Promise.resolve(jsonResponse(SPEC)))
    Element.prototype.scrollIntoView = vi.fn()
  })

  it('opens the owning tag group, expands and highlights the operation', async () => {
    const w = mount(ApiHomeView, { attachTo: document.body, global: { stubs } })
    await flushPromises()
    await flushPromises()

    // The targeted operation card is rendered (its 'id' tag group is open),
    // highlighted, and its body is expanded.
    const focused = w.find('.op.focused')
    expect(focused.exists()).toBe(true)
    expect(focused.attributes('id')).toBe(`op-${encodeURIComponent(OP_KEY)}`)
    expect(focused.find('.op-path').text()).toBe('/service/id/container-scope')
    expect(focused.find('.op-body').exists()).toBe(true)
    // Scrolled into view.
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled()
    // The unrelated operations are not highlighted.
    expect(w.findAll('.op.focused').length).toBe(1)
    w.unmount()
  })
})
