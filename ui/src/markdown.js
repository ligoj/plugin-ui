/*
 * Minimal Markdown → HTML renderer for the OpenAPI descriptions produced by
 * the backend's javadoc converter (JavadocDocumentationProvider): paragraphs,
 * tight bullet lists (blank line before the list), fenced code blocks,
 * backslash hard breaks, `code`, **bold**, *italic* and [text](http url).
 *
 * All input text is HTML-escaped BEFORE any markup is emitted, so a hostile
 * description cannot inject HTML — safe for `v-html`.
 */

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** Inline markup on an already-escaped string. Code spans shield their content. */
function inline(escaped) {
  return escaped
    .split(/(`[^`]+`)/)
    .map((part) =>
      part.startsWith('`') && part.endsWith('`') && part.length > 2
        ? `<code>${part.slice(1, -1)}</code>`
        : part
            .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/\*([^*]+)\*/g, '<em>$1</em>')
            .replace(/\\\n/g, '<br>')
            .replace(/\n/g, ' '),
    )
    .join('')
}

/** One block: paragraph lines and runs of `- ` list items, in order. */
function renderBlock(block) {
  const out = []
  let para = []
  let items = null
  const flushPara = () => { if (para.length) { out.push(`<p>${inline(escapeHtml(para.join('\n')))}</p>`); para = [] } }
  const flushList = () => { if (items) { out.push(`<ul>${items.map((i) => `<li>${inline(escapeHtml(i))}</li>`).join('')}</ul>`); items = null } }
  for (const line of block.split('\n')) {
    if (line.startsWith('- ')) { flushPara(); (items ??= []).push(line.slice(2)) }
    else { flushList(); para.push(line) }
  }
  flushPara()
  flushList()
  return out.join('')
}

/**
 * Render a full Markdown description (paragraphs, lists, fences) to HTML.
 *
 * @param {string} md The Markdown text (may be null/empty).
 * @returns {string} The HTML, '' when empty.
 */
export function mdToHtml(md) {
  if (!md) return ''
  // Fenced code blocks are literal: split them out before block parsing
  return String(md)
    .split(/```\n?([\s\S]*?)\n?```/)
    .map((part, i) => {
      if (i % 2) return `<pre><code>${escapeHtml(part)}</code></pre>`
      return part
        .split(/\n{2,}/)
        .map((block) => block.trim())
        .filter(Boolean)
        .map((block) => renderBlock(block))
        .join('')
    })
    .join('')
}

/**
 * Render inline-only Markdown (no block wrapping) — for short spans like
 * parameter or response descriptions.
 *
 * @param {string} md The Markdown text (may be null/empty).
 * @returns {string} The HTML, '' when empty.
 */
export function mdInline(md) {
  return md ? inline(escapeHtml(String(md))) : ''
}
