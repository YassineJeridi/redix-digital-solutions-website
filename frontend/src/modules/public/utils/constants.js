// src/utils/constants.js

// Company Information
export const COMPANY_INFO = {
  name: 'Redix Digital Solutions',
  tagline: 'Transform Your Digital Presence',
  description: 'We\'re a Tunisia-based digital solutions agency specializing in cutting-edge web development, mobile apps, and digital marketing.',
  founded: 2021,
  location: 'Smart Technopark Manouba, Tunisia',
  phone: '(+216) 21-999-898',
  email: 'contact@redixsolutions.pro',
  website: 'https://redixsolutions.pro'
};

// Contact Information
export const CONTACT_INFO = {
  address: {
    street: 'Smart Technopark Manouba',
    city: 'Manouba',
    country: 'Tunisia',
    full: 'Smart Technopark Manouba, Tunisia'
  },
  phone: {
    primary: '(+216) 21-999-898',
    formatted: '+216 21 999 898',
    international: '+21621999898'
  },
  email: {
    general: 'contact@redixsolutions.pro',
    support: 'support@redixsolutions.pro',
    sales: 'sales@redixsolutions.pro',
    careers: 'careers@redixsolutions.pro'
  },
  workingHours: {
    weekdays: '9:00 AM - 6:00 PM',
    weekend: 'Closed',
    timezone: 'GMT+1 (Tunisia Time)'
  }
};

// Social Media Links
export const SOCIAL_MEDIA = {
  facebook: 'https://facebook.com/redixsolutions',
  instagram: 'https://instagram.com/redixsolutions',
  linkedin: 'https://linkedin.com/company/redixsolutions',
  twitter: 'https://twitter.com/redixsolutions',
  youtube: 'https://youtube.com/@redixsolutions',
  tiktok: 'https://tiktok.com/@redixsolutions'
};

// Navigation Menu Items
export const NAVIGATION = {
  main: [
    { id: 'home', label: 'Home', href: '#home' },
    { id: 'why-choose-us', label: 'About', href: '#why-choose-us' },
    { id: 'services', label: 'Services', href: '#services' },
    { id: 'video-showcase', label: 'Results', href: '#video-showcase' },
    { id: 'book-call', label: 'Contact', href: '#book-call' }
  ],
  footer: {
    services: [
      { label: 'Digital Marketing', href: '#services' },
      { label: 'Web & Mobile Development', href: '#services' },
      { label: 'Social Media', href: '#services' },
      { label: 'UI/UX Design', href: '#services' },
      { label: 'Video Production', href: '#services' }
    ],
    quickLinks: [
      { label: 'Home', href: '#home' },
      { label: 'About Us', href: '#about' },
      { label: 'Services', href: '#services' },
      { label: 'Case Studies', href: '#results' },
      { label: 'Contact', href: '#contact' }
    ]
  }
};

// Service Categories
export const SERVICE_CATEGORIES = {
  development: {
    id: 'development',
    name: 'Development',
    description: 'Web and mobile application development'
  },
  design: {
    id: 'design',
    name: 'Design',
    description: 'UI/UX design and brand identity'
  },
  marketing: {
    id: 'marketing',
    name: 'Marketing',
    description: 'Digital marketing and advertising'
  },
  content: {
    id: 'content',
    name: 'Content',
    description: 'Content creation and video production'
  },
  hosting: {
    id: 'hosting',
    name: 'Hosting',
    description: 'Web hosting and cloud services'
  }
};

// Technology Stack
export const TECHNOLOGIES = {
  frontend: [
    'React', 'Vue.js', 'Angular', 'Next.js', 'Nuxt.js', 'Svelte',
    'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Sass', 'Tailwind CSS'
  ],
  backend: [
    'Node.js', 'Express.js', 'Python', 'Django', 'FastAPI', 'PHP',
    'Laravel', 'Ruby on Rails', 'Java', 'Spring Boot'
  ],
  mobile: [
    'React Native', 'Flutter', 'Swift', 'Kotlin', 'Ionic', 'Xamarin'
  ],
  databases: [
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase', 'Supabase'
  ],
  cloud: [
    'AWS', 'Google Cloud', 'DigitalOcean', 'Vercel', 'Netlify', 'Heroku'
  ],
  tools: [
    'Git', 'Docker', 'Kubernetes', 'Jenkins', 'GitHub Actions', 'Figma',
    'Adobe Creative Suite', 'Sketch', 'Postman'
  ]
};

// Project Status Types
export const PROJECT_STATUS = {
  PLANNING: 'planning',
  IN_PROGRESS: 'in-progress',
  REVIEW: 'review',
  COMPLETED: 'completed',
  ON_HOLD: 'on-hold',
  CANCELLED: 'cancelled'
};

// Service Pricing Tiers
export const PRICING_TIERS = {
  basic: {
    name: 'Basic',
    description: 'Perfect for startups and small businesses',
    features: ['Basic features', 'Email support', '30-day warranty']
  },
  professional: {
    name: 'Professional',
    description: 'Ideal for growing businesses',
    features: ['Advanced features', 'Priority support', '90-day warranty', 'Free maintenance']
  },
  enterprise: {
    name: 'Enterprise',
    description: 'For large organizations',
    features: ['All features', '24/7 support', '1-year warranty', 'Dedicated account manager']
  }
};

// Animation Settings
export const ANIMATION_SETTINGS = {
  durations: {
    fast: 200,
    normal: 300,
    slow: 500,
    slower: 800
  },
  easings: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  },
  delays: {
    short: 100,
    medium: 300,
    long: 500
  }
};

// Breakpoints for responsive design
export const BREAKPOINTS = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

// API Endpoints
export const API_ENDPOINTS = {
  base: 'https://api.redixsolutions.pro',
  contact: '/contact',
  newsletter: '/newsletter/subscribe',
  portfolio: '/portfolio',
  testimonials: '/testimonials',
  services: '/services',
  blog: '/blog'
};

// Form Validation Rules
export const VALIDATION_RULES = {
  name: {
    minLength: 2,
    maxLength: 50,
    required: true
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    required: true
  },
  phone: {
    pattern: /^[\+]?[1-9][\d]{0,15}$/,
    required: false
  },
  message: {
    minLength: 10,
    maxLength: 1000,
    required: true
  }
};

// File Upload Settings
export const FILE_UPLOAD = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  maxFiles: 5
};

// SEO Configuration
export const SEO_CONFIG = {
  defaultTitle: 'Redix Digital Solutions - Transform Your Digital Presence',
  titleTemplate: '%s | Redix Digital Solutions',
  defaultDescription: 'Tunisia-based digital solutions agency specializing in web development, mobile apps, and digital marketing. Transform your business with cutting-edge technology.',
  keywords: [
    'digital agency Tunisia',
    'web development',
    'mobile app development',
    'digital marketing',
    'UI/UX design',
    'video production',
    'Manouba',
    'Tunisia tech'
  ],
  author: 'Redix Digital Solutions',
  siteUrl: 'https://redixsolutions.pro',
  image: '/og-image.jpg'
};

// Analytics and Tracking
export const ANALYTICS = {
  googleAnalytics: 'GA_MEASUREMENT_ID',
  facebookPixel: 'FB_PIXEL_ID',
  linkedInInsight: 'LINKEDIN_PARTNER_ID',
  hotjar: 'HOTJAR_SITE_ID'
};

// Error Messages
export const ERROR_MESSAGES = {
  network: 'Network error. Please check your connection and try again.',
  server: 'Server error. Please try again later.',
  validation: 'Please check your input and try again.',
  fileSize: 'File size too large. Maximum allowed size is 10MB.',
  fileType: 'File type not supported.',
  required: 'This field is required.',
  email: 'Please enter a valid email address.',
  phone: 'Please enter a valid phone number.',
  minLength: (min) => `Minimum ${min} characters required.`,
  maxLength: (max) => `Maximum ${max} characters allowed.`
};

// Success Messages
export const SUCCESS_MESSAGES = {
  contactSent: 'Thank you for your message! We\'ll get back to you soon.',
  newsletterSubscribed: 'Successfully subscribed to our newsletter!',
  fileSaved: 'File saved successfully.',
  formSubmitted: 'Form submitted successfully!'
};

// Loading States
export const LOADING_STATES = {
  idle: 'idle',
  loading: 'loading',
  success: 'success',
  error: 'error'
};

// Feature Flags
export const FEATURE_FLAGS = {
  enableNewsletter: true,
  enableChatbot: true,
  enableBlog: false,
  enableMultiLanguage: false,
  enableDarkMode: false,
  enableAnimations: true,
  enableAnalytics: true
};

// Default Values
export const DEFAULTS = {
  language: 'en',
  theme: 'dark',
  itemsPerPage: 12,
  animationDuration: 300,
  debounceDelay: 300,
  cacheExpiry: 24 * 60 * 60 * 1000 // 24 hours
};

export default {
  COMPANY_INFO,
  CONTACT_INFO,
  SOCIAL_MEDIA,
  NAVIGATION,
  SERVICE_CATEGORIES,
  TECHNOLOGIES,
  PROJECT_STATUS,
  PRICING_TIERS,
  ANIMATION_SETTINGS,
  BREAKPOINTS,
  API_ENDPOINTS,
  VALIDATION_RULES,
  FILE_UPLOAD,
  SEO_CONFIG,
  ANALYTICS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  LOADING_STATES,
  FEATURE_FLAGS,
  DEFAULTS
};
