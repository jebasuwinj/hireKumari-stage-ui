import { Link } from 'react-router-dom'
import './Faqs.css'

const FAQ_GROUPS = [
  {
    category: 'General',
    questions: [
      { q: 'What is the Kanniyakumari District Job Portal?', a: 'It is a free platform run as a District Administration Initiative to connect job seekers and employers across Kanniyakumari District in one place.' },
      { q: 'Is the portal free to use?', a: 'Yes. Creating a profile, browsing jobs, applying and registering for job fairs is completely free for job seekers. Posting jobs is also free for verified local employers.' },
      { q: 'Which areas does the portal cover?', a: 'Opportunities are limited to Kanniyakumari District, covering all 9 taluks.' },
    ],
  },
  {
    category: 'For Job Seekers',
    questions: [
      { q: 'Do I need to create an account to apply for a job?', a: 'Yes, you need a job seeker profile so employers can view your details and you can track your application status.' },
      { q: 'How do I know if my application was received?', a: 'You will see the application status update on your dashboard, and employers may contact you directly for shortlisted roles.' },
      { q: 'Can I apply to more than one job at a time?', a: 'Yes, there is no limit to the number of jobs you can apply to.' },
      { q: 'How do I get notified about new job fairs?', a: 'Visit the Job Fairs page and register your interest, or keep your profile notifications turned on.' },
    ],
  },
  {
    category: 'For Employers',
    questions: [
      { q: 'How do I register my company?', a: 'Click Register on the top navigation, choose the Employer option and fill in your company details for verification.' },
      { q: 'How long does employer verification take?', a: 'Verification is usually completed within 1-2 business days by the District Employment Office.' },
      { q: 'Can I edit a job after posting it?', a: 'Yes, go to My Jobs in your employer dashboard and use the edit option on any active listing.' },
      { q: 'Is there a limit to how many jobs I can post?', a: 'No, verified employers can post as many openings as they need.' },
    ],
  },
  {
    category: 'Account & Security',
    questions: [
      { q: 'I forgot my password. What do I do?', a: 'Use the Forgot Password link on the login page to reset it via your registered email or mobile number.' },
      { q: 'How do I report a suspicious job listing?', a: 'Email support@kkjobportal.gov.in with the job title and employer name, and our team will investigate promptly.' },
      { q: 'How is my personal information protected?', a: 'We only share your profile with employers you apply to. See our Privacy Policy for full details.' },
    ],
  },
]

function Faqs() {
  return (
    <>
      <div className="page-hero faqs-hero">
        <div className="container faqs-hero__inner">
          <span className="faqs-hero__eyebrow">
            <span aria-hidden="true">❓</span> FAQs
          </span>
          <h1>Frequently Asked <span>Questions</span></h1>
          <p>Answers to the questions we hear most often from job seekers and employers.</p>
        </div>
      </div>

      <section className="section">
        <div className="container faqs-layout">
          {FAQ_GROUPS.map((group) => (
            <div key={group.category} className="faqs-group">
              <h2>{group.category}</h2>
              <div className="faqs-list">
                {group.questions.map((item) => (
                  <details key={item.q} className="faqs-item">
                    <summary>{item.q}</summary>
                    <p>{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}

          <div className="faqs-more">
            <p>Can&apos;t find what you&apos;re looking for?</p>
            <Link to="/contact" className="btn btn-primary">Contact Support →</Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default Faqs
