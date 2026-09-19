import { Link } from 'react-router-dom'
import './HelpCentre.css'

const HELP_TOPICS = [
  {
    icon: '🧑‍💼',
    color: '#0454c2',
    title: 'For Job Seekers',
    items: [
      'Creating and updating your profile',
      'Searching and filtering job listings',
      'Applying to a job and tracking your status',
      'Setting up job fair and alert notifications',
    ],
  },
  {
    icon: '🏢',
    color: '#2b8fd6',
    title: 'For Employers',
    items: [
      'Registering your company on the portal',
      'Posting a new job opening',
      'Reviewing and managing applicants',
      'Editing or closing a job posting',
    ],
  },
  {
    icon: '🔐',
    color: '#f2a12b',
    title: 'Account & Login',
    items: [
      'Resetting a forgotten password',
      'Updating your registered email or phone number',
      'Why is my account under verification?',
      'Deleting your account',
    ],
  },
  {
    icon: '📅',
    color: '#9b4fd6',
    title: 'Job Fairs & Events',
    items: [
      'Registering for an upcoming job fair',
      'What to bring to a walk-in interview',
      'Rescheduling or cancelling your registration',
      'Getting notified about new events near you',
    ],
  },
]

function HelpCentre() {
  return (
    <>
      <div className="page-hero help-hero">
        <div className="container help-hero__inner">
          <span className="help-hero__eyebrow">
            <span aria-hidden="true">🛟</span> Support
          </span>
          <h1>Help <span>Centre</span></h1>
          <p>Find quick answers about using the portal, or reach out to our support team directly.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Browse by Topic</h2>
              <p>Common questions grouped by what you&apos;re trying to do</p>
            </div>
          </div>

          <div className="help-topics-grid">
            {HELP_TOPICS.map((topic) => (
              <div key={topic.title} className="help-topic-card">
                <span className="help-topic-card__icon" style={{ background: `${topic.color}1f`, color: topic.color }}>
                  {topic.icon}
                </span>
                <h3>{topic.title}</h3>
                <ul>
                  {topic.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="help-cta">
            <div>
              <h3>Still need help?</h3>
              <p>Our support team is available Monday to Saturday, 10 AM - 5 PM.</p>
            </div>
            <div className="help-cta__actions">
              <Link to="/contact" className="btn btn-primary">Contact Support →</Link>
              <Link to="/faqs" className="btn btn-outline">View All FAQs</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default HelpCentre
