import { useAsync } from './useAsync.js'
import { getStats } from '../api/meta.js'

const FALLBACK = { jobs: 0, seekers: 0, companies: 0, jobFairs: 0 }

export function useStats() {
  const { data, loading, error } = useAsync(() => getStats().then((r) => r.data), [])
  return { stats: data ?? FALLBACK, loading, error }
}
