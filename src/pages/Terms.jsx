import LegalPageLayout from '../components/LegalPageLayout'

const SECTIONS = [
  {
    heading: 'Acceptance of Terms',
    paragraphs: [
      'By accessing or using the Kanniyakumari District Job Portal ("the Portal"), you agree to be bound by these Terms of Use. If you do not agree with any part of these terms, please do not use the Portal.',
    ],
  },
  {
    heading: 'Eligibility',
    paragraphs: [
      'The Portal is intended for job seekers and employers with a genuine connection to Kanniyakumari District. You must be at least 18 years old to register an account.',
    ],
  },
  {
    heading: 'User Accounts',
    paragraphs: [
      'You are responsible for maintaining the confidentiality of your login credentials and for all activity carried out under your account.',
    ],
    list: [
      'Provide accurate and current information when registering',
      'Notify us immediately of any unauthorized use of your account',
      'Employer accounts are subject to verification before job postings go live',
    ],
  },
  {
    heading: 'Job Postings & Content',
    paragraphs: [
      'Employers are solely responsible for the accuracy of job listings they post, including salary, location and eligibility details. The Portal reserves the right to remove any listing that is misleading, discriminatory or violates applicable labour laws.',
    ],
  },
  {
    heading: 'User Conduct',
    paragraphs: [
      'You agree not to misuse the Portal, including but not limited to posting false information, harassing other users, or attempting to gain unauthorized access to the platform.',
    ],
  },
  {
    heading: 'Intellectual Property',
    paragraphs: [
      'All content on the Portal, including logos, design and text, is the property of the District Administration and may not be reproduced without permission.',
    ],
  },
  {
    heading: 'Limitation of Liability',
    paragraphs: [
      'The Portal acts as a facilitator connecting job seekers and employers. We do not guarantee employment outcomes and are not liable for disputes arising between users of the platform.',
    ],
  },
  {
    heading: 'Termination',
    paragraphs: [
      'We reserve the right to suspend or terminate any account that violates these Terms of Use or engages in fraudulent activity.',
    ],
  },
  {
    heading: 'Changes to These Terms',
    paragraphs: [
      'These Terms may be updated from time to time. Continued use of the Portal after changes are posted constitutes acceptance of the revised terms.',
    ],
  },
  {
    heading: 'Contact Us',
    paragraphs: [
      'If you have questions about these Terms of Use, please reach out via the Contact page or email support@kkjobportal.gov.in.',
    ],
  },
]

function Terms() {
  return (
    <LegalPageLayout
      icon="📜"
      eyebrow="Legal"
      title={<>Terms of <span>Use</span></>}
      intro="Please read these terms carefully before using the Kanniyakumari District Job Portal."
      updated="September 17, 2026"
      sections={SECTIONS}
    />
  )
}

export default Terms
