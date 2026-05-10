import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import { UserRightsProvider, useRights } from './context/UserRightsContext';

// Ginawa nating hiwalay na component ang Dashboard para magamit ang useRights() hook
const Dashboard = () => {
  const { canAdd, canEdit, canDelete, isAdmin, loading } = useRights();

  if (loading) return <p style={{ padding: '20px' }}>Loading permissions...</p>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      
      {/* --- PR-03: SIDEBAR GATING --- */}
      <nav style={{ width: '220px', borderRight: '1px solid #ddd', padding: '20px', backgroundColor: '#f9f9f9' }}>
        <h2 style={{ fontSize: '1.2rem' }}>HopePMS Menu</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ margin: '10px 0' }}><a href="/">🏠 Dashboard</a></li>
          <li style={{ margin: '10px 0' }}><a href="/">📦 Inventory</a></li>
          
          {/* Gated: Only for ADMIN/SUPERADMIN */}
          {isAdmin && (
            <li style={{ margin: '10px 0' }}>
              <a href="/" style={{ color: '#d9534f', fontWeight: 'bold' }}>🗑️ Deleted Items</a>
            </li>
          )}
        </ul>
      </nav>

      {/* --- MAIN CONTENT AREA --- */}
      <div style={{ flex: 1, padding: '30px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Inventory Overview</h1>
          {/* PR-02: Add Button Gating */}
          {canAdd && (
            <button style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              + Add New Product
            </button>
          )}
        </header>

        <table border="1" cellPadding="10" style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
          <thead style={{ backgroundColor: '#f2f2f2' }}>
            <tr>
              <th>Product Name</th>
              <th>Status</th>
              {/* PR-02: Stamp Column Gating */}
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
                {/* PR-02: Edit & Delete Button Gating */}
                {canEdit && <button style={{ marginRight: '5px' }}>Edit</button>}
                {canDelete && <button style={{ color: 'red' }}>Delete</button>}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

function App() {
  return (
    // Binalot natin ng UserRightsProvider para gumana ang useRights() sa loob
    <UserRightsProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          {/* Ang Dashboard ang default view natin */}
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </Router>
    </UserRightsProvider>
  );
}

export default App;