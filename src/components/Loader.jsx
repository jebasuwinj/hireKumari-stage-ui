import './Loader.css'

/** Branded ring spinner used wherever the app is waiting on an API call. */
function Loader({ label = 'Loading…', size = 40, minHeight = 200 }) {
  return (
    <div className="loader" style={{ minHeight }}>
      <span className="loader__ring" style={{ width: size, height: size }} aria-hidden="true" />
      {label && <span className="loader__label">{label}</span>}
    </div>
  )
}

export default Loader
