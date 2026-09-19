import { useAsync } from './useAsync.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import { listCategories } from '../api/categories.js'

const SECTOR_ICONS_FALLBACK = 'dots'

function isItCategory(name = '') {
  return /^(IT\b|IT\s*\/\s*ITES|Information Technology)$/i.test(String(name).trim())
}

/** Put IT / Information Technology first, keep remaining order stable. */
export function prioritizeItCategory(categories = []) {
  const list = [...categories]
  const itIndex = list.findIndex((c) => isItCategory(c.name))
  if (itIndex <= 0) return list
  const [it] = list.splice(itIndex, 1)
  return [it, ...list]
}

/** Public sector list (with live job counts), used by search filters, the
 * register form and the post-job form.
 *
 * `name` stays the canonical English value (used for filter/query params and
 * as a stable key); `displayName` is what should be rendered — the Tamil
 * name when Tamil is selected and one was set, falling back to `name`.
 */
export function useCategories() {
  const { data, loading, error } = useAsync(() => listCategories().then((r) => r.data), [])
  const { lang } = useLanguage()
  const categories = prioritizeItCategory(data ?? []).map((c) => ({
    ...c,
    displayName: lang === 'ta' && c.nameTa ? c.nameTa : c.name,
  }))
  return { categories, loading, error }
}

export function categoryIcon(icon) {
  return icon || SECTOR_ICONS_FALLBACK
}
