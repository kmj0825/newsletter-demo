/**
 * Temporary GET request version for N8N testing
 * Use this when N8N webhook only accepts GET requests
 */

// Override the makeHttpRequest method to use GET with query parameters
if (typeof NewsletterAPI !== 'undefined') {
  NewsletterAPI.makeHttpRequest = async function(payload) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
    
    try {
      // Convert payload to URL parameters
      const params = new URLSearchParams({
        query: payload.query,
        address: payload.address,
        language: payload.language || 'ko',
        timestamp: payload.timestamp,
        requestId: payload.requestId.toString()
      });
      
      const url = `${this.config.webhookUrl}?${params.toString()}`;
      console.log('[API] Making GET request to:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
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
      
      throw error;
    }
  };
  
  console.log('[API Override] Using GET requests with query parameters');
}