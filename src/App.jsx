import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AuthCallback from './pages/AuthCallback';
import Layout from './components/Layout';
import { UserRightsProvider } from './context/UserRightsContext';
import './App.css';

function App() {
  return (
    <UserRightsProvider>
      <Router>
        <Routes>
          {/* Pag-open ng site, rekta agad sa Login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Dashboard Route na nakabalot sa Layout para sa Modern Sidebar gating natin */}
          <Route 
            path="/dashboard" 
            element={
              <Layout>
                <Dashboard />
              </Layout>
            } 
          />

          {/* Fallback Route: Kapag hindi alam ang URL, pabalikin sa login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </UserRightsProvider>
  );
}

export default App;