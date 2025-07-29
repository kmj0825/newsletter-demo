/**
 * Main Application Module
 * Handles form submission, UI interactions, and user experience
 */

class NewsletterApp {
  constructor() {
    this.form = null;
    this.submitButton = null;
    this.statusMessage = null;
    this.isSubmitting = false;
    
    // Analytics and metrics
    this.metrics = {
      startTime: Date.now(),
      interactions: 0,
      validationErrors: 0,
      submissionAttempts: 0,
      successfulSubmissions: 0
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }

  /**
   * Initialize the application
   */
  init() {
    console.log('[App] Initializing Newsletter Demo App');
    
    try {
      this.setupElements();
      this.setupEventListeners();
      this.setupValidation();
      this.setupUIEnhancements();
      this.testAPIConnection();
      
      console.log('[App] Initialization completed successfully');
    } catch (error) {
      console.error('[App] Initialization failed:', error);
      this.showStatus('앱 초기화 중 오류가 발생했습니다.', 'error');
    }
  }

  /**
   * Setup form elements and references
   */
  setupElements() {
    this.form = document.getElementById('newsletter-form');
    this.submitButton = document.getElementById('submit-btn');
    this.statusMessage = document.getElementById('status-message');
    
    if (!this.form || !this.submitButton || !this.statusMessage) {
      throw new Error('Required form elements not found');
    }
    
    // Get form fields
    this.fields = {
      keyword: this.form.querySelector('#keyword'),
      email: this.form.querySelector('#email'),
      language: this.form.querySelector('#language')
    };
    
    // Validate all fields exist
    for (const [name, element] of Object.entries(this.fields)) {
      if (!element) {
        throw new Error(`Form field '${name}' not found`);
      }
    }
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Form submission
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // Prevent double submission
    this.submitButton.addEventListener('click', (e) => {
      if (this.isSubmitting) {
        e.preventDefault();
        return false;
      }
    });
    
    // Track user interactions
    this.form.addEventListener('input', () => {
      this.metrics.interactions++;
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Alt + S to focus on submit button
      if (e.altKey && e.key === 's') {
        e.preventDefault();
        this.submitButton.focus();
      }
      
      // Escape to clear status message
      if (e.key === 'Escape' && this.statusMessage.style.display !== 'none') {
        this.hideStatus();
      }
    });
    
    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.isSubmitting) {
        // Page became visible while submitting - user might have switched tabs
        console.log('[App] Page became visible during submission');
      }
    });
  }

  /**
   * Setup form validation
   */
  setupValidation() {
    if (typeof FormValidator === 'undefined') {
      console.warn('[App] FormValidator not available, skipping validation setup');
      return;
    }
    
    window.FormValidator.setupRealTimeValidation(this.form, (fieldName, result) => {
      if (!result.isValid) {
        this.metrics.validationErrors++;
      }
    });
  }

  /**
   * Setup UI enhancements
   */
  setupUIEnhancements() {
    // Add loading animation to submit button
    this.setupSubmitButton();
    
    // Auto-focus first field on page load
    if (this.fields.keyword) {
      this.fields.keyword.focus();
    }
    
    // Add placeholder improvements
    this.enhancePlaceholders();
    
    // Setup form persistence (save draft)
    this.setupFormPersistence();
  }

  /**
   * Setup submit button enhancements
   */
  setupSubmitButton() {
    const btnText = this.submitButton.querySelector('.btn-text');
    const btnLoader = this.submitButton.querySelector('.btn-loader');
    
    if (!btnText || !btnLoader) {
      console.warn('[App] Submit button elements not found');
      return;
    }
    
    // Store original text
    this.originalButtonText = btnText.textContent;
  }

  /**
   * Enhance form placeholders with examples
   */
  enhancePlaceholders() {
    const examples = {
      keyword: ['HyperCLOVA-X, 네이버', '인공지능, 딥러닝', '스타트업, 투자', '클라우드, AWS', '블록체인, NFT'],
      email: ['demo@example.com', 'test@company.com', 'user@domain.com']
    };
    
    // Rotate placeholder examples
    Object.entries(examples).forEach(([fieldName, exampleList]) => {
      const field = this.fields[fieldName];
      if (!field || !exampleList.length) return;
      
      let currentIndex = 0;
      setInterval(() => {
        field.placeholder = `예: ${exampleList[currentIndex]}`;
        currentIndex = (currentIndex + 1) % exampleList.length;
      }, 3000);
    });
  }

  /**
   * Setup form data persistence
   */
  setupFormPersistence() {
    const STORAGE_KEY = 'newsletter-form-draft';
    
    // Load saved data on page load
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const data = JSON.parse(savedData);
        Object.entries(data).forEach(([key, value]) => {
          if (this.fields[key] && value) {
            this.fields[key].value = value;
          }
        });
      }
    } catch (error) {
      console.warn('[App] Failed to load saved form data:', error);
    }
    
    // Save data on input
    const saveData = () => {
      try {
        const data = this.getFormData();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.warn('[App] Failed to save form data:', error);
      }
    };
    
    // Save periodically and on input
    Object.values(this.fields).forEach(field => {
      field.addEventListener('input', () => {
        clearTimeout(this.saveTimeout);
        this.saveTimeout = setTimeout(saveData, 1000);
      });
    });
    
    // Clear saved data on successful submission
    this.form.addEventListener('submit', () => {
      setTimeout(() => {
        if (this.lastSubmissionSuccessful) {
          localStorage.removeItem(STORAGE_KEY);
        }
      }, 1000);
    });
  }

  /**
   * Test API connection on app start
   */
  async testAPIConnection() {
    if (typeof NewsletterAPI === 'undefined') {
      console.warn('[App] NewsletterAPI not available');
      return;
    }
    
    try {
      const isConnected = await window.NewsletterAPI.testConnection();
      console.log(`[App] API connection test: ${isConnected ? 'SUCCESS' : 'FAILED'}`);
      
      if (!isConnected) {
        this.showStatus(
          'API 연결 테스트에 실패했습니다. 일부 기능이 제한될 수 있습니다.',
          'warning'
        );
      }
    } catch (error) {
      console.warn('[App] API connection test error:', error);
    }
  }

  /**
   * Get form data as object
   * @returns {Object} Form data
   */
  getFormData() {
    return {
      keyword: this.fields.keyword.value.trim(),
      email: this.fields.email.value.trim(),
      language: this.fields.language.value
    };
  }

  /**
   * Handle form submission
   * @param {Event} event - Submit event
   */
  async handleSubmit(event) {
    event.preventDefault();
    
    if (this.isSubmitting) {
      console.log('[App] Submission already in progress');
      return;
    }
    
    this.metrics.submissionAttempts++;
    console.log('[App] Starting form submission');
    
    try {
      // Get form data
      const formData = this.getFormData();
      console.log('[App] Form data:', formData);
      
      // Validate form
      if (typeof FormValidator !== 'undefined') {
        const validation = window.FormValidator.validateForm(formData);
        if (!validation.isValid) {
          this.handleValidationErrors(validation.errors);
          return;
        }
      }
      
      // Start submission process
      this.setSubmissionState(true);
      this.showStatus('AI가 뉴스레터를 생성하고 있습니다...', 'info');
      
      // Submit to API
      const response = await this.submitToAPI(formData);
      
      if (response.success) {
        this.handleSubmissionSuccess(response);
      } else {
        this.handleSubmissionError(response);
      }
      
    } catch (error) {
      console.error('[App] Submission error:', error);
      this.handleSubmissionError({ 
        message: '예상치 못한 오류가 발생했습니다.',
        error: error.message 
      });
    } finally {
      this.setSubmissionState(false);
    }
  }

  /**
   * Submit form data to API
   * @param {Object} formData - Form data
   * @returns {Promise<Object>} API response
   */
  async submitToAPI(formData) {
    if (typeof NewsletterAPI === 'undefined') {
      throw new Error('NewsletterAPI not available');
    }
    
    return await window.NewsletterAPI.subscribe(formData);
  }

  /**
   * Handle validation errors
   * @param {Object} errors - Validation errors
   */
  handleValidationErrors(errors) {
    console.log('[App] Validation errors:', errors);
    
    const errorMessages = Object.values(errors).map(error => error.message);
    this.showStatus(`입력 오류: ${errorMessages[0]}`, 'error');
    
    // Focus first invalid field
    const firstErrorField = Object.keys(errors)[0];
    if (this.fields[firstErrorField]) {
      this.fields[firstErrorField].focus();
    }
  }

  /**
   * Handle successful submission
   * @param {Object} response - API response
   */
  handleSubmissionSuccess(response) {
    console.log('[App] Submission successful:', response);
    
    this.metrics.successfulSubmissions++;
    this.lastSubmissionSuccessful = true;
    
    this.showStatus(response.message || '뉴스레터 생성이 완료되었습니다!', 'success');
    
    // Reset form after delay
    setTimeout(() => {
      this.form.reset();
      this.hideStatus();
    }, 5000);
    
    // Track success
    this.trackEvent('newsletter_subscribe_success', {
      keyword: this.getFormData().keyword,
      language: this.getFormData().language
    });
  }

  /**
   * Handle submission error
   * @param {Object} response - Error response
   */
  handleSubmissionError(response) {
    console.error('[App] Submission failed:', response);
    
    this.lastSubmissionSuccessful = false;
    
    const message = response.message || '뉴스레터 생성 중 오류가 발생했습니다.';
    this.showStatus(message, 'error');
    
    // Track error
    this.trackEvent('newsletter_subscribe_error', {
      error: response.error || 'unknown',
      message: message
    });
  }

  /**
   * Set submission state and update UI
   * @param {boolean} isSubmitting - Submission state
   */
  setSubmissionState(isSubmitting) {
    this.isSubmitting = isSubmitting;
    this.form.classList.toggle('form-loading', isSubmitting);
    this.submitButton.disabled = isSubmitting;
    
    const btnText = this.submitButton.querySelector('.btn-text');
    const btnLoader = this.submitButton.querySelector('.btn-loader');
    
    if (btnText && btnLoader) {
      if (isSubmitting) {
        btnText.style.display = 'none';
        btnLoader.style.display = 'flex';
      } else {
        btnText.style.display = 'flex';
        btnLoader.style.display = 'none';
      }
    }
  }

  /**
   * Show status message
   * @param {string} message - Message text
   * @param {string} type - Message type (success, error, warning, info)
   */
  showStatus(message, type = 'info') {
    if (!this.statusMessage) return;
    
    this.statusMessage.textContent = message;
    this.statusMessage.className = `status-message ${type}`;
    this.statusMessage.style.display = 'flex';
    
    // Auto-hide after delay for non-error messages
    if (type !== 'error') {
      setTimeout(() => this.hideStatus(), 5000);
    }
    
    // Announce to screen readers
    this.statusMessage.setAttribute('role', 'alert');
    this.statusMessage.setAttribute('aria-live', 'polite');
  }

  /**
   * Hide status message
   */
  hideStatus() {
    if (this.statusMessage) {
      this.statusMessage.style.display = 'none';
      this.statusMessage.removeAttribute('role');
      this.statusMessage.removeAttribute('aria-live');
    }
  }

  /**
   * Track analytics events
   * @param {string} eventName - Event name
   * @param {Object} properties - Event properties
   */
  trackEvent(eventName, properties = {}) {
    const eventData = {
      event: eventName,
      timestamp: Date.now(),
      sessionDuration: Date.now() - this.metrics.startTime,
      ...properties,
      ...this.metrics
    };
    
    console.log('[Analytics]', eventData);
    
    // Send to analytics service (placeholder)
    // In a real app, you'd send this to Google Analytics, Mixpanel, etc.
  }

  /**
   * Get app statistics for debugging
   * @returns {Object} App statistics
   */
  getStats() {
    return {
      ...this.metrics,
      sessionDuration: Date.now() - this.metrics.startTime,
      isSubmitting: this.isSubmitting,
      formData: this.getFormData()
    };
  }
}

// Initialize app
window.NewsletterApp = new NewsletterApp();

// Global error handler
window.addEventListener('error', (event) => {
  console.error('[Global Error]', event.error);
  
  if (window.NewsletterApp) {
    window.NewsletterApp.trackEvent('javascript_error', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NewsletterApp;
}