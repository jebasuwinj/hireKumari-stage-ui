import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime.js'

dayjs.extend(relativeTime)

/** "2 days ago", "Today", ... — mirrors the wording the API's `posted` field uses. */
export function timeAgo(date) {
  if (!date) return ''
  const d = dayjs(date)
  if (dayjs().isSame(d, 'day')) return 'Today'
  return d.fromNow()
}

export function formatDate(date, pattern = 'DD MMM YYYY') {
  return date ? dayjs(date).format(pattern) : ''
}
