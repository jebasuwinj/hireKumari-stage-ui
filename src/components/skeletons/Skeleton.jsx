import './Skeleton.css'

/** Base shimmer block. Use width/height as CSS lengths or leave fluid. */
function Skeleton({ className = '', width, height, radius, circle = false, style, ...rest }) {
  return (
    <span
      className={`sk ${circle ? 'sk--circle' : ''} ${className}`.trim()}
      style={{
        width: width ?? undefined,
        height: height ?? undefined,
        borderRadius: circle ? undefined : radius,
        ...style,
      }}
      aria-hidden="true"
      {...rest}
    />
  )
}

export default Skeleton
