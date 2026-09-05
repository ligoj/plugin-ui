import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useDemoMode } from '@ligoj/host'
import pluginUiDef, { DEMO_PROJECT_API } from '../index.js'
import { savePreview, openSavePreview, closeSavePreview } from '../demo/savePreview.js'

describe('demo save preview (editExtension.beforeSave showcase)', () => {
  it('opens with the three panes and resolves the sent payload on save', async () => {
    const pending = openSavePreview({ dialog: { name: 'p' }, extension: { demoTags: 'a' }, sent: { name: 'p', description: 'Tags: a' } })
    expect(savePreview.open).toBe(true)
    expect(savePreview.dialog).toEqual({ name: 'p' })
    expect(savePreview.extension).toEqual({ demoTags: 'a' })
    expect(savePreview.sent).toEqual({ name: 'p', description: 'Tags: a' })
    closeSavePreview(true)
    expect(await pending).toEqual({ name: 'p', description: 'Tags: a' })
    expect(savePreview.open).toBe(false)
  })

  it('resolves false (abort) on cancel', async () => {
    const pending = openSavePreview({ dialog: { name: 'p' }, extension: {}, sent: { name: 'p' } })
    closeSavePreview(false)
    expect(await pending).toBe(false)
  })
})

describe('demo project editExtension.beforeSave', () => {
  beforeEach(() => { setActivePinia(createPinia()); useDemoMode().setEnabled(true) })

  const extension = () => pluginUiDef.feature('editExtension', { target: 'project' })
  const hook = () => extension().beforeSave

  it('points the dialog save to the demo endpoint of the plugin backend', () => {
    expect(DEMO_PROJECT_API).toBe('rest/system/demo/project')
    expect(extension().apiPath).toBe(DEMO_PROJECT_API)
  })

  it('splits the form into the dialog fields and the extension input, and sends a more complete payload (tags) to the demo API', async () => {
    const pending = hook()({ name: 'p', pkey: 'p', description: 'Desc', demoTags: ' b, a ,, ' })
    expect(savePreview.open).toBe(true)
    expect(savePreview.dialog).toEqual({ name: 'p', pkey: 'p', description: 'Desc' })
    expect(savePreview.extension).toEqual({ demoTags: ' b, a ,, ' }) // as typed, no transformation
    // `tags` is only known by the demo endpoint; the description is left to the backend
    expect(savePreview.sent).toEqual({ name: 'p', pkey: 'p', description: 'Desc', tags: ['b', 'a'] })
    closeSavePreview(true)
    expect(await pending).toEqual({ name: 'p', pkey: 'p', description: 'Desc', tags: ['b', 'a'] })
  })

  it('sends an empty tags list without input, in edit mode too', async () => {
    let pending = hook()({ id: 3, name: 'p', demoTags: '' })
    expect(savePreview.sent).toEqual({ id: 3, name: 'p', tags: [] })
    closeSavePreview(false)
    expect(await pending).toBe(false)

    pending = hook()({ name: 'p' })
    expect(savePreview.extension).toEqual({})
    expect(savePreview.sent).toEqual({ name: 'p', tags: [] })
    closeSavePreview(false)
    await pending
  })

  it('is not contributed outside demo mode', () => {
    useDemoMode().setEnabled(false)
    expect(pluginUiDef.feature('editExtension', { target: 'project' })).toBeNull()
  })
})
