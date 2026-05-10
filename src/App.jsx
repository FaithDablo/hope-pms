import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AuthCallback from './pages/AuthCallback';
import Layout from './components/Layout';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Pag open ng site, rekta sa Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Dashboard Route na nakabalot sa Layout */}
        <Route 
          path="/dashboard" 
          element={
            <Layout>
              <Dashboard />
            </Layout>
          } 
        />

        {/* Fallback: Kapag maling URL ang tinype, babalik sa login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;