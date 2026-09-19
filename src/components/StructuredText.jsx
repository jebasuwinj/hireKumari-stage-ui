import './StructuredText.css'

/** Escape HTML so user content is never injected as markup. */
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Turn **bold** markers into <strong> after escaping. */
function inlineHtml(value) {
  return escapeHtml(value).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
}

/**
 * Renders multi-line admin/public text the way it was entered:
 * blank lines separate blocks, * / - lines become lists, **text** becomes bold.
 */
function StructuredText({ text, className = '' }) {
  if (!text?.trim()) return null

  const lines = String(text).replace(/\r\n/g, '\n').split('\n')
  const blocks = []
  let listItems = null

  const flushList = () => {
    if (!listItems?.length) return
    blocks.push({ type: 'list', items: listItems })
    listItems = null
  }

  for (const raw of lines) {
    const line = raw.trimEnd()
    const bullet = line.match(/^\s*[-*•]\s+(.+)$/)

    if (bullet) {
      if (!listItems) listItems = []
      listItems.push(bullet[1])
      continue
    }

    flushList()

    if (!line.trim()) {
      blocks.push({ type: 'spacer' })
      continue
    }

    blocks.push({ type: 'paragraph', text: line.trim() })
  }
  flushList()

  return (
    <div className={`structured-text ${className}`.trim()}>
      {blocks.map((block, index) => {
        if (block.type === 'spacer') {
          return <div key={`s-${index}`} className="structured-text__spacer" aria-hidden="true" />
        }
        if (block.type === 'list') {
          return (
            <ul key={`l-${index}`} className="structured-text__list">
              {block.items.map((item, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: inlineHtml(item) }} />
              ))}
            </ul>
          )
        }
        return (
          <p
            key={`p-${index}`}
            className="structured-text__p"
            dangerouslySetInnerHTML={{ __html: inlineHtml(block.text) }}
          />
        )
      })}
    </div>
  )
}

export default StructuredText
