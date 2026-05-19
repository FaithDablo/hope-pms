import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Standard entry point global style sheet configurations (Tailwind directives)

// Initialize the core DOM injection tree tied directly to index.html
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Note: Global state orchestration providers (AuthProvider, UserRightsProvider) 
      are configured inside App.jsx to streamline conditional routing parameters.
    */}
    <App />
  </React.StrictMode>
);
