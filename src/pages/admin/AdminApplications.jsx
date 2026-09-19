import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DatePicker } from 'antd'
import dayjs from 'dayjs'
import PageState from '../../components/PageState.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import { TableSkeleton } from '../../components/skeletons'
import { useFeedback } from '../../hooks/useFeedback.jsx'
import {
  exportMyApplications,
  getResumeLink,
  listMyApplications,
  updateApplicationStatus,
} from '../../api/applications.js'
import './AdminApplications.css'

const { RangePicker } = DatePicker

const STATUS_COLORS = {
  new: '#0454c2',
  placed: '#0b6b3a',
}

const STATUS_LABELS = {
  new: 'New',
  placed: 'Placed',
}

function AdminApplications() {
  const [searchParams, setSearchParams] = useSearchParams()
  const jobId = searchParams.get('jobId') || undefined
  const [tab, setTab] = useState('applied')
  const [dateRange, setDateRange] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [result, setResult] = useState({ items: [], meta: { total: 0 } })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [exporting, setExporting] = useState(false)
  const { toastSuccess, toastError, confirmAction } = useFeedback()

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    listMyApplications({
      tab,
      jobId,
      from: dateRange?.[0]?.format('YYYY-MM-DD'),
      to: dateRange?.[1]?.format('YYYY-MM-DD'),
      page: 1,
      limit: 100,
    })
      .then(({ data, meta }) => {
        if (!cancelled) setResult({ items: data, meta })
      })
      .catch((err) => {
        if (!cancelled) setError(err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [tab, jobId, dateRange, reloadKey])

  const reload = () => setReloadKey((k) => k + 1)

  const handleMarkPlaced = (application) => {
    confirmAction({
      title: `Mark ${application.name} as placed?`,
      description: 'This confirms the candidate has been hired for this role.',
      okText: 'Mark as Placed',
      onConfirm: async () => {
        try {
          await updateApplicationStatus(application.id, 'placed')
          toastSuccess('Application updated', `${application.name} has been marked as placed.`)
          reload()
        } catch (err) {
          toastError(err, 'Could not update this application.')
          throw err
        }
      },
    })
  }

  const handleViewResume = async (id) => {
    try {
      const { data } = await getResumeLink(id)
      window.open(data.url, '_blank', 'noopener')
    } catch (err) {
      toastError(err, 'Could not open the resume.')
    }
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const { blob, filename } = await exportMyApplications({
        tab,
        jobId,
        from: dateRange?.[0]?.format('YYYY-MM-DD'),
        to: dateRange?.[1]?.format('YYYY-MM-DD'),
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      toastSuccess('Export ready', `${filename} has started downloading.`)
    } catch (err) {
      toastError(err, 'Could not export applications.')
    } finally {
      setExporting(false)
    }
  }

  const clearJobFilter = () => {
    const params = new URLSearchParams(searchParams)
    params.delete('jobId')
    setSearchParams(params)
  }

  const filtered = result.items

  return (
    <div className="admin-applications">
      <div className="admin-page-head">
        <div>
          <h1>Applications</h1>
          <p>{result.meta.total ?? filtered.length} candidate{(result.meta.total ?? filtered.length) === 1 ? '' : 's'} match your filters</p>
        </div>
        <button type="button" className="btn btn-outline" onClick={handleExport} disabled={filtered.length === 0 || exporting}>
          {exporting ? 'Exporting…' : '⬇ Export CSV'}
        </button>
      </div>

      {jobId && (
        <div style={{ marginBottom: 16 }}>
          <span className="tag tag--muted" style={{ cursor: 'pointer' }} onClick={clearJobFilter}>
            Filtered by job ✕
          </span>
        </div>
      )}

      <div className="admin-applications__toolbar">
        <div className="admin-applications__tabs">
          <button
            type="button"
            className={tab === 'applied' ? 'is-active' : ''}
            onClick={() => setTab('applied')}
          >
            Applied
          </button>
          <button
            type="button"
            className={tab === 'placed' ? 'is-active' : ''}
            onClick={() => setTab('placed')}
          >
            Placed
          </button>
        </div>

        <RangePicker
          size="large"
          value={dateRange}
          onChange={setDateRange}
          format="DD MMM YYYY"
          allowClear
        />
      </div>

      <PageState
        loading={loading}
        error={error}
        skeleton={<TableSkeleton rows={6} />}
      >
        {filtered.length > 0 ? (
          <div className="admin-applications-table-wrap">
            <table className="admin-applications-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Job Applied</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <div className="admin-applications-table__candidate">
                        <span className="admin-table__avatar" aria-hidden="true">{a.name.charAt(0)}</span>
                        <div>
                          <strong>{a.name}</strong>
                          <small>{a.email}</small>
                        </div>
                      </div>
                    </td>
                    <td>{a.jobTitle}</td>
                    <td>{dayjs(a.appliedDate).format('DD MMM YYYY')}</td>
                    <td>
                      <span
                        className="tag"
                        style={{
                          background: `${STATUS_COLORS[a.status] ?? '#6b7280'}1f`,
                          color: STATUS_COLORS[a.status] ?? '#6b7280',
                        }}
                      >
                        {STATUS_LABELS[a.status] ?? a.status}
                      </span>
                    </td>
                    <td>
                      <div className="admin-applications-table__actions">
                        <button type="button" className="btn btn-outline btn-sm" onClick={() => handleViewResume(a.id)}>View Resume</button>
                        {a.status !== 'placed' && (
                          <button type="button" className="btn btn-primary btn-sm" onClick={() => handleMarkPlaced(a)}>
                            Mark as Placed
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon="📄"
            title={`No ${tab} candidates`}
            description={dateRange ? 'No results in this date range. Try widening it.' : 'Applications will appear here once candidates apply to your jobs.'}
          />
        )}
      </PageState>
    </div>
  )
}

export default AdminApplications
