import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { UserRightsProvider } from './context/UserRightsContext' // Import ito

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <UserRightsProvider> {/* Balutin ang App dito */}
        <App />
      </UserRightsProvider>
    </AuthProvider>
  </React.StrictMode>,
)