// src/services/apiService.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.redixsolutions.pro';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.headers,
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Contact form submission
  async submitContactForm(formData) {
    return this.post('/contact', formData);
  }

  // Newsletter subscription
  async subscribeNewsletter(email) {
    return this.post('/newsletter/subscribe', { email });
  }

  // Get portfolio items
  async getPortfolio() {
    return this.get('/portfolio');
  }

  // Get testimonials
  async getTestimonials() {
    return this.get('/testimonials');
  }
}

export const apiService = new ApiService();
export default apiService;
