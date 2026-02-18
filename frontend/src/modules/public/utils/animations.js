// src/utils/animations.js

// Animation configuration objects
export const animationConfig = {
  // Duration presets
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
    slower: 800
  },
  
  // Easing functions
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  },
  
  // Common animation variants
  variants: {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },
    slideUp: {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 30 }
    },
    slideDown: {
      initial: { opacity: 0, y: -30 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -30 }
    },
    slideLeft: {
      initial: { opacity: 0, x: 30 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 30 }
    },
    slideRight: {
      initial: { opacity: 0, x: -30 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -30 }
    },
    scale: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.8 }
    },
    rotate: {
      initial: { opacity: 0, rotate: -10 },
      animate: { opacity: 1, rotate: 0 },
      exit: { opacity: 0, rotate: 10 }
    }
  }
};

// Intersection Observer for scroll animations
export class ScrollAnimationObserver {
  constructor(options = {}) {
    this.options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
      ...options
    };
    this.observer = null;
    this.elements = new Map();
  }

  init() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const element = entry.target;
        const animationClass = this.elements.get(element);
        
        if (entry.isIntersecting) {
          element.classList.add(animationClass || 'animate-fade-in-up');
          element.classList.add('animated');
        }
      });
    }, this.options);
  }

  observe(element, animationClass = 'animate-fade-in-up') {
    if (!this.observer) this.init();
    
    this.elements.set(element, animationClass);
    element.classList.add('animate-on-scroll');
    this.observer.observe(element);
  }

  unobserve(element) {
    if (this.observer) {
      this.observer.unobserve(element);
      this.elements.delete(element);
    }
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
      this.elements.clear();
    }
  }
}

// Stagger animation utility
export const staggerAnimation = (elements, animationClass, delay = 100) => {
  elements.forEach((element, index) => {
    setTimeout(() => {
      element.classList.add(animationClass);
    }, index * delay);
  });
};

// Parallax scroll effect
export class ParallaxController {
  constructor() {
    this.elements = [];
    this.isScrolling = false;
  }

  add(element, speed = 0.5) {
    this.elements.push({ element, speed });
  }

  update() {
    const scrollTop = window.pageYOffset;
    
    this.elements.forEach(({ element, speed }) => {
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top + scrollTop;
      const elementHeight = rect.height;
      const windowHeight = window.innerHeight;
      
      // Only animate if element is in viewport
      if (scrollTop + windowHeight > elementTop && scrollTop < elementTop + elementHeight) {
        const yPos = -(scrollTop - elementTop) * speed;
        element.style.transform = `translateY(${yPos}px)`;
      }
    });
  }

  init() {
    window.addEventListener('scroll', () => {
      if (!this.isScrolling) {
        requestAnimationFrame(() => {
          this.update();
          this.isScrolling = false;
        });
        this.isScrolling = true;
      }
    });
  }
}

// CSS Animation utilities
export const animationUtils = {
  // Add animation class with cleanup
  animate: (element, animationClass, duration = 1000) => {
    return new Promise((resolve) => {
      element.classList.add(animationClass);
      
      const cleanup = () => {
        element.classList.remove(animationClass);
        element.removeEventListener('animationend', cleanup);
        resolve();
      };
      
      element.addEventListener('animationend', cleanup);
      
      // Fallback timeout
      setTimeout(cleanup, duration + 100);
    });
  },

  // Chain multiple animations
  sequence: async (animations) => {
    for (const animation of animations) {
      await animationUtils.animate(animation.element, animation.class, animation.duration);
      if (animation.delay) {
        await new Promise(resolve => setTimeout(resolve, animation.delay));
      }
    }
  },

  // Animate number counting
  countUp: (element, target, duration = 2000) => {
    const start = parseInt(element.textContent) || 0;
    const increment = (target - start) / (duration / 16);
    let current = start;

    const updateCount = () => {
      current += increment;
      if (current >= target) {
        element.textContent = target;
        return;
      }
      element.textContent = Math.floor(current);
      requestAnimationFrame(updateCount);
    };

    updateCount();
  },

  // Typing animation
  typeWriter: (element, text, speed = 50) => {
    return new Promise((resolve) => {
      element.textContent = '';
      let i = 0;
      
      const type = () => {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
          setTimeout(type, speed);
        } else {
          resolve();
        }
      };
      
      type();
    });
  }
};

// Performance optimization for animations
export const animationPerformance = {
  // Reduce motion based on user preference
  respectsReducedMotion: () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  // Optimize animations for low-end devices
  isLowEndDevice: () => {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;
    
    return (
      hardwareConcurrency <= 2 ||
      (connection && connection.saveData) ||
      (connection && connection.effectiveType && connection.effectiveType.includes('2g'))
    );
  },

  // Get appropriate animation configuration
  getConfig: () => {
    if (animationPerformance.respectsReducedMotion()) {
      return { duration: 0, easing: 'linear' };
    }
    
    if (animationPerformance.isLowEndDevice()) {
      return { duration: animationConfig.duration.fast, easing: animationConfig.easing.linear };
    }
    
    return { duration: animationConfig.duration.normal, easing: animationConfig.easing.easeOut };
  }
};

// Export default animation controller
export default class AnimationController {
  constructor() {
    this.scrollObserver = new ScrollAnimationObserver();
    this.parallaxController = new ParallaxController();
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;
    
    this.scrollObserver.init();
    this.parallaxController.init();
    this.isInitialized = true;
  }

  // Auto-animate elements with data attributes
  autoAnimate() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    animatedElements.forEach((element) => {
      const animationType = element.dataset.animate;
      const delay = parseInt(element.dataset.animateDelay) || 0;
      
      setTimeout(() => {
        this.scrollObserver.observe(element, `animate-${animationType}`);
      }, delay);
    });
  }

  // Cleanup
  destroy() {
    this.scrollObserver.disconnect();
    this.isInitialized = false;
  }
}
