import './ChartCard.css'

/** Consistent title + card wrapper for every dashboard chart. */
function ChartCard({ title, subtitle, children, span = 1 }) {
  return (
    <div className="chart-card" style={{ '--chart-card-span': span }}>
      <div className="chart-card__head">
        <h3>{title}</h3>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="chart-card__body">{children}</div>
    </div>
  )
}

export default ChartCard
