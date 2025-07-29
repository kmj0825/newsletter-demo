/**
 * Configuration file for Newsletter Demo
 * Update the webhook URL with your actual N8N instance
 */

// Development configuration
const DEV_CONFIG = {
  N8N_WEBHOOK_URL: 'https://hcx-n8n.io.naver.com/webhook/research',  // Production URL for CORS support
  DEBUG: true,
  TIMEOUT: 30000
};

// Production configuration
const PROD_CONFIG = {
  N8N_WEBHOOK_URL: 'https://hcx-n8n.io.naver.com/webhook/research',  // Production URL for CORS support
  DEBUG: false,
  TIMEOUT: 30000
};

// Auto-detect environment
const isLocalhost = window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1';
const isGitHubPages = window.location.hostname.includes('github.io');

// Use same config for both localhost and GitHub Pages for demo consistency
const CONFIG = isLocalhost || isGitHubPages ? DEV_CONFIG : PROD_CONFIG;

// Update API configuration
console.log('[Config] Environment detected:', window.location.hostname);
console.log('[Config] Selected config:', CONFIG);

function applyConfig() {
  if (typeof window.NewsletterAPI !== 'undefined') {
    console.log('[Config] Before update:', window.NewsletterAPI.config.webhookUrl);
    window.NewsletterAPI.config.webhookUrl = CONFIG.N8N_WEBHOOK_URL;
    window.NewsletterAPI.config.timeout = CONFIG.TIMEOUT;
    console.log('[Config] After update:', window.NewsletterAPI.config.webhookUrl);
    
    if (CONFIG.DEBUG) {
      console.log('[Config] Newsletter API configured:', window.NewsletterAPI.config);
    }
    return true;
  }
  return false;
}

// Try to apply config immediately
if (!applyConfig()) {
  console.warn('[Config] NewsletterAPI not found - will retry when available');
  
  // Keep trying until NewsletterAPI is available
  const configRetry = setInterval(() => {
    if (applyConfig()) {
      console.log('[Config] Successfully configured NewsletterAPI on retry');
      clearInterval(configRetry);
    }
  }, 50); // Check every 50ms
  
  // Stop trying after 5 seconds
  setTimeout(() => {
    clearInterval(configRetry);
    console.error('[Config] Failed to configure NewsletterAPI after 5 seconds');
  }, 5000);
}

// Export configuration
window.APP_CONFIG = CONFIG;