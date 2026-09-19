import { useAsync } from './useAsync.js'
import { getOptions } from '../api/meta.js'

const FALLBACK = { taluks: [], jobTypes: [], experienceLevels: [] }

/** Taluks / job types / experience levels, sourced from the API so the UI
 * never has to hard-code them. */
export function useOptions() {
  const { data, loading, error } = useAsync(() => getOptions().then((r) => r.data), [])
  return { options: data ?? FALLBACK, loading, error }
}
