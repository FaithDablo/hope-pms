import { useRights } from './context/UserRightsContext';
import { useAuth } from './context/AuthContext';

function App() {
  const { user } = useAuth();
  const { rights, loading } = useRights();

  if (loading) return <p>Checking permissions...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Product Management System</h1>
      <p>User: {user?.email}</p>

      <div className="actions" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        
        {/* 🟢 PR-02: Gating for ADD Button */}
        {rights.PRD_ADD === 1 && (
          <button style={{ backgroundColor: 'green', color: 'white' }}>
            Add Product
          </button>
        )}

        {/* 🟡 PR-02: Gating for EDIT Button */}
        {rights.PRD_EDIT === 1 && (
          <button style={{ backgroundColor: 'blue', color: 'white' }}>
            Edit Product
          </button>
        )}

        {/* 🔴 PR-02: Gating for DELETE Button */}
        {rights.PRD_DEL === 1 && (
          <button style={{ backgroundColor: 'red', color: 'white' }}>
            Delete Product
          </button>
        )}
      </div>

      {/* 📂 PR-03: Sidebar/Module Gating Preview */}
      <div style={{ marginTop: '30px', borderTop: '1px solid gray' }}>
         {rights.ADM_MOD === 1 ? <p>Admin Module Visible</p> : <p>Admin Access Denied</p>}
      </div>
    </div>
  );
}

export default App;