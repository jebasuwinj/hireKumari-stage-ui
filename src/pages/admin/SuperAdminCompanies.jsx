import { useEffect, useState } from 'react'
import { Input, Switch } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import PageState from '../../components/PageState.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import { TableSkeleton } from '../../components/skeletons'
import { useFeedback } from '../../hooks/useFeedback.jsx'
import { formatDate } from '../../utils/format.js'
import { deleteCompanyForAdmin, listCompaniesForAdmin, updateCompanyStatus } from '../../api/companies.js'
import '../admin/AdminApplications.css'
import './SuperAdminCompanies.css'

const STATUS_TABS = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'disabled' },
]

function SuperAdminCompanies() {
  const [query, setQuery] = useState('')
  const [statusTab, setStatusTab] = useState('active')
  const [companies, setCompanies] = useState([])
  const [counts, setCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)
  const { toastSuccess, toastError, confirmAction } = useFeedback()

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    const timer = setTimeout(() => {
      listCompaniesForAdmin({ q: query || undefined, status: statusTab, limit: 100 })
        .then(({ data, meta }) => {
          if (cancelled) return
          setCompanies(data)
          setCounts(meta?.counts ?? {})
        })
        .catch((err) => {
          if (!cancelled) setError(err)
        })
        .finally(() => {
          if (!cancelled) setLoading(false)
        })
    }, 300)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [query, statusTab, reloadKey])

  const handleToggleStatus = (company) => {
    const nextStatus = company.status === 'active' ? 'disabled' : 'active'
    const verb = nextStatus === 'active' ? 'Enable' : 'Disable'
    confirmAction({
      title: `${verb} ${company.name}?`,
      description:
        nextStatus === 'disabled'
          ? 'This company will no longer be able to log in, and its jobs stay as they are but the account is locked.'
          : 'This company will be able to log in and manage their jobs again.',
      okText: verb,
      danger: nextStatus === 'disabled',
      onConfirm: async () => {
        try {
          await updateCompanyStatus(company.id, nextStatus)
          toastSuccess('Company updated', `${company.name} has been ${nextStatus === 'active' ? 'enabled' : 'disabled'}.`)
          setReloadKey((k) => k + 1)
        } catch (err) {
          toastError(err, 'Could not update this company.')
          throw err
        }
      },
    })
  }

  const handleDelete = (company) => {
    confirmAction({
      title: `Delete ${company.name}?`,
      description: 'This company will be removed from the portal. It will no longer be able to log in, and its listing will disappear from the directory.',
      okText: 'Delete',
      danger: true,
      onConfirm: async () => {
        try {
          await deleteCompanyForAdmin(company.id)
          toastSuccess('Company deleted', `${company.name} has been removed.`)
          setReloadKey((k) => k + 1)
        } catch (err) {
          toastError(err, 'Could not delete this company.')
          throw err
        }
      },
    })
  }

  return (
    <div className="admin-applications">
      <div className="admin-page-head">
        <div>
          <h1>Companies</h1>
          <p>{companies.length} compan{companies.length === 1 ? 'y' : 'ies'} registered on the portal</p>
        </div>
      </div>

      <div className="super-admin-companies__toolbar">
        <div className="super-admin-companies__tabs" role="tablist" aria-label="Filter companies by status">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={statusTab === tab.value}
              className={statusTab === tab.value ? 'is-active' : ''}
              onClick={() => setStatusTab(tab.value)}
            >
              {tab.label}
              <span className="super-admin-companies__tab-count">{counts[tab.value] ?? 0}</span>
            </button>
          ))}
        </div>
        <Input
          className="super-admin-companies__search"
          size="large"
          allowClear
          prefix={<SearchOutlined />}
          placeholder="Search companies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <PageState
        loading={loading}
        error={error}
        skeleton={<TableSkeleton rows={8} compact />}
      >
        {companies.length > 0 ? (
          <div className="admin-applications-table-wrap">
            <table className="admin-applications-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Contact</th>
                  <th>Jobs Posted</th>
                  <th>Registered</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="admin-applications-table__candidate">
                        <span className="admin-table__avatar" aria-hidden="true">
                          {c.logoUrl ? <img src={c.logoUrl} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /> : c.name.charAt(0)}
                        </span>
                        <div>
                          <strong>{c.name}</strong>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>{c.email}</div>
                      <small>{c.phone}</small>
                    </td>
                    <td>{c.jobCount}</td>
                    <td>{formatDate(c.createdAt)}</td>
                    <td>
                      <span
                        className="tag"
                        style={{
                          background: c.status === 'active' ? '#1f9d551f' : '#e0435c1f',
                          color: c.status === 'active' ? '#1f9d55' : '#e0435c',
                        }}
                      >
                        {c.status === 'active' ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td>
                      <div className="super-admin-companies__actions">
                        <Switch
                          checked={c.status === 'active'}
                          onChange={() => handleToggleStatus(c)}
                          aria-label={c.status === 'active' ? `Disable ${c.name}` : `Enable ${c.name}`}
                        />
                        <button
                          type="button"
                          className="admin-icon-delete"
                          onClick={() => handleDelete(c)}
                          aria-label={`Delete ${c.name}`}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon="🏢"
            title={query ? `No companies match "${query}"` : `No ${statusTab === 'all' ? '' : statusTab === 'active' ? 'active ' : 'inactive '}companies yet`}
            description={query ? 'Try a different search term.' : 'Companies will appear here once they register on the portal.'}
          />
        )}
      </PageState>
    </div>
  )
}

export default SuperAdminCompanies
