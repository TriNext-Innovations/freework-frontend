export interface LegalSection {
  id: string;
  heading: string;
  content: string;
  callout?: string;
  calloutType?: 'warning' | 'info';
}

export interface LegalDocument {
  title: string;
  version: string;
  effectiveDate: string;
  lastUpdated: string;
  sections: LegalSection[];
}

export const LEGAL_CONTENT: {
  en: Record<string, LegalDocument>;
  af: Record<string, LegalDocument>;
} = {
  en: {
    'privacy-policy': {
      title: 'Privacy Policy',
      version: '1.0',
      effectiveDate: '1 January 2025',
      lastUpdated: '1 January 2025',
      sections: [
        {
          id: 'introduction',
          heading: '1. Introduction',
          content: `<p>Freework (Pty) Ltd ("Freework", "we", "us" or "our") is committed to protecting your personal information in accordance with the Protection of Personal Information Act 4 of 2013 ("POPIA") and all applicable South African privacy legislation.</p>
<p>This Privacy Policy explains how we collect, use, store, share and protect your personal information when you use the Freework platform, including our website at freework.co.za and our mobile application (collectively, the "Platform").</p>
<p>By registering on or using the Platform, you confirm that you have read, understood and agree to the collection and use of your personal information as described in this policy.</p>`
        },
        {
          id: 'who-we-are',
          heading: '2. Who We Are',
          content: `<p><strong>Responsible Party (as defined under POPIA):</strong></p>
<ul>
  <li><strong>Name:</strong> Freework (Pty) Ltd</li>
  <li><strong>Registration Number:</strong> [To be inserted upon incorporation]</li>
  <li><strong>Address:</strong> South Africa</li>
  <li><strong>Email:</strong> privacy@freework.co.za</li>
  <li><strong>Information Officer:</strong> [Name to be designated]</li>
</ul>
<p>We are registered with the Information Regulator of South Africa as required by POPIA.</p>`
        },
        {
          id: 'information-we-collect',
          heading: '3. Information We Collect',
          content: `<p>We collect the following categories of personal information:</p>
<h4>3.1 Information You Provide Directly</h4>
<ul>
  <li><strong>Identity information:</strong> Full name, username, profile picture</li>
  <li><strong>Contact information:</strong> Email address, phone number, physical location</li>
  <li><strong>Professional information:</strong> Job title, skills, work history, education, portfolio items</li>
  <li><strong>Financial information:</strong> Payment details processed through PayFast (we do not store raw card details)</li>
  <li><strong>Communications:</strong> Messages exchanged through the Platform's messaging system</li>
  <li><strong>Account credentials:</strong> Hashed password (we never store plaintext passwords)</li>
</ul>
<h4>3.2 Information Collected Automatically</h4>
<ul>
  <li><strong>Usage data:</strong> Pages visited, features used, search queries, clicks and interactions</li>
  <li><strong>Device information:</strong> IP address, browser type, operating system, device identifiers</li>
  <li><strong>Log data:</strong> Server logs, error reports, timestamps of actions</li>
  <li><strong>Cookie data:</strong> As described in our Cookie Policy</li>
</ul>
<h4>3.3 Information From Third Parties</h4>
<ul>
  <li>Payment verification data from PayFast</li>
  <li>Publicly available professional information (LinkedIn, GitHub) if you link these accounts</li>
</ul>`
        },
        {
          id: 'how-we-use',
          heading: '4. How We Use Your Information',
          content: `<p>We use your personal information for the following purposes:</p>
<ul>
  <li><strong>Platform operation:</strong> Creating and managing your account, enabling you to post or apply for jobs, facilitating payments and communications between users</li>
  <li><strong>Service improvement:</strong> Analysing usage patterns to improve platform features and performance</li>
  <li><strong>Security and fraud prevention:</strong> Detecting and preventing fraudulent activity, protecting users and the platform</li>
  <li><strong>Legal compliance:</strong> Meeting our obligations under POPIA, tax law, and other applicable legislation</li>
  <li><strong>Communications:</strong> Sending transactional emails (payment confirmations, security alerts, account notifications) and, where you have consented, marketing communications</li>
  <li><strong>Dispute resolution:</strong> Resolving disputes between freelancers and businesses on the platform</li>
  <li><strong>Rating and review system:</strong> Enabling users to leave and receive reviews</li>
</ul>`
        },
        {
          id: 'legal-basis',
          heading: '5. Legal Basis for Processing',
          content: `<p>Under POPIA, we process your personal information on the following lawful grounds:</p>
<ul>
  <li><strong>Contract performance:</strong> Processing necessary to provide the Platform services you have requested</li>
  <li><strong>Legitimate interests:</strong> Platform security, fraud prevention, and service improvement</li>
  <li><strong>Legal obligation:</strong> Compliance with South African law, including tax and financial reporting requirements</li>
  <li><strong>Consent:</strong> Marketing communications and non-essential cookies (you may withdraw consent at any time)</li>
  <li><strong>Public interest:</strong> Where applicable under Section 11(1)(e) of POPIA</li>
</ul>`
        },
        {
          id: 'sharing',
          heading: '6. Sharing of Your Information',
          content: `<p>We share your personal information only where necessary:</p>
<ul>
  <li><strong>With other users:</strong> Your profile information (name, skills, ratings, portfolio) is visible to other registered users as part of the Platform's core functionality</li>
  <li><strong>With PayFast:</strong> Payment information is shared with PayFast (Pty) Ltd, our payment processor, to process transactions. PayFast is subject to its own privacy policy.</li>
  <li><strong>With service providers:</strong> Trusted third-party service providers who assist us in operating the Platform (email delivery, cloud hosting, analytics), subject to contractual data processing agreements</li>
  <li><strong>For legal compliance:</strong> Where required by law, court order, or to protect the rights and safety of users</li>
  <li><strong>Business transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction</li>
</ul>
<p>We do not sell your personal information to third parties.</p>`
        },
        {
          id: 'cross-border',
          heading: '7. Cross-Border Transfers',
          content: `<p>Some of our service providers may be located outside South Africa. Where we transfer personal information outside South Africa, we ensure that adequate protections are in place as required by Section 72 of POPIA, including:</p>
<ul>
  <li>Binding contractual clauses equivalent to South African data protection standards</li>
  <li>Transfers only to countries with adequate data protection laws</li>
  <li>Your consent where required</li>
</ul>`
        },
        {
          id: 'data-retention',
          heading: '8. Data Retention',
          content: `<p>We retain your personal information for as long as necessary to provide the Platform services and comply with our legal obligations:</p>
<ul>
  <li><strong>Account data:</strong> Retained for the duration of your account and for 3 years after account deletion</li>
  <li><strong>Financial records:</strong> Retained for 5 years as required by South African tax legislation</li>
  <li><strong>Messages:</strong> Retained for 2 years after the last interaction</li>
  <li><strong>Consent records:</strong> Retained indefinitely as proof of consent</li>
  <li><strong>Anonymised data:</strong> May be retained indefinitely for analytics purposes</li>
</ul>
<p>When you delete your account, we anonymise your personal data. We do not permanently delete records that are required for legal or financial compliance.</p>`
        },
        {
          id: 'your-rights',
          heading: '9. Your Rights Under POPIA',
          content: `<p>As a data subject under POPIA, you have the following rights:</p>
<ul>
  <li><strong>Right to access:</strong> Request a copy of the personal information we hold about you</li>
  <li><strong>Right to correction:</strong> Request correction of inaccurate or incomplete personal information</li>
  <li><strong>Right to deletion:</strong> Request deletion of your personal information (subject to legal retention requirements)</li>
  <li><strong>Right to object:</strong> Object to the processing of your personal information for direct marketing</li>
  <li><strong>Right to data portability:</strong> Request your data in a structured, machine-readable format</li>
  <li><strong>Right to withdraw consent:</strong> Withdraw consent at any time where processing is based on consent</li>
  <li><strong>Right to lodge a complaint:</strong> Lodge a complaint with the Information Regulator of South Africa</li>
</ul>
<p>To exercise any of these rights, submit a request at <strong>/legal/popia-request</strong> or email us at <a href="mailto:privacy@freework.co.za">privacy@freework.co.za</a>.</p>`,
          callout: 'Information Regulator of South Africa: Email: inforeg@justice.gov.za | Phone: 010 023 5207 | Website: www.justice.gov.za/inforeg/',
          calloutType: 'info'
        },
        {
          id: 'security',
          heading: '10. Security of Your Information',
          content: `<p>We implement appropriate technical and organisational security measures to protect your personal information from unauthorised access, disclosure, alteration, or destruction, including:</p>
<ul>
  <li>TLS/HTTPS encryption for all data in transit</li>
  <li>BCrypt password hashing — we never store plaintext passwords</li>
  <li>JWT-based stateless authentication</li>
  <li>Role-based access controls</li>
  <li>Regular security reviews</li>
  <li>Audit logging of all significant data access events</li>
</ul>
<p>No method of transmission over the internet is 100% secure. While we take all reasonable precautions, we cannot guarantee absolute security.</p>`
        },
        {
          id: 'childrens-privacy',
          heading: "11. Children's Privacy",
          content: `<p>The Freework Platform is not intended for use by persons under the age of 18. We do not knowingly collect personal information from minors. If you believe a minor has provided us with personal information, please contact us at privacy@freework.co.za and we will delete it promptly.</p>`
        },
        {
          id: 'cookie-policy-summary',
          heading: '12. Cookie Policy',
          content: `<p>We use cookies and similar tracking technologies on the Platform. Please see our <a routerLink="/legal/cookie-policy">Cookie Policy</a> for full details. You can manage your cookie preferences at any time using the cookie settings banner.</p>`
        },
        {
          id: 'changes',
          heading: '13. Changes to This Policy',
          content: `<p>We may update this Privacy Policy from time to time. When we make material changes, we will notify you by email and display a notice on the Platform. Continued use of the Platform after the effective date of an updated policy constitutes your acceptance of the changes.</p>
<p>The current version and effective date are displayed at the top of this document.</p>`
        },
        {
          id: 'contact',
          heading: '14. Contact Us',
          content: `<p>For any privacy-related queries, requests, or complaints, please contact our Information Officer:</p>
<ul>
  <li><strong>Email:</strong> <a href="mailto:privacy@freework.co.za">privacy@freework.co.za</a></li>
  <li><strong>POPIA Data Request:</strong> <a routerLink="/legal/popia-request">Submit a formal request</a></li>
  <li><strong>Postal Address:</strong> Freework (Pty) Ltd, South Africa</li>
</ul>
<p>We will respond to all requests within 30 days as required by POPIA.</p>`
        }
      ]
    },

    'cookie-policy': {
      title: 'Cookie Policy',
      version: '1.0',
      effectiveDate: '1 January 2025',
      lastUpdated: '1 January 2025',
      sections: [
        {
          id: 'introduction',
          heading: '1. Introduction',
          content: `<p>This Cookie Policy explains how Freework (Pty) Ltd ("Freework", "we", "us") uses cookies and similar tracking technologies on the Freework platform (freework.co.za). This policy forms part of our <a routerLink="/legal/privacy-policy">Privacy Policy</a>.</p>
<p>By using our Platform, you consent to the use of essential cookies. For non-essential cookies (analytics, functional, marketing), we will ask for your specific consent through our cookie consent banner.</p>`
        },
        {
          id: 'what-are-cookies',
          heading: '2. What Are Cookies?',
          content: `<p>Cookies are small text files placed on your device when you visit a website. They help websites remember information about your visit, which can make it easier to visit the site again and make the site more useful to you.</p>
<p>We also use similar technologies including:</p>
<ul>
  <li><strong>Local Storage:</strong> Browser-side storage for session data and preferences</li>
  <li><strong>Session Storage:</strong> Temporary storage cleared when you close your browser tab</li>
  <li><strong>Pixels/Web Beacons:</strong> Tiny images used to track email open rates and page visits</li>
</ul>`
        },
        {
          id: 'why-we-use',
          heading: '3. Why We Use Cookies',
          content: `<p>We use cookies to:</p>
<ul>
  <li>Keep you logged in securely across page navigations</li>
  <li>Remember your preferences (theme, language)</li>
  <li>Protect you against CSRF (cross-site request forgery) attacks</li>
  <li>Analyse how users interact with our Platform to improve it</li>
  <li>Measure the effectiveness of our marketing campaigns</li>
  <li>Provide relevant content and recommendations</li>
</ul>`
        },
        {
          id: 'types-of-cookies',
          heading: '4. Types of Cookies We Use',
          content: `<table class="cookie-table">
  <thead>
    <tr><th>Category</th><th>Description</th><th>Legal Basis</th><th>Consent Required</th></tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Essential</strong></td>
      <td>Required for the Platform to function. Includes authentication tokens, security cookies, and session management.</td>
      <td>Legitimate interest / Contract</td>
      <td>No — always active</td>
    </tr>
    <tr>
      <td><strong>Functional</strong></td>
      <td>Enhance your experience by remembering preferences such as theme (light/dark) and language.</td>
      <td>Consent</td>
      <td>Yes</td>
    </tr>
    <tr>
      <td><strong>Analytics</strong></td>
      <td>Help us understand how users use the Platform. We use Google Analytics to collect anonymised usage statistics.</td>
      <td>Consent</td>
      <td>Yes</td>
    </tr>
    <tr>
      <td><strong>Performance</strong></td>
      <td>Monitor platform speed and uptime. Used for error tracking and performance optimisation.</td>
      <td>Consent</td>
      <td>Yes</td>
    </tr>
    <tr>
      <td><strong>Marketing</strong></td>
      <td>Used to deliver targeted communications and measure campaign effectiveness.</td>
      <td>Consent</td>
      <td>Yes</td>
    </tr>
  </tbody>
</table>`
        },
        {
          id: 'specific-cookies',
          heading: '5. Specific Cookies We Use',
          content: `<table class="cookie-table">
  <thead>
    <tr><th>Cookie Name</th><th>Category</th><th>Purpose</th><th>Duration</th></tr>
  </thead>
  <tbody>
    <tr><td>fw_session</td><td>Essential</td><td>User session management</td><td>Session</td></tr>
    <tr><td>fw_csrf</td><td>Essential</td><td>CSRF protection token</td><td>Session</td></tr>
    <tr><td>fw_auth</td><td>Essential</td><td>JWT authentication token (stored in memory/localStorage)</td><td>7 days</td></tr>
    <tr><td>fw_cookieconsent</td><td>Essential</td><td>Stores your cookie consent preferences</td><td>12 months</td></tr>
    <tr><td>_ga</td><td>Analytics</td><td>Google Analytics unique visitor identifier</td><td>2 years</td></tr>
    <tr><td>_gid</td><td>Analytics</td><td>Google Analytics session identifier</td><td>24 hours</td></tr>
    <tr><td>_gat</td><td>Analytics</td><td>Google Analytics request throttle</td><td>1 minute</td></tr>
    <tr><td>fw_lang</td><td>Functional</td><td>Language preference</td><td>12 months</td></tr>
    <tr><td>fw_theme</td><td>Functional</td><td>Light/dark theme preference</td><td>12 months</td></tr>
  </tbody>
</table>`
        },
        {
          id: 'cookie-consent',
          heading: '6. Cookie Consent',
          content: `<p>When you first visit the Platform, you will see a cookie consent banner. You can:</p>
<ul>
  <li><strong>Accept All:</strong> Allow all categories of cookies</li>
  <li><strong>Reject All:</strong> Allow only essential cookies</li>
  <li><strong>Save Preferences:</strong> Choose which categories to enable or disable</li>
</ul>
<p>You can change your preferences at any time by clicking "Cookie Settings" in the footer. Your consent is recorded with a timestamp and stored for 12 months, after which you will be asked again.</p>`,
          callout: 'You can update your cookie preferences at any time using the "Cookie Settings" link in the footer of every page.',
          calloutType: 'info'
        },
        {
          id: 'manage-cookies',
          heading: '7. How to Manage and Disable Cookies',
          content: `<p>In addition to using our cookie banner, you can control cookies through your browser settings:</p>
<ul>
  <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
  <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
  <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
  <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
</ul>
<p>Please note that disabling essential cookies will prevent you from logging in and using core Platform features.</p>`
        },
        {
          id: 'cookies-and-personal-info',
          heading: '8. Cookies and Personal Information',
          content: `<p>Some cookies may collect personal information (such as your IP address or user identifier). Where this occurs, we process that information in accordance with our <a routerLink="/legal/privacy-policy">Privacy Policy</a> and POPIA.</p>`
        },
        {
          id: 'do-not-track',
          heading: '9. Do Not Track',
          content: `<p>Some browsers include a "Do Not Track" (DNT) feature. We currently do not respond to DNT signals because there is no industry standard for how DNT signals should be interpreted. We rely on our cookie consent system to honour your preferences.</p>`
        },
        {
          id: 'changes',
          heading: '10. Changes to This Policy',
          content: `<p>We may update this Cookie Policy from time to time to reflect changes in technology or legal requirements. We will notify you of material changes through the Platform or by email. The current version and date are always displayed at the top of this document.</p>`
        },
        {
          id: 'contact',
          heading: '11. Contact Us',
          content: `<p>If you have any questions about our use of cookies, please contact us at <a href="mailto:privacy@freework.co.za">privacy@freework.co.za</a>.</p>`
        }
      ]
    },

    'freelancer-terms': {
      title: 'Freelancer Terms and Conditions',
      version: '1.0',
      effectiveDate: '1 January 2025',
      lastUpdated: '1 January 2025',
      sections: [
        {
          id: 'definitions',
          heading: '1. Definitions',
          content: `<p>In these Terms and Conditions:</p>
<ul>
  <li><strong>"Platform"</strong> means the Freework website and application at freework.co.za</li>
  <li><strong>"Freework"</strong> means Freework (Pty) Ltd, a company registered in South Africa</li>
  <li><strong>"Freelancer"</strong> means you, a registered user offering services on the Platform</li>
  <li><strong>"Business"</strong> or <strong>"Client"</strong> means a registered user seeking to hire Freelancers</li>
  <li><strong>"Project"</strong> means a specific job or task posted by a Business and accepted by a Freelancer</li>
  <li><strong>"Agreement"</strong> means these Terms and Conditions together with the Privacy Policy and Cookie Policy</li>
  <li><strong>"Fees"</strong> means the amounts payable for services rendered through the Platform</li>
  <li><strong>"Platform Fee"</strong> means the service fee charged by Freework for facilitating transactions</li>
</ul>`
        },
        {
          id: 'registration',
          heading: '2. Registration and Eligibility',
          content: `<p>To register as a Freelancer on the Platform, you must:</p>
<ul>
  <li>Be at least 18 years of age</li>
  <li>Be legally entitled to work and provide services in South Africa or your applicable jurisdiction</li>
  <li>Provide accurate, current, and complete information during registration</li>
  <li>Accept these Terms and Conditions and our Privacy Policy</li>
  <li>Verify your email address</li>
  <li>Not have been previously banned or suspended from the Platform</li>
</ul>
<p>You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.</p>`
        },
        {
          id: 'independent-contractor',
          heading: '3. Independent Contractor Status',
          content: `<p>You acknowledge and agree that:</p>
<ul>
  <li>You are an independent contractor, not an employee, agent, or partner of Freework or any Business on the Platform</li>
  <li>You are solely responsible for your own tax obligations, including income tax and VAT registration where applicable</li>
  <li>Freework does not withhold PAYE, UIF, or any other employment-related deductions from payments made to you</li>
  <li>You are responsible for your own professional indemnity insurance and other applicable cover</li>
  <li>You have the right to work for multiple clients simultaneously, unless a specific agreement with a Business restricts this</li>
</ul>`,
          callout: 'IMPORTANT: You are an independent contractor. Freework is a marketplace, not your employer. You are responsible for your own taxes and compliance obligations.',
          calloutType: 'warning'
        },
        {
          id: 'platform-use',
          heading: '4. Platform Use',
          content: `<p>When using the Platform, you agree to:</p>
<ul>
  <li>Provide honest, accurate information about your skills, experience, and qualifications</li>
  <li>Not misrepresent your identity or professional credentials</li>
  <li>Respond to Business enquiries and messages in a timely and professional manner</li>
  <li>Not communicate with Businesses outside the Platform for the purpose of avoiding Platform Fees ("fee circumvention")</li>
  <li>Not create multiple accounts or share your account with others</li>
  <li>Not post false reviews or manipulate the rating system</li>
  <li>Comply with all applicable South African laws, including the Consumer Protection Act and POPIA</li>
</ul>`
        },
        {
          id: 'projects',
          heading: '5. Projects and Deliverables',
          content: `<p>When you accept a Project:</p>
<ul>
  <li>You commit to delivering the agreed work to the standard described in the Project brief</li>
  <li>You must communicate clearly and promptly with the Business throughout the Project</li>
  <li>You must notify the Business immediately if you anticipate any delays or problems</li>
  <li>Deliverables must be your own original work unless otherwise agreed in writing</li>
  <li>You warrant that your work will not infringe the intellectual property rights of any third party</li>
  <li>The Business may reject deliverables that do not meet the agreed specifications, and you will be given a reasonable opportunity to rectify them</li>
</ul>`
        },
        {
          id: 'intellectual-property',
          heading: '6. Intellectual Property',
          content: `<p>Unless explicitly agreed otherwise in writing between you and the Business:</p>
<ul>
  <li>Upon receipt of full payment, all intellectual property rights in deliverables created for a specific Business transfer to that Business</li>
  <li>You retain ownership of your general methodology, know-how, tools, and pre-existing materials</li>
  <li>You grant the Business a non-exclusive, royalty-free licence to use any background IP that is incorporated into the deliverables</li>
  <li>You may include anonymised descriptions of completed projects in your portfolio unless the Business requests confidentiality</li>
</ul>`
        },
        {
          id: 'payments',
          heading: '7. Payments and Fees',
          content: `<p>Payment arrangements:</p>
<ul>
  <li>Payments are processed through PayFast and are subject to PayFast's terms and conditions</li>
  <li>Freework charges a Platform Fee on all transactions. The current fee schedule is available on the pricing page.</li>
  <li>Payment to Freelancers is released upon the Business's confirmation of satisfactory completion, or automatically after 14 days if no dispute is raised</li>
  <li>Freework operates an escrow system — funds are held securely until work is confirmed complete</li>
  <li>In the event of a refund, Freework reserves the right to deduct any payment processing fees that cannot be recovered</li>
  <li>Payments are made in South African Rand (ZAR)</li>
</ul>`
        },
        {
          id: 'subscriptions',
          heading: '8. Subscriptions',
          content: `<p>Freework offers tiered subscription plans:</p>
<ul>
  <li><strong>Free Plan (R0/month):</strong> Limited applications per month</li>
  <li><strong>Growth Plan (R299/month):</strong> Increased application limits and enhanced profile visibility</li>
  <li><strong>Scale Plan (R799/month):</strong> Unlimited applications, priority listing, and premium support</li>
</ul>
<p>Subscriptions are billed monthly. You may cancel your subscription at any time and will retain access to your paid tier until the end of the current billing period. No partial refunds are provided.</p>`
        },
        {
          id: 'ratings',
          heading: '9. Ratings and Reviews',
          content: `<p>The Platform includes a ratings and review system:</p>
<ul>
  <li>Both Freelancers and Businesses may leave reviews after Project completion</li>
  <li>Reviews must be honest and based on actual work experience</li>
  <li>Freework reserves the right to remove reviews that violate our community standards</li>
  <li>Attempting to manipulate ratings through fake reviews, bribery, or coercion is a breach of these Terms and may result in account suspension</li>
</ul>`
        },
        {
          id: 'disputes',
          heading: '10. Dispute Resolution',
          content: `<p>In the event of a dispute between a Freelancer and a Business:</p>
<ul>
  <li>Both parties are encouraged to resolve the dispute directly in the first instance</li>
  <li>If direct resolution fails, either party may submit a formal dispute to Freework at support@freework.co.za</li>
  <li>Freework will conduct a review of the evidence provided and make a determination within 15 business days</li>
  <li>Freework's determination is final and binding regarding Platform matters, but does not affect your rights to pursue legal remedies</li>
  <li>Where funds are held in escrow, Freework will not release payment until the dispute is resolved</li>
</ul>`
        },
        {
          id: 'confidentiality',
          heading: '11. Confidentiality',
          content: `<p>You agree to:</p>
<ul>
  <li>Keep confidential all non-public information disclosed by a Business during a Project</li>
  <li>Use confidential information only for the purposes of completing the Project</li>
  <li>Not disclose confidential information to third parties without the Business's written consent</li>
  <li>These obligations survive the termination of any Project or your account</li>
</ul>`
        },
        {
          id: 'termination',
          heading: '12. Termination',
          content: `<p>Freework may suspend or terminate your account if you:</p>
<ul>
  <li>Breach these Terms and Conditions</li>
  <li>Engage in fraudulent, illegal, or abusive conduct</li>
  <li>Receive sustained poor ratings that damage trust on the Platform</li>
  <li>Attempt to circumvent Platform fees</li>
</ul>
<p>You may terminate your account at any time from your Settings page. Termination does not extinguish any obligations arising from ongoing Projects.</p>`
        },
        {
          id: 'liability',
          heading: '13. Limitation of Liability',
          content: `<p>To the maximum extent permitted by South African law:</p>
<ul>
  <li>Freework is a marketplace facilitator and is not liable for the actions, omissions, or quality of work of any Freelancer or Business</li>
  <li>Freework's aggregate liability to you for any claim shall not exceed the total Platform Fees paid by or to you in the 12 months preceding the claim</li>
  <li>Freework is not liable for indirect, incidental, consequential, or punitive damages</li>
  <li>Nothing in these Terms limits liability for fraud, gross negligence, or as prohibited by law</li>
</ul>`
        },
        {
          id: 'indemnity',
          heading: '14. Indemnity',
          content: `<p>You indemnify Freework, its directors, employees, and agents against all claims, losses, damages, and expenses (including legal costs) arising from your use of the Platform, breach of these Terms, infringement of third-party rights, or tax non-compliance.</p>`
        },
        {
          id: 'governing-law',
          heading: '15. Governing Law',
          content: `<p>These Terms and Conditions are governed by the laws of the Republic of South Africa. Any disputes shall be subject to the exclusive jurisdiction of the South African courts, specifically the courts of [City] having jurisdiction.</p>`
        },
        {
          id: 'general',
          heading: '16. General Provisions',
          content: `<ul>
  <li><strong>Entire Agreement:</strong> These Terms, together with the Privacy Policy and Cookie Policy, constitute the entire agreement between you and Freework</li>
  <li><strong>Severability:</strong> If any provision is found invalid or unenforceable, the remaining provisions continue in full force</li>
  <li><strong>No Waiver:</strong> Failure to enforce any provision does not waive Freework's right to enforce it in future</li>
  <li><strong>Assignment:</strong> You may not assign your rights under these Terms without Freework's written consent</li>
  <li><strong>Amendments:</strong> Freework may amend these Terms at any time by posting updated Terms on the Platform. Continued use after the effective date constitutes acceptance.</li>
</ul>`
        },
        {
          id: 'contact',
          heading: '17. Contact Information',
          content: `<ul>
  <li><strong>General enquiries:</strong> <a href="mailto:hello@freework.co.za">hello@freework.co.za</a></li>
  <li><strong>Privacy and data requests:</strong> <a href="mailto:privacy@freework.co.za">privacy@freework.co.za</a></li>
  <li><strong>Disputes:</strong> <a href="mailto:support@freework.co.za">support@freework.co.za</a></li>
</ul>`
        }
      ]
    },

    'business-terms': {
      title: 'Business Terms and Conditions',
      version: '1.0',
      effectiveDate: '1 January 2025',
      lastUpdated: '1 January 2025',
      sections: [
        {
          id: 'definitions',
          heading: '1. Definitions',
          content: `<p>In these Terms and Conditions:</p>
<ul>
  <li><strong>"Platform"</strong> means the Freework website and application at freework.co.za</li>
  <li><strong>"Freework"</strong> means Freework (Pty) Ltd, a company registered in South Africa</li>
  <li><strong>"Business"</strong> or <strong>"Client"</strong> means you, a registered user seeking to hire Freelancers</li>
  <li><strong>"Freelancer"</strong> means a registered user offering services on the Platform</li>
  <li><strong>"Project"</strong> means a specific job or task you post on the Platform</li>
  <li><strong>"Agreement"</strong> means these Terms and Conditions together with the Privacy Policy and Cookie Policy</li>
  <li><strong>"Platform Fee"</strong> means the service fee charged by Freework for facilitating transactions</li>
</ul>`
        },
        {
          id: 'registration',
          heading: '2. Registration and Eligibility',
          content: `<p>To register as a Business on the Platform, you must:</p>
<ul>
  <li>Be at least 18 years of age, or if registering on behalf of a company, be duly authorised to bind that company</li>
  <li>Provide accurate, current, and complete registration information including company details where applicable</li>
  <li>Accept these Terms and Conditions and our Privacy Policy</li>
  <li>Verify your email address</li>
  <li>Not have been previously banned or suspended from the Platform</li>
</ul>
<p>By registering a company account, you represent and warrant that you have authority to bind the company to these Terms.</p>`
        },
        {
          id: 'posting-jobs',
          heading: '3. Posting Jobs',
          content: `<p>When posting a job on the Platform, you agree to:</p>
<ul>
  <li>Provide accurate, complete, and honest job descriptions</li>
  <li>Not post jobs for illegal services or activities</li>
  <li>Not post jobs that discriminate unlawfully on the basis of race, gender, age, religion, disability, or any other protected characteristic under the Employment Equity Act</li>
  <li>Not use job postings to solicit personal information beyond what is necessary for the Project</li>
  <li>Respond to Freelancer applications in a timely and professional manner</li>
  <li>Not repost jobs solely to avoid paying for completed work</li>
</ul>`
        },
        {
          id: 'payments',
          heading: '4. Payments',
          content: `<p>All payments on the Platform are processed through <strong>PayFast</strong>. The following payment methods are accepted:</p>
<ul>
  <li>Credit and Debit Cards (Visa, Mastercard)</li>
  <li>Instant EFT (via PayFast)</li>
  <li>Mobicred</li>
  <li>SnapScan</li>
</ul>
<p>Payment process:</p>
<ul>
  <li>Payment is required upfront when you award a Project to a Freelancer</li>
  <li>Funds are held in escrow by Freework until you confirm satisfactory completion</li>
  <li>Payment is released to the Freelancer upon your confirmation, or automatically after 14 days if no dispute is raised</li>
  <li>Freework charges a Platform Fee on transactions. The current fee schedule is available on the pricing page.</li>
  <li>All prices are in South African Rand (ZAR) and are inclusive of VAT where applicable</li>
</ul>`,
          callout: 'Payments are secured by PayFast escrow. Funds are only released to Freelancers when you confirm the work is complete.',
          calloutType: 'info'
        },
        {
          id: 'prohibited-conduct',
          heading: '5. Prohibited Conduct',
          content: `<p>You must not:</p>
<ul>
  <li>Communicate with Freelancers outside the Platform for the purpose of avoiding Platform Fees ("fee circumvention")</li>
  <li>Refuse to pay for work that has been completed to the agreed specification</li>
  <li>Use the Platform to poach Freelancers for direct employment in circumvention of the Platform</li>
  <li>Post false reviews or manipulate the rating system</li>
  <li>Share your account credentials with others</li>
  <li>Use automated tools to scrape or access the Platform without authorisation</li>
  <li>Engage in any conduct that violates South African law or Freework's community standards</li>
</ul>`
        },
        {
          id: 'subscriptions',
          heading: '6. Subscriptions',
          content: `<p>Freework offers the following subscription tiers for Businesses:</p>
<table class="cookie-table">
  <thead><tr><th>Plan</th><th>Price</th><th>Active Job Listings</th><th>Features</th></tr></thead>
  <tbody>
    <tr><td><strong>Free</strong></td><td>R0/month</td><td>Up to 3</td><td>Basic listings, standard support</td></tr>
    <tr><td><strong>Growth</strong></td><td>R299/month</td><td>Up to 15</td><td>Featured listings, priority support</td></tr>
    <tr><td><strong>Scale</strong></td><td>R799/month</td><td>Unlimited</td><td>Top placement, dedicated support, analytics</td></tr>
  </tbody>
</table>
<p>Subscriptions are billed monthly. You may cancel at any time and will retain access to your paid tier until the end of the current billing period.</p>`
        },
        {
          id: 'intellectual-property',
          heading: '7. Intellectual Property',
          content: `<p>Upon full payment of a Project:</p>
<ul>
  <li>You receive ownership of all deliverables specifically created for your Project, unless otherwise agreed in writing</li>
  <li>The Freelancer retains ownership of their pre-existing tools, methodologies, and background IP</li>
  <li>You grant Freework a non-exclusive licence to display Project descriptions for Platform marketing purposes</li>
  <li>You warrant that any materials, briefs, or third-party content you provide to Freelancers does not infringe any intellectual property rights</li>
</ul>`
        },
        {
          id: 'confidentiality',
          heading: '8. Confidentiality and Data Protection',
          content: `<p>Where you share confidential business information with Freelancers through the Platform:</p>
<ul>
  <li>You should use the Platform's built-in NDA functionality for sensitive Projects</li>
  <li>Freework cannot enforce confidentiality obligations between you and Freelancers, but breach of confidentiality may result in account suspension</li>
  <li>You are responsible for ensuring your use of the Platform complies with POPIA where you process personal information of third parties</li>
</ul>`
        },
        {
          id: 'disputes',
          heading: '9. Dispute Resolution',
          content: `<p>In the event of a dispute with a Freelancer:</p>
<ul>
  <li>Both parties are encouraged to resolve the dispute directly</li>
  <li>If direct resolution fails, either party may submit a formal dispute to Freework at support@freework.co.za</li>
  <li>Freework will review all evidence and make a determination within 15 business days</li>
  <li>Freework's determination is final regarding Platform matters</li>
  <li>Escrowed funds will not be released until the dispute is resolved</li>
</ul>`
        },
        {
          id: 'freelancer-independence',
          heading: '10. Freelancer Independence',
          content: `<p>You acknowledge and agree that:</p>
<ul>
  <li>Freelancers on the Platform are independent contractors, not employees of Freework or your business</li>
  <li>You are not required to provide Freelancers with employment benefits, including leave, UIF, or medical aid</li>
  <li>However, if your engagement with a Freelancer creates an employment relationship under South African law (as determined by the Labour Court or CCMA), you bear sole responsibility for that relationship</li>
  <li>You are responsible for determining the tax treatment of payments to Freelancers, particularly regarding Section 83A of the Income Tax Act</li>
</ul>`,
          callout: 'IMPORTANT: If your use of a Freelancer creates an employment relationship under South African labour law, you — not Freework — bear full responsibility for that relationship, including all obligations under the Labour Relations Act and Basic Conditions of Employment Act.',
          calloutType: 'warning'
        },
        {
          id: 'ratings',
          heading: '11. Ratings and Reviews',
          content: `<p>The Platform includes a two-way ratings and review system:</p>
<ul>
  <li>You may leave a review for a Freelancer after Project completion</li>
  <li>Freelancers may leave a review for you after Project completion</li>
  <li>Reviews must be honest and based on actual work experience</li>
  <li>Freework reserves the right to remove reviews that violate community standards</li>
</ul>`
        },
        {
          id: 'liability',
          heading: '12. Limitation of Liability',
          content: `<p>To the maximum extent permitted by South African law:</p>
<ul>
  <li>Freework is a marketplace facilitator and is not liable for the quality, timeliness, or fitness for purpose of Freelancer work</li>
  <li>Freework's aggregate liability shall not exceed the total Platform Fees paid by you in the 12 months preceding the claim</li>
  <li>Freework is not liable for indirect, incidental, consequential, or punitive damages</li>
  <li>Nothing in these Terms limits liability for fraud, gross negligence, or as prohibited by law</li>
</ul>`
        },
        {
          id: 'indemnity',
          heading: '13. Indemnity',
          content: `<p>You indemnify Freework, its directors, employees, and agents against all claims, losses, damages, and expenses (including legal costs) arising from your use of the Platform, breach of these Terms, infringement of third-party intellectual property rights, misclassification of workers, or non-compliance with applicable law.</p>`
        },
        {
          id: 'termination',
          heading: '14. Termination',
          content: `<p>Freework may suspend or terminate your account if you:</p>
<ul>
  <li>Breach these Terms and Conditions</li>
  <li>Engage in fraudulent, illegal, or abusive conduct</li>
  <li>Persistently fail to pay Freelancers for completed work</li>
  <li>Attempt to circumvent Platform fees</li>
</ul>
<p>You may terminate your account at any time from your Settings page. You remain liable for payment for any Projects awarded but not yet completed at the time of termination.</p>`
        },
        {
          id: 'general',
          heading: '15. General Provisions',
          content: `<ul>
  <li><strong>Entire Agreement:</strong> These Terms, together with the Privacy Policy and Cookie Policy, constitute the entire agreement</li>
  <li><strong>Severability:</strong> If any provision is invalid or unenforceable, the remaining provisions continue</li>
  <li><strong>No Waiver:</strong> Failure to enforce any provision does not waive future enforcement</li>
  <li><strong>Assignment:</strong> You may not assign your rights without Freework's written consent</li>
  <li><strong>Amendments:</strong> Freework may amend these Terms at any time with notice. Continued use constitutes acceptance.</li>
</ul>`
        },
        {
          id: 'governing-law',
          heading: '16. Governing Law',
          content: `<p>These Terms are governed by the laws of the Republic of South Africa. Disputes are subject to the exclusive jurisdiction of the South African courts.</p>`
        },
        {
          id: 'contact',
          heading: '17. Contact Information',
          content: `<ul>
  <li><strong>General enquiries:</strong> <a href="mailto:hello@freework.co.za">hello@freework.co.za</a></li>
  <li><strong>Privacy and data requests:</strong> <a href="mailto:privacy@freework.co.za">privacy@freework.co.za</a></li>
  <li><strong>Disputes and support:</strong> <a href="mailto:support@freework.co.za">support@freework.co.za</a></li>
</ul>`
        }
      ]
    }
  },

  af: {
    'privacy-policy': {
      title: 'Privaatheidsbeleid',
      version: '1.0',
      effectiveDate: '1 Januarie 2025',
      lastUpdated: '1 Januarie 2025',
      sections: [
        {
          id: 'introduction',
          heading: '1. Inleiding',
          content: `<p>Freework (Edms) Bpk ("Freework", "ons", "ons" of "ons s'n") is verbind tot die beskerming van u persoonlike inligting in ooreenstemming met die Wet op Beskerming van Persoonlike Inligting 4 van 2013 ("POPI-Wet") en alle toepaslike Suid-Afrikaanse privaatheidsreëlgewing.</p>
<p>Hierdie Privaatheidsbeleid verduidelik hoe ons u persoonlike inligting insamel, gebruik, stoor, deel en beskerm wanneer u die Freework-platform gebruik, insluitend ons webwerf by freework.co.za en ons mobiele toepassing (gesamentlik die "Platform").</p>
<p>Deur op die Platform te registreer of dit te gebruik, bevestig u dat u gelees, verstaan en ingestem het tot die insameling en gebruik van u persoonlike inligting soos beskryf in hierdie beleid.</p>`
        },
        {
          id: 'who-we-are',
          heading: '2. Wie Ons Is',
          content: `<p><strong>Verantwoordelike Party (soos omskryf in die POPI-Wet):</strong></p>
<ul>
  <li><strong>Naam:</strong> Freework (Edms) Bpk</li>
  <li><strong>Registrasienommer:</strong> [Word ingevoeg by inkorporering]</li>
  <li><strong>Adres:</strong> Suid-Afrika</li>
  <li><strong>E-pos:</strong> privacy@freework.co.za</li>
  <li><strong>Inligtingsbeampte:</strong> [Naam sal aangewys word]</li>
</ul>
<p>Ons is by die Inligtingsreguleerder van Suid-Afrika geregistreer soos vereis deur die POPI-Wet.</p>`
        },
        {
          id: 'information-we-collect',
          heading: '3. Inligting Wat Ons Insamel',
          content: `<p>Ons samel die volgende kategorieë persoonlike inligting in:</p>
<h4>3.1 Inligting Wat U Direk Verskaf</h4>
<ul>
  <li><strong>Identiteitsinligting:</strong> Volle naam, gebruikersnaam, profielfoto</li>
  <li><strong>Kontakinligting:</strong> E-posadres, telefoonnommer, fisiese ligging</li>
  <li><strong>Professionele inligting:</strong> Werktitel, vaardighede, werkgeskiedenis, opleiding, portefeulje-items</li>
  <li><strong>Finansiële inligting:</strong> Betalingsinligting verwerk deur PayFast (ons stoor nie rou kaartbesonderhede nie)</li>
  <li><strong>Kommunikasie:</strong> Boodskappe uitgeruil deur die Platform se boodskapdiens</li>
  <li><strong>Rekeningbewyse:</strong> Gehashte wagwoord (ons stoor nooit gewone tekswagwoorde nie)</li>
</ul>
<h4>3.2 Outomaties Ingesamelde Inligting</h4>
<ul>
  <li><strong>Gebruiksdata:</strong> Bladsye besoek, funksies gebruik, soektogte, klikke en interaksies</li>
  <li><strong>Toestelinfo:</strong> IP-adres, blaaiersoort, bedryfstelsel, toestelidentifiseerders</li>
  <li><strong>Logdata:</strong> Bedienerloglêers, foutverslae, tydstempels van aksies</li>
  <li><strong>Koekiedata:</strong> Soos beskryf in ons Koekiebeleid</li>
</ul>
<h4>3.3 Inligting van Derde Partye</h4>
<ul>
  <li>Betalingverifikasiedata van PayFast</li>
  <li>Openbaar beskikbare professionele inligting (LinkedIn, GitHub) as u hierdie rekeninge koppel</li>
</ul>`
        },
        {
          id: 'how-we-use',
          heading: '4. Hoe Ons U Inligting Gebruik',
          content: `<p>Ons gebruik u persoonlike inligting vir die volgende doeleindes:</p>
<ul>
  <li><strong>Platformwerking:</strong> Die skep en bestuur van u rekening, om u toe te laat om werk te plaas of aan te soek, die fasilitering van betalings en kommunikasie tussen gebruikers</li>
  <li><strong>Diensteverbetering:</strong> Die ontleding van gebruikspatrone om platformkenmerke en -prestasie te verbeter</li>
  <li><strong>Sekuriteit en bedrogvoorkoming:</strong> Die opsporing en voorkoming van bedrieglike aktiwiteit, die beskerming van gebruikers en die platform</li>
  <li><strong>Wetlike nakoming:</strong> Die nakoming van ons verpligtinge onder die POPI-Wet, belastingreg en ander toepaslike wetgewing</li>
  <li><strong>Kommunikasie:</strong> Die stuur van transaksionele e-posse (betalingsbevestigings, sekuriteitswaarskuwings, rekeningkennisgewings) en, waar u ingestem het, bemarkingskommunikasie</li>
  <li><strong>Geskilbeslegting:</strong> Die oplossing van geskille tussen vryskutters en besighede op die platform</li>
  <li><strong>Graderings- en beoordelingstelsel:</strong> Om gebruikers in staat te stel om resensies te laat en te ontvang</li>
</ul>`
        },
        {
          id: 'legal-basis',
          heading: '5. Regsgrondbeginsels vir Verwerking',
          content: `<p>Onder die POPI-Wet verwerk ons u persoonlike inligting op die volgende wettige gronde:</p>
<ul>
  <li><strong>Kontrakprestasie:</strong> Verwerking noodsaaklik om die Platformdienste wat u versoek het te lewer</li>
  <li><strong>Wettige belange:</strong> Platformsekuriteit, bedrogvoorkoming en diensteverbetering</li>
  <li><strong>Wetlike verpligting:</strong> Nakoming van Suid-Afrikaanse reg, insluitend belasting- en finansiële verslagdoeningsvereistes</li>
  <li><strong>Toestemming:</strong> Bemarkingskommunikasie en nie-noodsaaklike koekies (u kan toestemming te eniger tyd onttrek)</li>
  <li><strong>Openbare belang:</strong> Waar van toepassing ingevolge Artikel 11(1)(e) van die POPI-Wet</li>
</ul>`
        },
        {
          id: 'sharing',
          heading: '6. Deel van U Inligting',
          content: `<p>Ons deel u persoonlike inligting slegs waar nodig:</p>
<ul>
  <li><strong>Met ander gebruikers:</strong> U profielinligting (naam, vaardighede, graderings, portefeulje) is sigbaar vir ander geregistreerde gebruikers as deel van die Platform se kernfunksionaliteit</li>
  <li><strong>Met PayFast:</strong> Betalingsinligting word gedeel met PayFast (Edms) Bpk, ons betalingsverwerker, om transaksies te verwerk. PayFast is onderhewig aan sy eie privaatheidsbeleid.</li>
  <li><strong>Met diensverskaffers:</strong> Vertroude derde-party diensverskaffers wat ons help om die Platform te bedryf (e-posaflewering, wolkhosting, analise), onderhewig aan kontraktuele dataverwerkingsooreenkomste</li>
  <li><strong>Vir wetlike nakoming:</strong> Waar vereis deur wet, hofbevel, of om die regte en veiligheid van gebruikers te beskerm</li>
  <li><strong>Besigheidsoorplaasings:</strong> By 'n samesmelting, oorname of verkoop van bates kan u inligting as deel van daardie transaksie oorgedra word</li>
</ul>
<p>Ons verkoop nie u persoonlike inligting aan derde partye nie.</p>`
        },
        {
          id: 'cross-border',
          heading: '7. Grensoorskrydende Oordragte',
          content: `<p>Sommige van ons diensverskaffers kan buite Suid-Afrika geleë wees. Waar ons persoonlike inligting buite Suid-Afrika oordra, verseker ons dat voldoende beskermings in plek is soos vereis deur Artikel 72 van die POPI-Wet, insluitend:</p>
<ul>
  <li>Bindende kontraktuele klousules gelykwaardig aan Suid-Afrikaanse databeskermingstandaarde</li>
  <li>Oordragte slegs na lande met voldoende databeskermingswetgewing</li>
  <li>U toestemming waar vereis</li>
</ul>`
        },
        {
          id: 'data-retention',
          heading: '8. Databewaring',
          content: `<p>Ons behou u persoonlike inligting so lank as nodig om die Platformdienste te lewer en ons wetlike verpligtinge na te kom:</p>
<ul>
  <li><strong>Rekeningdata:</strong> Behou vir die duur van u rekening en vir 3 jaar na rekeningverwydering</li>
  <li><strong>Finansiële rekords:</strong> Behou vir 5 jaar soos vereis deur Suid-Afrikaanse belastingwetgewing</li>
  <li><strong>Boodskappe:</strong> Behou vir 2 jaar na die laaste interaksie</li>
  <li><strong>Toestemmingsrekords:</strong> Onbeperk behou as bewys van toestemming</li>
  <li><strong>Geanonimiseerde data:</strong> Kan onbeperk behou word vir analise-doeleindes</li>
</ul>
<p>Wanneer u u rekening verwyder, geanonimiseer ons u persoonlike data. Ons verwyder nie permanent rekords wat vereis word vir wetlike of finansiële nakoming nie.</p>`
        },
        {
          id: 'your-rights',
          heading: '9. U Regte Onder die POPI-Wet',
          content: `<p>As 'n datasubjek onder die POPI-Wet het u die volgende regte:</p>
<ul>
  <li><strong>Reg op toegang:</strong> Versoek 'n kopie van die persoonlike inligting wat ons oor u hou</li>
  <li><strong>Reg op korreksie:</strong> Versoek korreksie van onakkurate of onvolledige persoonlike inligting</li>
  <li><strong>Reg op skrapping:</strong> Versoek die skrapping van u persoonlike inligting (onderhewig aan wetlike bewaaringsvereistes)</li>
  <li><strong>Reg om beswaar te maak:</strong> Maak beswaar teen die verwerking van u persoonlike inligting vir direkte bemarking</li>
  <li><strong>Reg op datadraagbaarheid:</strong> Versoek u data in 'n gestruktureerde, masjienleesbaarformaat</li>
  <li><strong>Reg om toestemming te onttrek:</strong> Onttrek toestemming te eniger tyd waar verwerking op toestemming gebaseer is</li>
  <li><strong>Reg om 'n klagte in te dien:</strong> Dien 'n klagte in by die Inligtingsreguleerder van Suid-Afrika</li>
</ul>
<p>Om enige van hierdie regte uit te oefen, dien 'n versoek in by <strong>/legal/popia-request</strong> of e-pos ons by <a href="mailto:privacy@freework.co.za">privacy@freework.co.za</a>.</p>`,
          callout: 'Inligtingsreguleerder van Suid-Afrika: E-pos: inforeg@justice.gov.za | Tel: 010 023 5207 | Webwerf: www.justice.gov.za/inforeg/',
          calloutType: 'info'
        },
        {
          id: 'security',
          heading: '10. Sekuriteit van U Inligting',
          content: `<p>Ons implementeer toepaslike tegniese en organisatoriese sekuriteitsmaatreëls om u persoonlike inligting te beskerm teen ongemagtigde toegang, openbaarmaking, wysiging of vernietiging, insluitend:</p>
<ul>
  <li>TLS/HTTPS-enkripsie vir alle data in transito</li>
  <li>BCrypt-wagwoordhashing — ons stoor nooit gewone tekswagwoorde nie</li>
  <li>JWT-gebaseerde statelose verifikasie</li>
  <li>Rolgebaseerde toegangskontroles</li>
  <li>Gereelde sekuriteitsoorsigte</li>
  <li>Ouditlogging van alle beduidende data-toeganggebeure</li>
</ul>
<p>Geen metode van oordrag oor die internet is 100% veilig nie. Alhoewel ons alle redelike voorsorgmaatreëls tref, kan ons nie absolute sekuriteit waarborg nie.</p>`
        },
        {
          id: 'childrens-privacy',
          heading: "11. Privaatheid van Kinders",
          content: `<p>Die Freework-platform is nie bedoel vir gebruik deur persone onder die ouderdom van 18 jaar nie. Ons samel nie wetend persoonlike inligting van minderjariges in nie. As u glo dat 'n minderjarige ons persoonlike inligting verskaf het, kontak ons by privacy@freework.co.za en ons sal dit onmiddellik verwyder.</p>`
        },
        {
          id: 'cookie-policy-summary',
          heading: '12. Koekiebeleid',
          content: `<p>Ons gebruik koekies en soortgelyke opspoortegnologieë op die Platform. Sien asseblief ons <a routerLink="/legal/cookie-policy">Koekiebeleid</a> vir volledige besonderhede. U kan u koekievoorkeure te eniger tyd bestuur deur die koekieinstellingsbanner te gebruik.</p>`
        },
        {
          id: 'changes',
          heading: '13. Wysigings aan Hierdie Beleid',
          content: `<p>Ons kan hierdie Privaatheidsbeleid van tyd tot tyd opdateer. Wanneer ons wesenlike veranderinge aanbring, sal ons u per e-pos in kennis stel en 'n kennisgewing op die Platform vertoon. Voortgesette gebruik van die Platform na die ingangsdatum van 'n bygewerkte beleid verteenwoordig u aanvaarding van die veranderinge.</p>
<p>Die huidige weergawe en ingangsdatum word bo-aan hierdie dokument vertoon.</p>`
        },
        {
          id: 'contact',
          heading: '14. Kontak Ons',
          content: `<p>Vir enige privaatheidsversoeke, -navrae of -klagtes, kontak asseblief ons Inligtingsbeampte:</p>
<ul>
  <li><strong>E-pos:</strong> <a href="mailto:privacy@freework.co.za">privacy@freework.co.za</a></li>
  <li><strong>POPI-Wet Dataversoek:</strong> <a routerLink="/legal/popia-request">Dien 'n formele versoek in</a></li>
  <li><strong>Posadres:</strong> Freework (Edms) Bpk, Suid-Afrika</li>
</ul>
<p>Ons sal op alle versoeke binne 30 dae reageer soos vereis deur die POPI-Wet.</p>`
        }
      ]
    },

    'cookie-policy': {
      title: 'Koekiebeleid',
      version: '1.0',
      effectiveDate: '1 Januarie 2025',
      lastUpdated: '1 Januarie 2025',
      sections: [
        {
          id: 'introduction',
          heading: '1. Inleiding',
          content: `<p>Hierdie Koekiebeleid verduidelik hoe Freework (Edms) Bpk ("Freework", "ons") koekies en soortgelyke opspoortegnologieë op die Freework-platform (freework.co.za) gebruik. Hierdie beleid vorm deel van ons <a routerLink="/legal/privacy-policy">Privaatheidsbeleid</a>.</p>
<p>Deur ons Platform te gebruik, stem u in tot die gebruik van noodsaaklike koekies. Vir nie-noodsaaklike koekies (analise, funksioneel, bemarking) sal ons u spesifieke toestemming vra deur ons koekieinstellingsbanner.</p>`
        },
        {
          id: 'what-are-cookies',
          heading: '2. Wat Is Koekies?',
          content: `<p>Koekies is klein tekslêers wat op u toestel geplaas word wanneer u 'n webwerf besoek. Hulle help webwerwe om inligting oor u besoek te onthou, wat dit makliker kan maak om die webwerf weer te besoek en dit nuttiger vir u te maak.</p>
<p>Ons gebruik ook soortgelyke tegnologieë insluitend:</p>
<ul>
  <li><strong>Plaaslike Stoor:</strong> Blaaier-kant stoor vir sessiedata en voorkeure</li>
  <li><strong>Sessie-stoor:</strong> Tydelike stoor wat gewis word wanneer u blaaier-oortjie gesluit word</li>
  <li><strong>Pixels/Webbakens:</strong> Klein beelde gebruik om e-posoopenkoerse en bladsybesoeke op te spoor</li>
</ul>`
        },
        {
          id: 'why-we-use',
          heading: '3. Hoekom Ons Koekies Gebruik',
          content: `<p>Ons gebruik koekies om:</p>
<ul>
  <li>U veilig aangemeld te hou oor bladsynavigasies</li>
  <li>U voorkeure te onthou (tema, taal)</li>
  <li>U te beskerm teen CSRF (kruiswerf-versoeksvervalsing) aanvalle</li>
  <li>Te ontleed hoe gebruikers met ons Platform omgaan om dit te verbeter</li>
  <li>Die doeltreffendheid van ons bemarkingsveldtogte te meet</li>
  <li>Relevante inhoud en aanbevelings te verskaf</li>
</ul>`
        },
        {
          id: 'types-of-cookies',
          heading: '4. Soorte Koekies Wat Ons Gebruik',
          content: `<table class="cookie-table">
  <thead>
    <tr><th>Kategorie</th><th>Beskrywing</th><th>Regsbasis</th><th>Toestemming Vereis</th></tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Noodsaaklik</strong></td>
      <td>Vereis vir die Platform om te funksioneer. Sluit verifikasieskyfies, sekuriteitskoekies en sessiebestuur in.</td>
      <td>Wettige belang / Kontrak</td>
      <td>Nee — altyd aktief</td>
    </tr>
    <tr>
      <td><strong>Funksioneel</strong></td>
      <td>Verbeter u ervaring deur voorkeure soos tema (lig/donker) en taal te onthou.</td>
      <td>Toestemming</td>
      <td>Ja</td>
    </tr>
    <tr>
      <td><strong>Analise</strong></td>
      <td>Help ons verstaan hoe gebruikers die Platform gebruik. Ons gebruik Google Analytics om geanonimiseerde gebruiksstatistieke in te samel.</td>
      <td>Toestemming</td>
      <td>Ja</td>
    </tr>
    <tr>
      <td><strong>Prestasie</strong></td>
      <td>Monitor platformspoed en beskikbaarheid. Gebruik vir foutopsporing en prestasieoptimiering.</td>
      <td>Toestemming</td>
      <td>Ja</td>
    </tr>
    <tr>
      <td><strong>Bemarking</strong></td>
      <td>Gebruik om geteikende kommunikasie te lewer en veldtogdoeltreffendheid te meet.</td>
      <td>Toestemming</td>
      <td>Ja</td>
    </tr>
  </tbody>
</table>`
        },
        {
          id: 'specific-cookies',
          heading: '5. Spesifieke Koekies Wat Ons Gebruik',
          content: `<table class="cookie-table">
  <thead>
    <tr><th>Koekie Naam</th><th>Kategorie</th><th>Doel</th><th>Duur</th></tr>
  </thead>
  <tbody>
    <tr><td>fw_session</td><td>Noodsaaklik</td><td>Gebruikerssessiebestuur</td><td>Sessie</td></tr>
    <tr><td>fw_csrf</td><td>Noodsaaklik</td><td>CSRF-beskermingskyfie</td><td>Sessie</td></tr>
    <tr><td>fw_auth</td><td>Noodsaaklik</td><td>JWT-verifikasieskyfie (gestoor in geheue/plaaslike stoor)</td><td>7 dae</td></tr>
    <tr><td>fw_cookieconsent</td><td>Noodsaaklik</td><td>Stoor u koekietoestemmingsvoorkeure</td><td>12 maande</td></tr>
    <tr><td>_ga</td><td>Analise</td><td>Google Analytics unieke besoekersidentifiseerder</td><td>2 jaar</td></tr>
    <tr><td>_gid</td><td>Analise</td><td>Google Analytics sessie-identifiseerder</td><td>24 uur</td></tr>
    <tr><td>_gat</td><td>Analise</td><td>Google Analytics versoekvertraging</td><td>1 minuut</td></tr>
    <tr><td>fw_lang</td><td>Funksioneel</td><td>Taalvoorkeur</td><td>12 maande</td></tr>
    <tr><td>fw_theme</td><td>Funksioneel</td><td>Lig/donker tema voorkeur</td><td>12 maande</td></tr>
  </tbody>
</table>`
        },
        {
          id: 'cookie-consent',
          heading: '6. Koekietoestemming',
          content: `<p>Wanneer u die Platform vir die eerste keer besoek, sal u 'n koekietoestemmingsbanner sien. U kan:</p>
<ul>
  <li><strong>Alles Aanvaar:</strong> Laat alle kategorieë koekies toe</li>
  <li><strong>Alles Verwerp:</strong> Laat slegs noodsaaklike koekies toe</li>
  <li><strong>Voorkeure Stoor:</strong> Kies watter kategorieë om te aktiveer of te deaktiveer</li>
</ul>
<p>U kan u voorkeure te eniger tyd verander deur op "Koekieinstellings" in die voetteks te klik. U toestemming word met 'n tydstempel aangeteken en vir 12 maande gestoor, waarna u weer gevra sal word.</p>`,
          callout: 'U kan u koekievoorkeure te eniger tyd opdateer via die "Koekieinstellings"-skakel in die voetteks van elke bladsy.',
          calloutType: 'info'
        },
        {
          id: 'manage-cookies',
          heading: '7. Hoe om Koekies te Bestuur en uit te Skakel',
          content: `<p>Benewens die gebruik van ons koekiebanner, kan u koekies beheer deur u blaaierinstellings:</p>
<ul>
  <li><strong>Chrome:</strong> Instellings → Privaatheid en sekuriteit → Koekies en ander webwerf-data</li>
  <li><strong>Firefox:</strong> Opsies → Privaatheid en sekuriteit → Koekies en webwerf-data</li>
  <li><strong>Safari:</strong> Voorkeure → Privaatheid → Bestuur webwerf-data</li>
  <li><strong>Edge:</strong> Instellings → Koekies en webwerftoestemmings → Koekies en webwerf-data</li>
</ul>
<p>Let asseblief op dat die uitskakel van noodsaaklike koekies u sal verhinder om aan te meld en kernplatformkenmerke te gebruik.</p>`
        },
        {
          id: 'cookies-and-personal-info',
          heading: '8. Koekies en Persoonlike Inligting',
          content: `<p>Sommige koekies kan persoonlike inligting insamel (soos u IP-adres of gebruikersidentifiseerder). Waar dit gebeur, verwerk ons daardie inligting in ooreenstemming met ons <a routerLink="/legal/privacy-policy">Privaatheidsbeleid</a> en die POPI-Wet.</p>`
        },
        {
          id: 'do-not-track',
          heading: '9. Moenie Opspoor Nie',
          content: `<p>Sommige blaaiers sluit 'n "Moenie Opspoor" (DNT)-funksie in. Ons reageer tans nie op DNT-seine nie omdat daar geen bedryfsstandaard is vir hoe DNT-seine geïnterpreteer moet word nie. Ons staatmaak op ons koekietoestemmingstelsel om u voorkeure te eerbiedig.</p>`
        },
        {
          id: 'changes',
          heading: '10. Wysigings aan Hierdie Beleid',
          content: `<p>Ons kan hierdie Koekiebeleid van tyd tot tyd opdateer om veranderinge in tegnologie of wetlike vereistes te weerspieël. Ons sal u in kennis stel van wesenlike veranderinge deur die Platform of per e-pos. Die huidige weergawe en datum word altyd bo-aan hierdie dokument vertoon.</p>`
        },
        {
          id: 'contact',
          heading: '11. Kontak Ons',
          content: `<p>As u enige vrae het oor ons gebruik van koekies, kontak ons asseblief by <a href="mailto:privacy@freework.co.za">privacy@freework.co.za</a>.</p>`
        }
      ]
    },

    'freelancer-terms': {
      title: 'Vryskutterbepalings en -voorwaardes',
      version: '1.0',
      effectiveDate: '1 Januarie 2025',
      lastUpdated: '1 Januarie 2025',
      sections: [
        {
          id: 'definitions',
          heading: '1. Definisies',
          content: `<p>In hierdie Bepalings en Voorwaardes:</p>
<ul>
  <li><strong>"Platform"</strong> beteken die Freework-webwerf en -toepassing by freework.co.za</li>
  <li><strong>"Freework"</strong> beteken Freework (Edms) Bpk, 'n maatskappy geregistreer in Suid-Afrika</li>
  <li><strong>"Vryskutter"</strong> beteken u, 'n geregistreerde gebruiker wat dienste op die Platform aanbied</li>
  <li><strong>"Besigheid"</strong> of <strong>"Kliënt"</strong> beteken 'n geregistreerde gebruiker wat vryskutters wil huur</li>
  <li><strong>"Projek"</strong> beteken 'n spesifieke werk of taak geplaas deur 'n Besigheid en aanvaar deur 'n Vryskutter</li>
  <li><strong>"Ooreenkoms"</strong> beteken hierdie Bepalings en Voorwaardes saam met die Privaatheidsbeleid en Koekiebeleid</li>
  <li><strong>"Gelde"</strong> beteken die bedrae betaalbaar vir dienste gelewer deur die Platform</li>
  <li><strong>"Platformgeld"</strong> beteken die diensfooi gehef deur Freework vir die fasilitering van transaksies</li>
</ul>`
        },
        {
          id: 'registration',
          heading: '2. Registrasie en Geskiktheid',
          content: `<p>Om as 'n Vryskutter op die Platform te registreer, moet u:</p>
<ul>
  <li>Ten minste 18 jaar oud wees</li>
  <li>Wettiglik geregtig wees om te werk en dienste in Suid-Afrika of u toepaslike jurisdiksie te lewer</li>
  <li>Akkurate, huidige en volledige inligting tydens registrasie verskaf</li>
  <li>Hierdie Bepalings en Voorwaardes en ons Privaatheidsbeleid aanvaar</li>
  <li>U e-posadres verifieer</li>
  <li>Nie voorheen van die Platform verban of opgeskort gewees het nie</li>
</ul>
<p>U is verantwoordelik vir die handhawing van die vertroulikheid van u rekeningbewyse en vir alle aktiwiteit wat onder u rekening plaasvind.</p>`
        },
        {
          id: 'independent-contractor',
          heading: '3. Onafhanklike Kontrakteurstatus',
          content: `<p>U erken en stem saam dat:</p>
<ul>
  <li>U 'n onafhanklike kontrakteur is, nie 'n werknemer, agent of vennoot van Freework of enige Besigheid op die Platform nie</li>
  <li>U alleen verantwoordelik is vir u eie belastingverpligtinge, insluitend inkomstebelasting en BTW-registrasie waar van toepassing</li>
  <li>Freework nie PAYE, WVF of enige ander indiensneming-verwante aftrekkings van betalings aan u weerhou nie</li>
  <li>U verantwoordelik is vir u eie beroepsaanspreeklikheidversekering en ander toepaslike dekking</li>
  <li>U die reg het om gelyktydig vir verskeie kliënte te werk, tensy 'n spesifieke ooreenkoms met 'n Besigheid dit beperk</li>
</ul>`,
          callout: "BELANGRIK: U is 'n onafhanklike kontrakteur. Freework is 'n markplek, nie u werkgewer nie. U is verantwoordelik vir u eie belasting en nakoming.",
          calloutType: 'warning'
        },
        {
          id: 'platform-use',
          heading: '4. Platformgebruik',
          content: `<p>Wanneer u die Platform gebruik, stem u in om:</p>
<ul>
  <li>Eerlike, akkurate inligting oor u vaardighede, ervaring en kwalifikasies te verskaf</li>
  <li>U identiteit of professionele geloofsbriewe nie te verdraai nie</li>
  <li>Op Besigheidsnavrae en -boodskappe tydig en professioneel te reageer</li>
  <li>Nie met Besighede buite die Platform te kommunikeer met die doel om Platformgelde te vermy ("Geldontduiking") nie</li>
  <li>Nie verskeie rekeninge te skep of u rekening met ander te deel nie</li>
  <li>Nie vals resensies te plaas of die graderingstelsel te manipuleer nie</li>
  <li>Alle toepaslike Suid-Afrikaanse wette na te kom, insluitend die Verbruikersbeskermingwet en die POPI-Wet</li>
</ul>`
        },
        {
          id: 'projects',
          heading: '5. Projekte en Lewerbare',
          content: `<p>Wanneer u 'n Projek aanvaar:</p>
<ul>
  <li>Verbind u u om die ooreengekome werk te lewer tot die standaard beskryf in die Projekopdrag</li>
  <li>Moet u duidelik en stiptelik met die Besigheid kommunikeer deur die hele Projek</li>
  <li>Moet u die Besigheid onmiddellik in kennis stel as u enige vertragings of probleme voorsien</li>
  <li>Lewerbare moet u eie oorspronklike werk wees tensy anders skriftelik ooreengekom</li>
  <li>U waarborg dat u werk nie die intellektuele eiendomsregte van enige derde party sal skend nie</li>
  <li>Die Besigheid kan lewerbare verwerp wat nie aan die ooreengekome spesifikasies voldoen nie, en u sal 'n redelike geleentheid kry om dit reg te stel</li>
</ul>`
        },
        {
          id: 'intellectual-property',
          heading: '6. Intellektuele Eiendom',
          content: `<p>Tensy uitdruklik anders skriftelik ooreengekom tussen u en die Besigheid:</p>
<ul>
  <li>By ontvangs van volle betaling, dra alle intellektuele eiendomsregte in lewerbare geskep vir 'n spesifieke Besigheid oor na daardie Besigheid</li>
  <li>U behou eienaarskap van u algemene metodologie, kennis, instrumente en bestaande materiale</li>
  <li>U verleen aan die Besigheid 'n nie-eksklusiewe, royalty-vrye lisensie om enige agtergrond-IE wat in die lewerbare opgeneem is, te gebruik</li>
  <li>U mag geanonimiseerde beskrywings van voltooide projekte in u portefeulje insluit tensy die Besigheid vertroulikheid versoek</li>
</ul>`
        },
        {
          id: 'payments',
          heading: '7. Betalings en Gelde',
          content: `<p>Betalingsreëlings:</p>
<ul>
  <li>Betalings word verwerk deur PayFast en is onderhewig aan PayFast se bepalings en voorwaardes</li>
  <li>Freework hef 'n Platformgeld op alle transaksies. Die huidige geldeskema is beskikbaar op die priysblad.</li>
  <li>Betaling aan Vryskutters word vrygestel by die Besigheid se bevestiging van bevredigende voltooiing, of outomaties na 14 dae as geen geskil geopper word nie</li>
  <li>Freework bedryf 'n esproostelsel — fondse word veilig gehou totdat werk bevestig volledig is</li>
  <li>By 'n terugbetaling behou Freework die reg voor om enige betalingverwerkingsgelde wat nie teruggevorder kan word nie, af te trek</li>
  <li>Betalings word in Suid-Afrikaanse Rand (ZAR) gedoen</li>
</ul>`
        },
        {
          id: 'subscriptions',
          heading: '8. Intekeninge',
          content: `<p>Freework bied gelaagde intekenplanne aan:</p>
<ul>
  <li><strong>Gratis Plan (R0/maand):</strong> Beperkte aansoeke per maand</li>
  <li><strong>Groei-plan (R299/maand):</strong> Verhoogde aansoeklimiete en verbeterde profielsigarheid</li>
  <li><strong>Skaal-plan (R799/maand):</strong> Onbeperkte aansoeke, prioriteitslysting en premium ondersteuning</li>
</ul>
<p>Intekeninge word maandeliks in rekening gebring. U kan u intekening te eniger tyd kanselleer en sal toegang tot u betaalde vlak behou tot die einde van die huidige faktuurperiode. Geen gedeeltelike terugbetalings word verskaf nie.</p>`
        },
        {
          id: 'ratings',
          heading: '9. Graderings en Resensies',
          content: `<p>Die Platform sluit 'n graderings- en resensiestelsel in:</p>
<ul>
  <li>Beide Vryskutters en Besighede kan resensies laat na projekvoltooiing</li>
  <li>Resensies moet eerlik en gebaseer op werklike werkervaring wees</li>
  <li>Freework behou die reg voor om resensies te verwyder wat ons gemeenskapstandaarde skend</li>
  <li>Die poging om graderings te manipuleer deur vals resensies, omkoopery of dwang is 'n skending van hierdie Bepalings en kan lei tot rekeningopskorting</li>
</ul>`
        },
        {
          id: 'disputes',
          heading: '10. Geskilbeslegting',
          content: `<p>In die geval van 'n geskil tussen 'n Vryskutter en 'n Besigheid:</p>
<ul>
  <li>Beide partye word aangemoedig om die geskil direk in die eerste geval op te los</li>
  <li>As direkte oplossing misluk, kan enige party 'n formele geskil by Freework indien by support@freework.co.za</li>
  <li>Freework sal 'n oorsig van die gelewerde bewyse uitvoer en 'n bepaling binne 15 besigheidsdae maak</li>
  <li>Freework se bepaling is finaal en bindend ten opsigte van Platformsake, maar raak nie u regte om regsmiddele na te streef nie</li>
  <li>Waar fondse in bewaring gehou word, sal Freework nie betaling vrystel totdat die geskil opgelos is nie</li>
</ul>`
        },
        {
          id: 'confidentiality',
          heading: '11. Vertroulikheid',
          content: `<p>U stem saam om:</p>
<ul>
  <li>Alle nie-openbare inligting openbaar deur 'n Besigheid tydens 'n Projek vertroulik te hou</li>
  <li>Vertroulike inligting slegs vir die doeleindes van die voltooiing van die Projek te gebruik</li>
  <li>Vertroulike inligting nie aan derde partye te openbaar sonder die Besigheid se skriftelike toestemming nie</li>
  <li>Hierdie verpligtinge oorleef die beëindiging van enige Projek of u rekening</li>
</ul>`
        },
        {
          id: 'termination',
          heading: '12. Beëindiging',
          content: `<p>Freework kan u rekening opskort of beëindig as u:</p>
<ul>
  <li>Hierdie Bepalings en Voorwaardes skend</li>
  <li>Bedrieglike, onwettige of beledigende gedrag openbaar</li>
  <li>Aanhoudend swak graderings ontvang wat vertroue op die Platform skaad</li>
  <li>Poog om Platformgelde te ontduik</li>
</ul>
<p>U kan u rekening te eniger tyd van u Instellingsblad beëindig. Beëindiging hou nie enige verpligtinge wat uit lopende Projekte voortspruit, uit nie.</p>`
        },
        {
          id: 'liability',
          heading: '13. Beperking van Aanspreeklikheid',
          content: `<p>In die maksimum mate toegelaat deur Suid-Afrikaanse reg:</p>
<ul>
  <li>Freework is 'n markplekfasiliteerder en is nie aanspreeklik vir die aksies, nalatings of werkkwaliteit van enige Vryskutter of Besigheid nie</li>
  <li>Freework se totale aanspreeklikheid teenoor u vir enige eis sal nie die totale Platformgelde betaal deur of aan u in die 12 maande voor die eis oorskry nie</li>
  <li>Freework is nie aanspreeklik vir indirekte, toevallige, gevolglike of straffende skade nie</li>
  <li>Niks in hierdie Bepalings beperk aanspreeklikheid vir bedrog, growwe nalatigheid, of soos deur wet verbied nie</li>
</ul>`
        },
        {
          id: 'indemnity',
          heading: '14. Skadeloosstelling',
          content: `<p>U stel Freework, sy direkteure, werknemers en agente skadeloos teen alle eise, verliese, skade en uitgawes (insluitend regskoste) wat voortspruit uit u gebruik van die Platform, skending van hierdie Bepalings, skending van derde-party regte, of belastingnie-nakoming.</p>`
        },
        {
          id: 'governing-law',
          heading: '15. Geldende Reg',
          content: `<p>Hierdie Bepalings en Voorwaardes word geregeer deur die wette van die Republiek van Suid-Afrika. Enige geskille sal onderhewig wees aan die eksklusiewe jurisdiksie van die Suid-Afrikaanse howe, spesifiek die howe van [Stad] wat jurisdiksie het.</p>`
        },
        {
          id: 'general',
          heading: '16. Algemene Bepalings',
          content: `<ul>
  <li><strong>Volledige Ooreenkoms:</strong> Hierdie Bepalings, saam met die Privaatheidsbeleid en Koekiebeleid, is die volledige ooreenkoms tussen u en Freework</li>
  <li><strong>Skeidbaarheid:</strong> As enige bepaling ongeldig of nie-afdwingbaar bevind word, bly die oorblywende bepalings volledig van krag</li>
  <li><strong>Geen Verstandhouding:</strong> Versuim om enige bepaling af te dwing, verander nie Freework se reg om dit in die toekoms af te dwing nie</li>
  <li><strong>Toekenning:</strong> U kan u regte onder hierdie Bepalings nie sonder Freework se skriftelike toestemming oordra nie</li>
  <li><strong>Wysigings:</strong> Freework kan hierdie Bepalings te eniger tyd wysig deur bygewerkte Bepalings op die Platform te plaas. Voortgesette gebruik na die ingangsdatum verteenwoordig aanvaarding.</li>
</ul>`
        },
        {
          id: 'contact',
          heading: '17. Kontakinligting',
          content: `<ul>
  <li><strong>Algemene navrae:</strong> <a href="mailto:hello@freework.co.za">hello@freework.co.za</a></li>
  <li><strong>Privaatheid en dataversoeke:</strong> <a href="mailto:privacy@freework.co.za">privacy@freework.co.za</a></li>
  <li><strong>Geskille:</strong> <a href="mailto:support@freework.co.za">support@freework.co.za</a></li>
</ul>`
        }
      ]
    },

    'business-terms': {
      title: 'Besigheidsbepalings en -voorwaardes',
      version: '1.0',
      effectiveDate: '1 Januarie 2025',
      lastUpdated: '1 Januarie 2025',
      sections: [
        {
          id: 'definitions',
          heading: '1. Definisies',
          content: `<p>In hierdie Bepalings en Voorwaardes:</p>
<ul>
  <li><strong>"Platform"</strong> beteken die Freework-webwerf en -toepassing by freework.co.za</li>
  <li><strong>"Freework"</strong> beteken Freework (Edms) Bpk, 'n maatskappy geregistreer in Suid-Afrika</li>
  <li><strong>"Besigheid"</strong> of <strong>"Kliënt"</strong> beteken u, 'n geregistreerde gebruiker wat vryskutters wil huur</li>
  <li><strong>"Vryskutter"</strong> beteken 'n geregistreerde gebruiker wat dienste op die Platform aanbied</li>
  <li><strong>"Projek"</strong> beteken 'n spesifieke werk of taak wat u op die Platform plaas</li>
  <li><strong>"Ooreenkoms"</strong> beteken hierdie Bepalings en Voorwaardes saam met die Privaatheidsbeleid en Koekiebeleid</li>
  <li><strong>"Platformgeld"</strong> beteken die diensfooi gehef deur Freework vir die fasilitering van transaksies</li>
</ul>`
        },
        {
          id: 'registration',
          heading: '2. Registrasie en Geskiktheid',
          content: `<p>Om as 'n Besigheid op die Platform te registreer, moet u:</p>
<ul>
  <li>Ten minste 18 jaar oud wees, of as u namens 'n maatskappy registreer, behoorlik gemagtig wees om daardie maatskappy te bind</li>
  <li>Akkurate, huidige en volledige registrasieinligting verskaf, insluitend maatskappybesonderhede waar van toepassing</li>
  <li>Hierdie Bepalings en Voorwaardes en ons Privaatheidsbeleid aanvaar</li>
  <li>U e-posadres verifieer</li>
  <li>Nie voorheen van die Platform verban of opgeskort gewees het nie</li>
</ul>
<p>Deur 'n maatskappyrekening te registreer, verklaar en waarborg u dat u die bevoegdheid het om die maatskappy aan hierdie Bepalings te bind.</p>`
        },
        {
          id: 'posting-jobs',
          heading: '3. Die Plaas van Werksgeleenthede',
          content: `<p>Wanneer u 'n werk op die Platform plaas, stem u in om:</p>
<ul>
  <li>Akkurate, volledige en eerlike werksbeskrywings te verskaf</li>
  <li>Nie werksgeleenthede vir onwettige dienste of aktiwiteite te plaas nie</li>
  <li>Nie werksgeleenthede te plaas wat onregmatig diskrimineer op grond van ras, geslag, ouderdom, godsdiens, gestremdheid of enige ander beskermde kenmerk ingevolge die Wet op Gelyke Indiensneming nie</li>
  <li>Nie werksgeleentheidsplasings te gebruik om persoonlike inligting te versoek bo wat nodig is vir die Projek nie</li>
  <li>Op Vryskutteraansoeke tydig en professioneel te reageer</li>
  <li>Nie werksgeleenthede te herplaas slegs om betaling vir voltooide werk te vermy nie</li>
</ul>`
        },
        {
          id: 'payments',
          heading: '4. Betalings',
          content: `<p>Alle betalings op die Platform word verwerk deur <strong>PayFast</strong>. Die volgende betalingsmetodes word aanvaar:</p>
<ul>
  <li>Krediet- en Debietkaarte (Visa, Mastercard)</li>
  <li>Onmiddellike EFT (via PayFast)</li>
  <li>Mobicred</li>
  <li>SnapScan</li>
</ul>
<p>Betalingsproses:</p>
<ul>
  <li>Betaling word vooraf vereis wanneer u 'n Projek aan 'n Vryskutter toeken</li>
  <li>Fondse word in bewaring gehou deur Freework totdat u bevredigende voltooiing bevestig</li>
  <li>Betaling word vrygestel aan die Vryskutter by u bevestiging, of outomaties na 14 dae as geen geskil geopper word nie</li>
  <li>Freework hef 'n Platformgeld op transaksies. Die huidige geldeskema is beskikbaar op die priysblad.</li>
  <li>Alle pryse is in Suid-Afrikaanse Rand (ZAR) en is inklusief BTW waar van toepassing</li>
</ul>`,
          callout: 'Betalings word deur PayFast-bewaring beveilig. Fondse word slegs vrygestel aan Vryskutters wanneer u bevestig dat die werk voltooi is.',
          calloutType: 'info'
        },
        {
          id: 'prohibited-conduct',
          heading: '5. Verbode Gedrag',
          content: `<p>U mag nie:</p>
<ul>
  <li>Met Vryskutters buite die Platform kommunikeer met die doel om Platformgelde te vermy ("Geldontduiking") nie</li>
  <li>Weier om te betaal vir werk wat tot die ooreengekome spesifikasie voltooi is nie</li>
  <li>Die Platform gebruik om Vryskutters vir direkte indiensneming in ontduiking van die Platform te werf nie</li>
  <li>Vals resensies plaas of die graderingstelsel manipuleer nie</li>
  <li>U rekeningbewyse met ander deel nie</li>
  <li>Outomatiese instrumente gebruik om die Platform sonder magtiging te skraap of te betree nie</li>
  <li>Betrokke raak by enige gedrag wat Suid-Afrikaanse reg of Freework se gemeenskapstandaarde skend nie</li>
</ul>`
        },
        {
          id: 'subscriptions',
          heading: '6. Intekeninge',
          content: `<p>Freework bied die volgende intekenningsvlakke vir Besighede aan:</p>
<table class="cookie-table">
  <thead><tr><th>Plan</th><th>Prys</th><th>Aktiewe Werkslysings</th><th>Kenmerke</th></tr></thead>
  <tbody>
    <tr><td><strong>Gratis</strong></td><td>R0/maand</td><td>Tot 3</td><td>Basiese lysings, standaard ondersteuning</td></tr>
    <tr><td><strong>Groei</strong></td><td>R299/maand</td><td>Tot 15</td><td>Uitgeligte lysings, prioriteit ondersteuning</td></tr>
    <tr><td><strong>Skaal</strong></td><td>R799/maand</td><td>Onbeperk</td><td>Topplasing, toegewyde ondersteuning, analise</td></tr>
  </tbody>
</table>
<p>Intekeninge word maandeliks in rekening gebring. U kan te eniger tyd kanselleer en sal toegang tot u betaalde vlak behou tot die einde van die huidige faktuurperiode.</p>`
        },
        {
          id: 'intellectual-property',
          heading: '7. Intellektuele Eiendom',
          content: `<p>By volle betaling van 'n Projek:</p>
<ul>
  <li>Ontvang u eienaarskap van alle lewerbare spesifiek geskep vir u Projek, tensy anders skriftelik ooreengekom</li>
  <li>Die Vryskutter behou eienaarskap van hul bestaande instrumente, metodologieë en agtergrond-IE</li>
  <li>U verleen aan Freework 'n nie-eksklusiewe lisensie om Projekbeskrywings vir Platformbemarkingsdoeleindes te vertoon</li>
  <li>U waarborg dat enige materiale, opdragte of derde-party inhoud wat u aan Vryskutters verskaf geen intellektuele eiendomsregte skend nie</li>
</ul>`
        },
        {
          id: 'confidentiality',
          heading: '8. Vertroulikheid en Databeskerming',
          content: `<p>Waar u vertroulike besigheidsinligting met Vryskutters deur die Platform deel:</p>
<ul>
  <li>Behoort u die Platform se ingeboude NDA-funksionaliteit vir sensitiewe Projekte te gebruik</li>
  <li>Freework kan nie vertroulikheidsverpligtinge tussen u en Vryskutters afdwing nie, maar skending van vertroulikheid kan lei tot rekeningopskorting</li>
  <li>U is verantwoordelik om te verseker dat u gebruik van die Platform aan die POPI-Wet voldoen waar u persoonlike inligting van derde partye verwerk</li>
</ul>`
        },
        {
          id: 'disputes',
          heading: '9. Geskilbeslegting',
          content: `<p>In die geval van 'n geskil met 'n Vryskutter:</p>
<ul>
  <li>Beide partye word aangemoedig om die geskil direk op te los</li>
  <li>As direkte oplossing misluk, kan enige party 'n formele geskil by Freework indien by support@freework.co.za</li>
  <li>Freework sal alle bewyse hersien en 'n bepaling binne 15 besigheidsdae maak</li>
  <li>Freework se bepaling is finaal ten opsigte van Platformsake</li>
  <li>Bewaringsfondse sal nie vrygestel word totdat die geskil opgelos is nie</li>
</ul>`
        },
        {
          id: 'freelancer-independence',
          heading: '10. Vryskuttersonafhanklikheid',
          content: `<p>U erken en stem saam dat:</p>
<ul>
  <li>Vryskutters op die Platform onafhanklike kontrakteurs is, nie werknemers van Freework of u besigheid nie</li>
  <li>U nie verplig is om aan Vryskutters indiensnemingsvoordele te verskaf, insluitend verlof, WVF of mediese hulp nie</li>
  <li>Indien u betrokkenheid by 'n Vryskutter egter 'n diensverhouding ingevolge Suid-Afrikaanse reg skep (soos bepaal deur die Arbeidshof of KVBA), dra U alleen verantwoordelikheid vir daardie verhouding</li>
  <li>U verantwoordelik is vir die bepaling van die belastingbehandeling van betalings aan Vryskutters, veral ten opsigte van Artikel 83A van die Inkomstebelastingwet</li>
</ul>`,
          callout: "BELANGRIK: As u gebruik van 'n Vryskutter 'n diensverhouding skep ingevolge Suid-Afrikaanse arbeidsreg, dra U — nie Freework nie — volle verantwoordelikheid vir daardie verhouding, insluitend alle verpligtinge ingevolge die Wet op Arbeidsverhoudinge en die Wet op Basiese Diensvoorwaardes.",
          calloutType: 'warning'
        },
        {
          id: 'ratings',
          heading: '11. Graderings en Resensies',
          content: `<p>Die Platform sluit 'n tweerigting-graderings- en resensiestelsel in:</p>
<ul>
  <li>U kan 'n resensie vir 'n Vryskutter laat na projekvoltooiing</li>
  <li>Vryskutters kan 'n resensie vir u laat na projekvoltooiing</li>
  <li>Resensies moet eerlik en gebaseer op werklike werkervaring wees</li>
  <li>Freework behou die reg voor om resensies te verwyder wat gemeenskapstandaarde skend</li>
</ul>`
        },
        {
          id: 'liability',
          heading: '12. Beperking van Aanspreeklikheid',
          content: `<p>In die maksimum mate toegelaat deur Suid-Afrikaanse reg:</p>
<ul>
  <li>Freework is 'n markplekfasiliteerder en is nie aanspreeklik vir die kwaliteit, tydigheid of geskiktheid vir doel van Vryskutterwerk nie</li>
  <li>Freework se totale aanspreeklikheid sal nie die totale Platformgelde betaal deur u in die 12 maande voor die eis oorskry nie</li>
  <li>Freework is nie aanspreeklik vir indirekte, toevallige, gevolglike of straffende skade nie</li>
  <li>Niks in hierdie Bepalings beperk aanspreeklikheid vir bedrog, growwe nalatigheid, of soos deur wet verbied nie</li>
</ul>`
        },
        {
          id: 'indemnity',
          heading: '13. Skadeloosstelling',
          content: `<p>U stel Freework, sy direkteure, werknemers en agente skadeloos teen alle eise, verliese, skade en uitgawes (insluitend regskoste) wat voortspruit uit u gebruik van die Platform, skending van hierdie Bepalings, skending van derde-party intellektuele eiendomsregte, wanklassifikasie van werkers, of nie-nakoming van toepaslike reg.</p>`
        },
        {
          id: 'termination',
          heading: '14. Beëindiging',
          content: `<p>Freework kan u rekening opskort of beëindig as u:</p>
<ul>
  <li>Hierdie Bepalings en Voorwaardes skend</li>
  <li>Bedrieglike, onwettige of beledigende gedrag openbaar</li>
  <li>Aanhoudend versuim om Vryskutters te betaal vir voltooide werk</li>
  <li>Poog om Platformgelde te ontduik</li>
</ul>
<p>U kan u rekening te eniger tyd van u Instellingsblad beëindig. U bly aanspreeklik vir betaling vir enige Projekte toegeken maar nog nie voltooig ten tye van beëindiging nie.</p>`
        },
        {
          id: 'general',
          heading: '15. Algemene Bepalings',
          content: `<ul>
  <li><strong>Volledige Ooreenkoms:</strong> Hierdie Bepalings, saam met die Privaatheidsbeleid en Koekiebeleid, is die volledige ooreenkoms</li>
  <li><strong>Skeidbaarheid:</strong> As enige bepaling ongeldig of nie-afdwingbaar is, bly die oorblywende bepalings voort</li>
  <li><strong>Geen Verstandhouding:</strong> Versuim om enige bepaling af te dwing, verander nie toekomstige afdwinging nie</li>
  <li><strong>Toekenning:</strong> U kan u regte nie sonder Freework se skriftelike toestemming oordra nie</li>
  <li><strong>Wysigings:</strong> Freework kan hierdie Bepalings te eniger tyd met kennisgewing wysig. Voortgesette gebruik verteenwoordig aanvaarding.</li>
</ul>`
        },
        {
          id: 'governing-law',
          heading: '16. Geldende Reg',
          content: `<p>Hierdie Bepalings word geregeer deur die wette van die Republiek van Suid-Afrika. Geskille is onderhewig aan die eksklusiewe jurisdiksie van die Suid-Afrikaanse howe.</p>`
        },
        {
          id: 'contact',
          heading: '17. Kontakinligting',
          content: `<ul>
  <li><strong>Algemene navrae:</strong> <a href="mailto:hello@freework.co.za">hello@freework.co.za</a></li>
  <li><strong>Privaatheid en dataversoeke:</strong> <a href="mailto:privacy@freework.co.za">privacy@freework.co.za</a></li>
  <li><strong>Geskille en ondersteuning:</strong> <a href="mailto:support@freework.co.za">support@freework.co.za</a></li>
</ul>`
        }
      ]
    }
  }
};
