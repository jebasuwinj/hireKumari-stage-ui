import './LegalPageLayout.css'

function LegalPageLayout({ icon, eyebrow, title, intro, updated, sections }) {
  return (
    <>
      <div className="page-hero legal-hero">
        <div className="container legal-hero__inner">
          <span className="legal-hero__eyebrow">
            <span aria-hidden="true">{icon}</span> {eyebrow}
          </span>
          <h1>{title}</h1>
          {intro && <p>{intro}</p>}
        </div>
      </div>

      <section className="section">
        <div className="container legal-layout">
          <p className="legal-updated">Last updated: {updated}</p>

          {sections.map((section, i) => (
            <div key={section.heading} className="legal-section">
              <h2>{i + 1}. {section.heading}</h2>
              {section.paragraphs.map((para) => (
                <p key={para}>{para}</p>
              ))}
              {section.list && (
                <ul>
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default LegalPageLayout
