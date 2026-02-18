// src/services/emailService.js
import { apiService } from './apiService';

class EmailService {
  constructor() {
    this.templates = {
      contact: 'contact-form',
      newsletter: 'newsletter-welcome',
      quote: 'quote-request'
    };
  }

  async sendContactEmail(contactData) {
    try {
      const emailData = {
        to: 'contact@redixsolutions.pro',
        template: this.templates.contact,
        data: {
          name: contactData.name,
          email: contactData.email,
          phone: contactData.phone || '',
          service: contactData.service,
          message: contactData.message,
          timestamp: new Date().toISOString()
        }
      };

      const response = await apiService.post('/email/send', emailData);
      return response;
    } catch (error) {
      console.error('Failed to send contact email:', error);
      throw error;
    }
  }

  async sendQuoteRequest(quoteData) {
    try {
      const emailData = {
        to: 'quotes@redixsolutions.pro',
        template: this.templates.quote,
        data: {
          ...quoteData,
          timestamp: new Date().toISOString()
        }
      };

      const response = await apiService.post('/email/send', emailData);
      return response;
    } catch (error) {
      console.error('Failed to send quote request:', error);
      throw error;
    }
  }

  async subscribeToNewsletter(email) {
    try {
      const subscriptionData = {
        email,
        source: 'website',
        timestamp: new Date().toISOString()
      };

      const response = await apiService.post('/newsletter/subscribe', subscriptionData);
      
      // Send welcome email
      await this.sendWelcomeEmail(email);
      
      return response;
    } catch (error) {
      console.error('Failed to subscribe to newsletter:', error);
      throw error;
    }
  }

  async sendWelcomeEmail(email) {
    try {
      const emailData = {
        to: email,
        template: this.templates.newsletter,
        data: {
          email,
          timestamp: new Date().toISOString()
        }
      };

      return await apiService.post('/email/send', emailData);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      // Don't throw error here to not break newsletter subscription
    }
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validateContactForm(formData) {
    const errors = {};

    if (!formData.name || formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    }

    if (!formData.email || !this.validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.message || formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters long';
    }

    if (!formData.service) {
      errors.service = 'Please select a service';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}

export const emailService = new EmailService();
export default emailService;
