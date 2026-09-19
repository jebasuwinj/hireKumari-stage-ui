import { useEffect, useRef, useState } from 'react'

/**
 * Runs an async fetcher on mount (and whenever `deps` change), tracking
 * loading/error/data state and ignoring results that resolve after the
 * component has moved on to a newer request.
 *
 * @param {() => Promise<any>} fetcher
 * @param {any[]} deps
 */
export function useAsync(fetcher, deps) {
  const [state, setState] = useState({ data: null, loading: true, error: null })
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  useEffect(() => {
    let cancelled = false
    setState((s) => ({ ...s, loading: true, error: null }))

    fetcherRef
      .current()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null })
      })
      .catch((error) => {
        if (!cancelled) setState({ data: null, loading: false, error })
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return state
}
