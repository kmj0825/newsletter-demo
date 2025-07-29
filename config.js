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
const CONFIG = window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1' ? 
               DEV_CONFIG : PROD_CONFIG;

// Update API configuration
console.log('[Config] Environment detected:', window.location.hostname);
console.log('[Config] Selected config:', CONFIG);

if (typeof NewsletterAPI !== 'undefined') {
  console.log('[Config] Before update:', NewsletterAPI.config.webhookUrl);
  NewsletterAPI.config.webhookUrl = CONFIG.N8N_WEBHOOK_URL;
  NewsletterAPI.config.timeout = CONFIG.TIMEOUT;
  console.log('[Config] After update:', NewsletterAPI.config.webhookUrl);
  
  if (CONFIG.DEBUG) {
    console.log('[Config] Newsletter API configured:', NewsletterAPI.config);
  }
} else {
  console.warn('[Config] NewsletterAPI not found - will be configured when available');
}

// Export configuration
window.APP_CONFIG = CONFIG;