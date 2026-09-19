import { useEffect, useState } from 'react'
import PageState from '../../components/PageState.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import { ListRowsSkeleton } from '../../components/skeletons'
import { useFeedback } from '../../hooks/useFeedback.jsx'
import { formatDate } from '../../utils/format.js'
import { listContactMessages, updateContactStatus } from '../../api/contact.js'
import './AdminApplications.css'

function SuperAdminMessages() {
  const [tab, setTab] = useState('new')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)
  const { toastSuccess, toastError, confirmAction } = useFeedback()

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    listContactMessages({ status: tab, limit: 100 })
      .then(({ data }) => {
        if (!cancelled) setMessages(data)
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
  }, [tab, reloadKey])

  const handleResolve = (msg) => {
    confirmAction({
      title: 'Mark this message as resolved?',
      description: `The message from ${msg.name} will be moved to the Resolved tab.`,
      okText: 'Mark Resolved',
      onConfirm: async () => {
        try {
          await updateContactStatus(msg.id, 'resolved')
          toastSuccess('Message resolved', `Marked the message from ${msg.name} as resolved.`)
          setReloadKey((k) => k + 1)
        } catch (err) {
          toastError(err, 'Could not update this message.')
          throw err
        }
      },
    })
  }

  return (
    <div className="admin-applications">
      <div className="admin-page-head">
        <div>
          <h1>Contact Messages</h1>
          <p>Messages submitted through the public Contact Us form</p>
        </div>
      </div>

      <div className="admin-applications__toolbar">
        <div className="admin-applications__tabs">
          <button type="button" className={tab === 'new' ? 'is-active' : ''} onClick={() => setTab('new')}>
            New
          </button>
          <button type="button" className={tab === 'resolved' ? 'is-active' : ''} onClick={() => setTab('resolved')}>
            Resolved
          </button>
        </div>
      </div>

      <PageState
        loading={loading}
        error={error}
        skeleton={<ListRowsSkeleton count={5} withActions={false} />}
      >
        {messages.length > 0 ? (
          <div className="admin-fairs-list">
            {messages.map((m) => (
              <div key={m.id} className="admin-fair-card">
                <span className="admin-fair-card__badge" style={{ background: '#2b8fd61f', color: '#2b8fd6' }}>
                  ✉️
                </span>
                <div className="admin-fair-card__main">
                  <strong>{m.name}</strong>
                  <p>📧 {m.email} {m.phone && `• 📞 ${m.phone}`}</p>
                  <p>{m.message}</p>
                  <p><small>{formatDate(m.createdAt, 'DD MMM YYYY, h:mm A')}</small></p>
                </div>
                <div className="admin-fair-card__actions">
                  {tab === 'new' && (
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => handleResolve(m)}>
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon="✉️"
            title={`No ${tab} messages`}
            description={tab === 'new' ? "You're all caught up — new contact messages will show up here." : 'Resolved messages will appear here.'}
          />
        )}
      </PageState>
    </div>
  )
}

export default SuperAdminMessages
