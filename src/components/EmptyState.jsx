import './EmptyState.css'

/**
 * Consistent "nothing here" panel used across public, company and super-admin
 * screens wherever a list/table has no rows to show.
 *
 * @param {string} [icon] emoji shown in the accent circle
 * @param {string} title
 * @param {string} [description]
 * @param {React.ReactNode} [action] e.g. a "+ Post Your First Job" button
 */
function EmptyState({ icon = '🗂️', title, description, action }) {
  return (
    <div className="empty-state empty-state--panel">
      <span className="empty-state__icon" aria-hidden="true">{icon}</span>
      <h3 className="empty-state__title">{title}</h3>
      {description && <p className="empty-state__desc">{description}</p>}
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  )
}

export default EmptyState
