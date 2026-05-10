import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import { UserRightsProvider, useRights } from './context/UserRightsContext';

// Gawa tayo ng maliit na component para sa Dashboard logic
const Dashboard = () => {
  const { canAdd, canEdit, canDelete, isAdmin, loading } = useRights();

  if (loading) return <p>Checking permissions...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome to HopePMS!</h1>
      
      {/* PR-02: Add button gating */}
      {canAdd && <button style={{ marginBottom: '10px' }}>+ Add New Product</button>}

      <table border="1" style={{ width: '100%', textAlign: 'left' }}>
        <thead>
          <tr>
            <th>Product Name</th>
            {/* PR-02: Stamp column gated for ADMIN/SUPERADMIN */}
            {isAdmin && <th>Stamp (Admin Only)</th>}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Sample Item</td>
            {isAdmin && <td>System_Admin_01</td>}
            <td>
              {/* PR-02: Edit & Delete gating */}
              {canEdit && <button>Edit</button>}
              {' '}
              {canDelete && <button style={{ color: 'red' }}>Delete</button>}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

function App() {
  return (
    // Kailangan itong provider para gumana ang useRights() sa loob
    <UserRightsProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          {/* Ang Main Page natin ngayon ay ang Dashboard component sa taas */}
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </Router>
    </UserRightsProvider>
  );
}

export default App;