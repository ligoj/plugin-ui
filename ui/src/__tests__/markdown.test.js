import { describe, it, expect } from 'vitest'
import { mdToHtml, mdInline } from '../markdown.js'

describe('mdToHtml (backend javadoc-converter subset)', () => {
  it('renders paragraphs and a tight list with its leading blank line', () => {
    const md = 'This action is audited. Rules, order is important :\n\n- Only managers can do it\n- Target user must exist\n\nNote: audited anyway'
    expect(mdToHtml(md)).toBe(
      '<p>This action is audited. Rules, order is important :</p>'
      + '<ul><li>Only managers can do it</li><li>Target user must exist</li></ul>'
      + '<p>Note: audited anyway</p>')
  })

  it('renders inline markup: code, bold, italic, absolute links', () => {
    expect(mdToHtml('Use `id` with **care** and *style*, see [doc](https://ligoj.io/doc)')).toBe(
      '<p>Use <code>id</code> with <strong>care</strong> and <em>style</em>, see '
      + '<a href="https://ligoj.io/doc" target="_blank" rel="noopener noreferrer">doc</a></p>')
  })

  it('renders hard breaks and joins soft breaks', () => {
    expect(mdToHtml('line one\\\nline two')).toBe('<p>line one<br>line two</p>')
    expect(mdToHtml('soft\nwrap')).toBe('<p>soft wrap</p>')
  })

  it('renders fenced code blocks literally', () => {
    expect(mdToHtml('Sample:\n\n```\na < b && c\n```')).toBe(
      '<p>Sample:</p><pre><code>a &lt; b &amp;&amp; c</code></pre>')
  })

  it('escapes HTML everywhere — v-html safe', () => {
    expect(mdToHtml('<script>alert(1)</script> & `<b>`')).toBe(
      '<p>&lt;script&gt;alert(1)&lt;/script&gt; &amp; <code>&lt;b&gt;</code></p>')
  })

  it('renders a list glued to its intro line (no blank line, older backend output)', () => {
    expect(mdToHtml('Rules, order is important :\n- One\n- Two\n\nNote')).toBe(
      '<p>Rules, order is important :</p><ul><li>One</li><li>Two</li></ul><p>Note</p>')
  })

  it('handles empty input', () => {
    expect(mdToHtml('')).toBe('')
    expect(mdToHtml(null)).toBe('')
  })
})

describe('mdInline', () => {
  it('renders inline markup without block wrapping', () => {
    expect(mdInline('The `uid` of **the** user')).toBe('The <code>uid</code> of <strong>the</strong> user')
    expect(mdInline('a < b')).toBe('a &lt; b')
    expect(mdInline('')).toBe('')
  })
})
