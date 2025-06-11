import React from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt } from 'react-icons/fa';
import './PrivacyPolicyPage.css';

const PrivacyPolicyPage = () => {
  return (
    <div className="privacy-policy-page">
      <motion.div 
        className="privacy-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="privacy-header">
          <FaShieldAlt className="privacy-icon" />
          <h1>Privacy Policy</h1>
          <p className="last-updated">Last Updated: June 11, 2025</p>
        </div>
        
        <div className="privacy-content">
          <section className="policy-section">
            <h2>1. Introduction</h2>
            <p>
              Welcome to Fund Compass. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy will inform you about how we look after your personal data when you visit our website 
              and tell you about your privacy rights and how the law protects you.
            </p>
            <p>
              This privacy policy applies to all information collected through our website, as well as any related services, 
              sales, marketing, or events.
            </p>
          </section>
          
          <section className="policy-section">
            <h2>2. Information We Collect</h2>
            <p>
              We collect several different types of information for various purposes to provide and improve our service to you:
            </p>
            <h3>2.1 Personal Data</h3>
            <p>
              While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. Personally identifiable information may include, but is not limited to:
            </p>
            <ul>
              <li>Email address</li>
              <li>First name and last name</li>
              <li>Cookies and Usage Data</li>
            </ul>
            
            <h3>2.2 Usage Data</h3>
            <p>
              We may also collect information on how the Service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.
            </p>
          </section>
          
          <section className="policy-section">
            <h2>3. How We Use Your Information</h2>
            <p>
              Fund Compass uses the collected data for various purposes:
            </p>
            <ul>
              <li>To provide and maintain our Service</li>
              <li>To notify you about changes to our Service</li>
              <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information so that we can improve our Service</li>
              <li>To monitor the usage of our Service</li>
              <li>To detect, prevent and address technical issues</li>
            </ul>
          </section>
          
          <section className="policy-section">
            <h2>4. Data Retention</h2>
            <p>
              We will retain your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your Personal Data to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies.
            </p>
            <p>
              We will also retain Usage Data for internal analysis purposes. Usage Data is generally retained for a shorter period of time, except when this data is used to strengthen the security or to improve the functionality of our Service, or we are legally obligated to retain this data for longer time periods.
            </p>
          </section>
          
          <section className="policy-section">
            <h2>5. Data Security</h2>
            <p>
              The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
            </p>
          </section>
          
          <section className="policy-section">
            <h2>6. Cookies</h2>
            <p>
              Cookies are files with a small amount of data which may include an anonymous unique identifier. Cookies are sent to your browser from a website and stored on your device. We use cookies to collect information in order to improve our services for you.
            </p>
            <p>
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
            </p>
          </section>
          
          <section className="policy-section">
            <h2>7. Your Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, such as:
            </p>
            <ul>
              <li>The right to access, update or delete the information we have on you</li>
              <li>The right of rectification - the right to have your information corrected if it is inaccurate or incomplete</li>
              <li>The right to object - the right to object to our processing of your Personal Data</li>
              <li>The right of restriction - the right to request that we restrict the processing of your personal information</li>
              <li>The right to data portability - the right to be provided with a copy of the information we have on you in a structured, machine-readable and commonly used format</li>
              <li>The right to withdraw consent - the right to withdraw your consent at any time where we relied on your consent to process your personal information</li>
            </ul>
          </section>
          
          <section className="policy-section">
            <h2>8. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy.
            </p>
            <p>
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>
          </section>
          
          <section className="policy-section">
            <h2>9. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <ul>
              <li>By email: shiladityabgohil@gmail.com</li>
              <li>By phone: +91 6352996626</li>
              <li>By mail: E34 Orchid Whitefield, Gujarat, IN 380051</li>
            </ul>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicyPage;