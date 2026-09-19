import LegalPageLayout from '../components/LegalPageLayout'

const SECTIONS = [
  {
    heading: 'Information We Collect',
    paragraphs: [
      'We collect information you provide directly, such as your name, contact details, resume, work experience and company information, as well as basic usage data like pages visited and searches performed.',
    ],
  },
  {
    heading: 'How We Use Your Information',
    paragraphs: [
      'Your information is used to operate the Portal and connect you with relevant opportunities or candidates.',
    ],
    list: [
      'Matching job seekers with suitable job listings',
      'Sharing your application details with employers you apply to',
      'Sending notifications about job fairs, applications and account activity',
      'Improving the Portal based on how it is used',
    ],
  },
  {
    heading: 'Information Sharing',
    paragraphs: [
      'We do not sell your personal information. Job seeker profile and application details are shared only with the employers you apply to, or as required by the District Administration for verification purposes.',
    ],
  },
  {
    heading: 'Data Security',
    paragraphs: [
      'We take reasonable technical and organizational measures to protect your data from unauthorized access, alteration or disclosure. However, no method of transmission over the internet is completely secure.',
    ],
  },
  {
    heading: 'Cookies',
    paragraphs: [
      'The Portal may use cookies to remember your preferences and keep you signed in. You can disable cookies in your browser settings, though some features may not work as intended.',
    ],
  },
  {
    heading: 'Your Rights & Choices',
    paragraphs: [
      'You can access, update or delete your profile information at any time from your account settings. You may also unsubscribe from notification emails.',
    ],
  },
  {
    heading: "Children's Privacy",
    paragraphs: [
      'The Portal is not intended for individuals under the age of 18, and we do not knowingly collect information from minors.',
    ],
  },
  {
    heading: 'Changes to This Policy',
    paragraphs: [
      'We may update this Privacy Policy periodically. Any changes will be posted on this page with a revised "last updated" date.',
    ],
  },
  {
    heading: 'Contact Us',
    paragraphs: [
      'For any privacy-related questions or requests, please contact us via the Contact page or email support@kkjobportal.gov.in.',
    ],
  },
]

function Privacy() {
  return (
    <LegalPageLayout
      icon="🔒"
      eyebrow="Legal"
      title={<>Privacy <span>Policy</span></>}
      intro="How the Kanniyakumari District Job Portal collects, uses and protects your information."
      updated="September 17, 2026"
      sections={SECTIONS}
    />
  )
}

export default Privacy
