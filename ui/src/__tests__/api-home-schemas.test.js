import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount, flushPromises } from '@vue/test-utils'
import { useI18nStore } from '@ligoj/host'
import enMessages from '../i18n/en.js'

vi.mock('vue-router', async (importOriginal) => ({
  ...(await importOriginal()),
  useRoute: () => ({ query: {}, params: {}, path: '/api' }),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}))

import ApiHomeView from '../views/ApiHomeView.vue'

// Schemas section under test: the response type of the operation references
// TableItemContainerScope, whose `data` property references ContainerScopeVo.
const SPEC = {
  openapi: '3.0.1',
  info: { title: 'Ligoj API', version: '4.0.0' },
  tags: [{ name: 'id' }],
  paths: {
    '/service/id/container-scope/{type}': {
      get: {
        tags: ['id'],
        summary: 'List scopes',
        responses: {
          200: {
            description: 'The scopes',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/TableItemContainerScope' } } },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      TableItemContainerScope: {
        type: 'object',
        description: 'Paginated container scopes',
        properties: {
          recordsTotal: { type: 'integer', format: 'int64' },
          data: { type: 'array', items: { $ref: '#/components/schemas/ContainerScopeVo' } },
        },
      },
      ContainerScopeVo: {
        type: 'object',
        properties: { name: { type: 'string', description: 'The scope `name`' } },
      },
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

describe('ApiHomeView schema definitions', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    useI18nStore().merge(enMessages, 'en')
    globalThis.fetch = vi.fn().mockResolvedValue(jsonResponse(SPEC))
  })

  it('lists the schemas and opens a definition from a response type reference', async () => {
    const wrapper = mount(ApiHomeView, { global: { stubs } })
    await flushPromises()

    // The Schemas group is listed (collapsed) with both definitions counted
    const schemaGroup = wrapper.findAll('.group').find((g) => g.text().includes('Schemas'))
    expect(schemaGroup).toBeTruthy()
    expect(schemaGroup.find('.g-count').text()).toBe('2')

    // Open the operation and click its response type reference
    await wrapper.find('.op-head').trigger('click')
    const refBtn = wrapper.findAll('.p-type.ref').find((b) => b.text() === 'TableItemContainerScope')
    expect(refBtn).toBeTruthy()
    await refBtn.trigger('click')
    await flushPromises()

    // The definition card is open, focused, and shows its javadoc + properties
    const card = wrapper.find('#schema-TableItemContainerScope')
    expect(card.exists()).toBe(true)
    expect(card.classes()).toContain('focused')
    expect(card.text()).toContain('Paginated container scopes')
    expect(card.text()).toContain('recordsTotal')

    // The nested array item reference is clickable too and opens its target
    const nested = card.findAll('.p-type.ref').find((b) => b.text() === 'ContainerScopeVo[]')
    expect(nested).toBeTruthy()
    await nested.trigger('click')
    await flushPromises()
    const nestedCard = wrapper.find('#schema-ContainerScopeVo')
    expect(nestedCard.classes()).toContain('focused')
    // Property description rendered as inline markdown (backend javadoc)
    expect(nestedCard.html()).toContain('The scope <code>name</code>')
  })
})
