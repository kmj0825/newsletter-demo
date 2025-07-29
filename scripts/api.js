/**
 * API Communication Module
 * Handles N8N Webhook integration and HTTP requests
 */

class NewsletterAPI {
  constructor() {
    // Configuration based on N8N workflow analysis
    this.config = {
      // TODO: Replace with actual N8N webhook URL
      webhookUrl: 'https://your-n8n-instance.com/webhook/research',
      timeout: 30000, // 30 seconds timeout
      retryAttempts: 3,
      retryDelay: 1000 // 1 second
    };
    
    this.requestId = 0;
  }

  /**
   * Subscribe to newsletter with keyword and email
   * @param {Object} data - Subscription data
   * @param {string} data.keyword - Search keyword
   * @param {string} data.email - User email
   * @param {string} data.language - Language preference (ko/en)
   * @returns {Promise<Object>} Response object
   */
  async subscribe(data) {
    const requestId = ++this.requestId;
    
    try {
      console.log(`[API] Starting subscription request ${requestId}`, data);
      
      // Prepare request payload based on N8N workflow structure
      const payload = {
        query: data.keyword.trim(),
        address: data.email.trim(),
        language: data.language || 'ko',
        timestamp: new Date().toISOString(),
        requestId: requestId
      };

      // Make request with retry logic
      const response = await this.makeRequestWithRetry(payload, requestId);
      
      console.log(`[API] Subscription request ${requestId} completed successfully`);
      return {
        success: true,
        message: '뉴스레터 구독이 성공적으로 등록되었습니다. 곧 이메일을 받으실 수 있습니다.',
        data: response,
        requestId: requestId
      };
      
    } catch (error) {
      console.error(`[API] Subscription request ${requestId} failed:`, error);
      
      return {
        success: false,
        message: this.getErrorMessage(error),
        error: error.message,
        requestId: requestId
      };
    }
  }

  /**
   * Make HTTP request with retry logic
   * @param {Object} payload - Request payload
   * @param {number} requestId - Request identifier
   * @returns {Promise<Object>} Response data
   */
  async makeRequestWithRetry(payload, requestId) {
    let lastError;
    
    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        console.log(`[API] Request ${requestId} - Attempt ${attempt}/${this.config.retryAttempts}`);
        
        const response = await this.makeHttpRequest(payload);
        
        // Success - return response
        return response;
        
      } catch (error) {
        lastError = error;
        console.warn(`[API] Request ${requestId} - Attempt ${attempt} failed:`, error.message);
        
        // Don't retry on client errors (4xx)
        if (error.status >= 400 && error.status < 500) {
          throw error;
        }
        
        // Wait before retry (except on last attempt)
        if (attempt < this.config.retryAttempts) {
          await this.sleep(this.config.retryDelay * attempt);
        }
      }
    }
    
    // All attempts failed
    throw new Error(`Request failed after ${this.config.retryAttempts} attempts: ${lastError.message}`);
  }

  /**
   * Make HTTP request to N8N webhook
   * @param {Object} payload - Request payload
   * @returns {Promise<Object>} Response data
   */
  async makeHttpRequest(payload) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
    
    try {
      const response = await fetch(this.config.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      // Check if response is ok
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      // Try to parse JSON response
      let responseData;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        // N8N might return plain text or HTML
        const textResponse = await response.text();
        responseData = { message: textResponse, status: 'success' };
      }
      
      return responseData;
      
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout (${this.config.timeout}ms)`);
      }
      
      // Enhance error with status if available
      if (error.status) {
        error.status = error.status;
      }
      
      throw error;
    }
  }

  /**
   * Get user-friendly error message
   * @param {Error} error - Error object
   * @returns {string} User-friendly error message
   */
  getErrorMessage(error) {
    const message = error.message.toLowerCase();
    
    // Network errors
    if (message.includes('fetch') || message.includes('network')) {
      return '네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인하고 다시 시도해주세요.';
    }
    
    // Timeout errors
    if (message.includes('timeout') || message.includes('abort')) {
      return '요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.';
    }
    
    // Server errors (5xx)
    if (message.includes('http 5')) {
      return '서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
    }
    
    // Client errors (4xx)
    if (message.includes('http 4')) {
      return '요청이 올바르지 않습니다. 입력한 정보를 확인해주세요.';
    }
    
    // CORS errors
    if (message.includes('cors')) {
      return '브라우저 보안 정책으로 인해 요청이 차단되었습니다.';
    }
    
    // Generic error
    return '알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
  }

  /**
   * Utility function to sleep/wait
   * @param {number} ms - Milliseconds to wait
   * @returns {Promise<void>}
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Test webhook connectivity
   * @returns {Promise<boolean>} Connection status
   */
  async testConnection() {
    try {
      const testPayload = {
        query: 'test',
        address: 'test@example.com',
        language: 'ko',
        test: true
      };
      
      await this.makeHttpRequest(testPayload);
      return true;
      
    } catch (error) {
      console.warn('[API] Connection test failed:', error.message);
      return false;
    }
  }
}

// Create global API instance
window.NewsletterAPI = new NewsletterAPI();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NewsletterAPI;
}