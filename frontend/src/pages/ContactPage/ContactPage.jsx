import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';
import './ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setSubmitStatus('submitting');
      
      // Simulate API call
      setTimeout(() => {
        // In a real app, you would send the form data to your backend
        console.log('Form submitted:', formData);
        setSubmitStatus('success');
        
        // Reset form after successful submission
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setSubmitStatus(null);
        }, 5000);
      }, 1500);
    }
  };
  
  return (
    <div className="contact-page">
      <motion.div 
        className="contact-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Contact Us</h1>
        <p className="contact-intro">
          Have questions about Fund Compass or need assistance? We're here to help!
          Fill out the form below or reach out to us directly using the contact information provided.
        </p>
        
        <div className="contact-content">
          <div className="contact-info">
            <h2>Get In Touch</h2>
            
            <div className="contact-method">
              <FaEnvelope className="contact-icon" />
              <div>
                <h3>Email Us</h3>
                <p>shiladityabgohil@gmail.com</p>
              </div>
            </div>
            
            <div className="contact-method">
              <FaPhone className="contact-icon" />
              <div>
                <h3>Call Us</h3>
                <p>+91 6352996626</p>
                <p>Monday-Friday, 9AM-5PM IST</p>
              </div>
            </div>
            
            <div className="contact-method">
              <FaMapMarkerAlt className="contact-icon" />
              <div>
                <h3>Visit Us</h3>
                <p>E34, Orchid Whitefield</p>
                <p>Ahmedabad</p>
                <p>Gujarat ,IN 380051</p>
              </div>
            </div>
          </div>
          
          <div className="contact-form-container">
            <h2>Send Us a Message</h2>
            
            {submitStatus === 'success' && (
              <div className="success-message">
                <p>Thank you for your message! We'll get back to you soon.</p>
              </div>
            )}
            
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? 'error' : ''}
                  disabled={submitStatus === 'submitting'}
                />
                {errors.name && <div className="error-message">{errors.name}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Your Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                  disabled={submitStatus === 'submitting'}
                />
                {errors.email && <div className="error-message">{errors.email}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={errors.subject ? 'error' : ''}
                  disabled={submitStatus === 'submitting'}
                />
                {errors.subject && <div className="error-message">{errors.subject}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className={errors.message ? 'error' : ''}
                  disabled={submitStatus === 'submitting'}
                ></textarea>
                {errors.message && <div className="error-message">{errors.message}</div>}
              </div>
              
              <button 
                type="submit" 
                className="submit-button"
                disabled={submitStatus === 'submitting'}
              >
                {submitStatus === 'submitting' ? (
                  <>
                    <div className="button-spinner"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="button-icon" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactPage;