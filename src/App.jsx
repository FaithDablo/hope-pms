import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ito ang lalabas kapag tinype ang /login */}
        <Route path="/login" element={<Login />} />
        
        {/* Ito ang kailangan ng Google OAuth */}
        <Route path="/auth/callback" element={<AuthCallback />} />
        
        {/* Ang Main Page */}
        <Route path="/" element={<h1>Welcome to HopePMS!</h1>} />
      </Routes>
    </Router>
  );
}

export default App;