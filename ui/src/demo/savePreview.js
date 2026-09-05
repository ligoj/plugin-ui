/*
 * Demo "save preview": module-level state shared between the demo
 * `editExtension.beforeSave` hook (a plain function, no component context)
 * and the persistently mounted DemoSavePreviewDialog. The hook opens the
 * preview with three payloads — the dialog's own fields, the keys added by
 * the extension's inputs, and the request body actually sent to the demo
 * endpoint (`apiPath` override, see `DEMO_PROJECT_API`) — and awaits
 * the user's decision: the sent payload to proceed, `false` to abort the
 * save (the `beforeSave` abort semantic).
 */
import { reactive } from 'vue'

export const savePreview = reactive({
  open: false,
  /** The dialog's own fields (the form without the extension's keys). */
  dialog: null,
  /** The keys the extension's inputs wrote into the form. */
  extension: null,
  /** The request body returned by the hook. */
  sent: null,
  /** @type {null | ((value: object | false) => void)} */
  resolve: null,
})

/**
 * Open the preview and wait for the user's choice.
 *
 * @param {{dialog: object, extension: object, sent: object}} panes The three payloads to display.
 * @returns {Promise<object | false>} The `sent` payload when the user proceeds, or `false` to abort.
 */
export function openSavePreview({ dialog, extension, sent }) {
  return new Promise((resolve) => {
    savePreview.dialog = dialog
    savePreview.extension = extension
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
