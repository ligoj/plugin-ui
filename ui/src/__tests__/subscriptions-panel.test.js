import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { LjSegmented, VibrantDataTable } from '@ligoj/host'
import SubscriptionsPanel from '../components/SubscriptionsPanel.vue'

// Minimal grouped model: one tool with one subscription row. Enough for the
// component to render either the cards grid (`.sp-grid`) or the list table.
const GROUPS = [{
  key: 'tool-1', name: 'Tool 1', kind: 'kind', color: '#123456', icon: 'div', health: 'ok',
  rows: [{ name: 'sub-a', status: 'ok', pills: [], sub: { id: 1 } }],
}]

function mountPanel(props = {}) {
  return mount(SubscriptionsPanel, {
    props: { groups: GROUPS, ...props },
    global: {
      // Stub the heavy host children; we only drive the LjSegmented v-model.
      stubs: { LjSearch: true, VibrantDataTable: true, SubscriptionGroupCard: true, PluginFeatures: true },
    },
  })
}

// view === 'cards' renders the `.sp-grid` div; view === 'list' renders the table.
const isCards = (w) => w.find('.sp-grid').exists()

describe('SubscriptionsPanel — view persistence', () => {
  beforeEach(() => { setActivePinia(createPinia()) }) // setup.js clears the localStorage mock

  it('persists the selected view under ligoj-subview:<storageKey>', async () => {
    const w = mountPanel({ storageKey: 'test', defaultView: 'list' })
    expect(isCards(w)).toBe(false) // starts on the default (list)
    await w.findComponent(LjSegmented).vm.$emit('update:modelValue', 'cards')
    expect(localStorage.getItem('ligoj-subview:test')).toBe('cards')
    expect(isCards(w)).toBe(true)
  })

  it('restores the stored view on remount, overriding default-view', () => {
    localStorage.setItem('ligoj-subview:test', 'cards')
    const w = mountPanel({ storageKey: 'test', defaultView: 'list' })
    expect(isCards(w)).toBe(true) // restored to cards even though default is list
  })

  it('keeps contexts independent (home vs project)', async () => {
    const home = mountPanel({ storageKey: 'home', defaultView: 'cards' })
    await home.findComponent(LjSegmented).vm.$emit('update:modelValue', 'list')
    expect(localStorage.getItem('ligoj-subview:home')).toBe('list')
    expect(localStorage.getItem('ligoj-subview:project')).toBe(null)

    const project = mountPanel({ storageKey: 'project', defaultView: 'list' })
    await project.findComponent(LjSegmented).vm.$emit('update:modelValue', 'cards')
    expect(localStorage.getItem('ligoj-subview:project')).toBe('cards')
    expect(localStorage.getItem('ligoj-subview:home')).toBe('list') // untouched
  })

  it('without storageKey, leaves localStorage untouched (backward compatible)', async () => {
    const w = mountPanel({ defaultView: 'list' })
    await w.findComponent(LjSegmented).vm.$emit('update:modelValue', 'cards')
    expect(localStorage.length).toBe(0)
    expect(isCards(w)).toBe(true) // still reactive in-memory
  })

  it('ignores an invalid stored value and falls back to default-view', () => {
    localStorage.setItem('ligoj-subview:test', 'garbage')
    const w = mountPanel({ storageKey: 'test', defaultView: 'list' })
    expect(isCards(w)).toBe(false)
    expect(w.findComponent(VibrantDataTable).exists()).toBe(true)
  })
})
