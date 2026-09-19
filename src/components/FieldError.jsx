import './FieldError.css'

/** Small inline error message rendered directly under a form field. */
function FieldError({ children }) {
  if (!children) return null
  return <small className="field-error">{children}</small>
}

export default FieldError
