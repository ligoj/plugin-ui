import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useDemoMode } from '@ligoj/host'
import pluginUiDef from '../index.js'
import { savePreview, openSavePreview, closeSavePreview } from '../demo/savePreview.js'

describe('demo save preview (editExtension.beforeSave showcase)', () => {
  it('opens with both payloads and resolves the completed one on save', async () => {
    const pending = openSavePreview({ name: 'p' }, { name: 'p', demoTagsCount: 0 })
    expect(savePreview.open).toBe(true)
    expect(savePreview.original).toEqual({ name: 'p' })
    closeSavePreview(true)
    expect(await pending).toEqual({ name: 'p', demoTagsCount: 0 })
    expect(savePreview.open).toBe(false)
  })

  it('resolves false (abort) on cancel', async () => {
    const pending = openSavePreview({ name: 'p' }, { name: 'p' })
    closeSavePreview(false)
    expect(await pending).toBe(false)
  })

  it('sends the explicit `sent` payload when it differs from the completed one', async () => {
    const pending = openSavePreview({ name: 'p', demoTags: 'a' }, { name: 'p', demoTags: ['a'], demoTagsCount: 1 }, { name: 'p' })
    expect(savePreview.sent).toEqual({ name: 'p' })
    closeSavePreview(true)
    expect(await pending).toEqual({ name: 'p' })
  })
})

describe('demo project editExtension.beforeSave', () => {
  beforeEach(() => { setActivePinia(createPinia()); useDemoMode().setEnabled(true) })

  const hook = () => pluginUiDef.editExtension({ target: 'project' }).beforeSave

  it('normalizes comma-separated tags, previews the completed payload, sends it without the demo-only keys', async () => {
    const pending = hook()({ name: 'p', pkey: 'p', demoTags: ' b, a ,b,, ' })
    expect(savePreview.open).toBe(true)
    expect(savePreview.original).toEqual({ name: 'p', pkey: 'p', demoTags: ' b, a ,b,, ' })
    expect(savePreview.completed).toEqual({ name: 'p', pkey: 'p', demoTags: ['b', 'a'], demoTagsCount: 2 })
    // The standard project API rejects unknown properties: nothing demo-only leaves the browser
    expect(savePreview.sent).toEqual({ name: 'p', pkey: 'p' })
    closeSavePreview(true)
    expect(await pending).toEqual({ name: 'p', pkey: 'p' })
  })

  it('accepts an array, an empty and a missing tags value', async () => {
    for (const [demoTags, expected] of [[['x', ' x ', 'y'], ['x', 'y']], ['', []], [undefined, []]]) {
      const pending = hook()({ name: 'p', demoTags })
      expect(savePreview.completed.demoTags).toEqual(expected)
      expect(savePreview.completed.demoTagsCount).toBe(expected.length)
      closeSavePreview(false)
      expect(await pending).toBe(false)
    }
  })

  it('is not contributed outside demo mode', () => {
    useDemoMode().setEnabled(false)
    expect(pluginUiDef.editExtension({ target: 'project' })).toBeNull()
  })
})
