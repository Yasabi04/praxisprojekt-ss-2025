// Frontend Configuration
const config = {
    // API Endpoints
    API_BASE_URL: 'http://mivs15.gm.fh-koeln.de:3500',
    DEEPL_API_KEY: '64a956bd-2a3c-4fcb-8be0-30ffe5430d5a:fx',
    
    // Features
    DEBUG_MODE: true,
    ENABLE_LOGGING: true,
    
    // UI Settings
    STREAM_BATCH_SIZE: 12,
    UPDATE_THROTTLE_MS: 50,
    
    // Endpoints
    ENDPOINTS: {
        TRANSLATE: '/api/translate',
        EXPLAIN: '/api/explain',
        UPLOAD: '/api/upload'
    }
};

// Global verfügbar machen
window.APP_CONFIG = config;

console.log('✅ Config loaded:', config.API_BASE_URL);
