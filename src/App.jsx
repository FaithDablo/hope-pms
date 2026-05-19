import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardPage from './pages/Dashboard'; // Ini-rename para walang conflict sa local variable
import AuthCallback from './pages/AuthCallback';
import Layout from './components/Layout';
import { UserRightsProvider, useRights } from './context/UserRightsContext';
import './App.css';

// Local Dashboard Wrapper gamit ang useRights hook
const Dashboard = () => {
  const { canAdd, canEdit, canDelete, isAdmin, loading } = useRights();

  if (loading) return <p style={{ padding: '20px' }}>Loading permissions...</p>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Sidebar Gating */}
      <aside style={{ width: '240px', backgroundColor: '#1e293b', color: 'white', padding: '20px' }}>
        <h3 style={{ marginBottom: '30px' }}>📋 HOPE PMS</h3>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <a href="#" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>📦 Inventory Overview</a>
          <a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>📊 Reports</a>
          
          {isAdmin && (
            <div style={{ marginTop: '20px', borderTop: '1px solid #334155', paddingTop: '20px' }}>
              <p style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '10px' }}>Admin Settings</p>
              <a href="#" style={{ color: '#f87171', textDecoration: 'none', fontWeight: 'bold' }}>⚙️ User Management</a>
            </div>
          )}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '30px', backgroundColor: '#f8fafc' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Inventory Overview</h1>
          {canAdd && (
            <button style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              + Add New Product
            </button>
          )}
        </header>

        <table border="1" cellPadding="10" style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse', border: '1px solid #ddd', backgroundColor: 'white' }}>
          <thead style={{ backgroundColor: '#f2f2f2' }}>
            <tr>
              <th>Product Name</th>
              <th>Status</th>
              {isAdmin && <th>Admin Stamp</th>}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Sample Medical Kit</td>
              <td>In Stock</td>
              {isAdmin && <td style={{ fontSize: '0.8rem', color: '#666' }}>sys_admin_v2_2026</td>}
              <td>
                {canEdit && <button style={{ marginRight: '5px' }}>Edit</button>}
                {canDelete && <button style={{ color: 'red' }}>Delete</button>}
              </td>
            </tr>
          </tbody>
        </table>
      </main>
    </div>
  );
};

function App() {
  return (
    <UserRightsProvider>
      <Router>
        <Routes>
          {/* Pag open ng site, rekta sa Login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Fallback standalone link */}
          <Route path="/dashboard-preview" element={<Dashboard />} />

          {/* Main Layout Route para sa Sprint 3 */}
          <Route 
            path="/dashboard" 
            element={
              <Layout>
                <Dashboard />
              </Layout>
            } 
          />

          {/* Fallback kapag mali ang URL */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </UserRightsProvider>
  );
}

export default App;