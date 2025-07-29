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
if (typeof NewsletterAPI !== 'undefined') {
  NewsletterAPI.config.webhookUrl = CONFIG.N8N_WEBHOOK_URL;
  NewsletterAPI.config.timeout = CONFIG.TIMEOUT;
  
  if (CONFIG.DEBUG) {
    console.log('[Config] Newsletter API configured:', NewsletterAPI.config);
  }
}

// Export configuration
window.APP_CONFIG = CONFIG;