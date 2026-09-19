import { useLayoutEffect, useRef, useState } from 'react'
import './ClampedText.css'

/**
 * Clamps `text` to `lines` lines and shows a "Read more" / "Read less"
 * toggle, but only when the text actually overflows that many lines.
 */
function ClampedText({ text, lines = 2, className = '' }) {
  const [expanded, setExpanded] = useState(false)
  const [overflowing, setOverflowing] = useState(false)
  const ref = useRef(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const check = () => setOverflowing(el.scrollHeight > el.clientHeight + 1)
    check()

    const observer = new ResizeObserver(check)
    observer.observe(el)
    return () => observer.disconnect()
  }, [text, lines])

  return (
    <div className={`clamped-text ${className}`}>
      <p
        ref={ref}
        className={expanded ? '' : 'clamped-text__body'}
        style={expanded ? undefined : { WebkitLineClamp: lines }}
      >
        {text}
      </p>
      {(overflowing || expanded) && (
        <button type="button" className="clamped-text__toggle" onClick={() => setExpanded((v) => !v)}>
          {expanded ? 'Read less' : 'Read more'}
        </button>
      )}
    </div>
  )
}

export default ClampedText
