import Loader from './Loader.jsx'
import EmptyState from './EmptyState.jsx'

/**
 * Consistent loading / error wrapper used across API-backed pages.
 * Pass `skeleton` to show a layout-matching placeholder instead of the spinner.
 */
function PageState({ loading, error, children, minHeight = 200, loadingLabel, skeleton }) {
  if (loading) {
    if (skeleton) return skeleton
    return <Loader minHeight={minHeight} label={loadingLabel} />
  }

  if (error) {
    return (
      <EmptyState
        icon="⚠️"
        title="Something went wrong"
        description={error.message || "We couldn't load this right now. Please try again."}
      />
    )
  }

  return children
}

export default PageState
