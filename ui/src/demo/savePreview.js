/*
 * Demo "save preview": module-level state shared between the demo
 * `editExtension.beforeSave` hook (a plain function, no component context)
 * and the persistently mounted DemoSavePreviewDialog. The hook opens the
 * preview with the payload it received, the payload it completed and the
 * payload actually sent (the demo targets the standard project API, which
 * rejects the demo-only keys), and awaits the user's decision: the sent
 * payload to proceed, `false` to abort the save (the `beforeSave` abort
 * semantic).
 */
import { reactive } from 'vue'

export const savePreview = reactive({
  open: false,
  original: null,
  completed: null,
  sent: null,
  /** @type {null | ((value: object | false) => void)} */
  resolve: null,
})

/**
 * Open the preview and wait for the user's choice.
 *
 * @param {object} original The payload as built by the dialog (before this hook).
 * @param {object} completed The payload completed by the demo extension.
 * @param {object} [sent] The payload actually sent when the user proceeds; the completed one by default.
 * @returns {Promise<object | false>} The payload to send, or `false` to abort.
 */
export function openSavePreview(original, completed, sent = completed) {
  return new Promise((resolve) => {
    savePreview.original = original
    savePreview.completed = completed
    savePreview.sent = sent
    savePreview.resolve = resolve
    savePreview.open = true
  })
}

/** Settle the pending preview: `proceed` sends the `sent` payload, otherwise aborts. */
export function closeSavePreview(proceed) {
  const { resolve, sent } = savePreview
  savePreview.open = false
  savePreview.resolve = null
  resolve?.(proceed ? sent : false)
}
