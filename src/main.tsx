import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { environmentService } from './config/environment';
import { testConnection } from './lib/database/test-connection';

// Initialize app with error boundary
const root = document.getElementById('root');
if (!root) {
  throw new Error('Root element not found');
}

// Create error display element
const createErrorDisplay = (message: string) => {
  return `
    <div style="
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #040707;
      color: #ff4444;
      padding: 20px;
      font-family: system-ui;
    ">
      <div>
        <h1 style="font-size: 24px; margin-bottom: 16px;">Configuration Error</h1>
        <p style="color: #666;">${message}</p>
        <button onclick="location.reload()" style="
          margin-top: 16px;
          padding: 8px 16px;
          background: #72f68e;
          color: #040707;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        ">
          Retry
        </button>
      </div>
    </div>
  `;
};

// Initialize app with proper error handling
async function initializeApp() {
  try {
    // Validate environment
    if (!environmentService.validate()) {
      throw new Error('Invalid environment configuration');
    }

    // Test database connection
    const { success, error, version } = await testConnection();
    if (!success) {
      throw new Error(`Database connection failed: ${error}`);
    }
    console.debug('Database connection successful:', version);

    // Create app
    createRoot(root).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  } catch (error) {
    console.error('Application initialization failed:', error);
    
    if (root) {
      root.innerHTML = createErrorDisplay(
        error instanceof Error 
          ? error.message 
          : 'Failed to initialize application'
      );
    }
  }
}

initializeApp();