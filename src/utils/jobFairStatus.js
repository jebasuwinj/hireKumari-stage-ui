/** Display metadata for a job fair's derived status (see api's jobFair.service.ts). */
const JOB_FAIR_STATUS_META = {
  upcoming: { label: 'Upcoming', labelKey: 'jobFairStatus.upcoming', color: '#0454c2' },
  active: { label: 'Active', labelKey: 'jobFairStatus.active', color: '#1f9d55' },
  completed: { label: 'Completed', labelKey: 'jobFairStatus.completed', color: '#6b7280' },
  cancelled: { label: 'Cancelled', labelKey: 'jobFairStatus.cancelled', color: '#e0435c' },
}

/**
 * @param {string} status
 * @returns {{ label: string, labelKey: string, color: string }} `label` is the
 *   English fallback (used by the English-only admin panel); public pages
 *   should translate `labelKey` via useLanguage()'s `t()` instead.
 */
export function jobFairStatusMeta(status) {
  return JOB_FAIR_STATUS_META[status] ?? JOB_FAIR_STATUS_META.upcoming
}
