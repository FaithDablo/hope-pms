import { useRights } from './context/UserRightsContext';
import { useAuth } from './context/AuthContext';

function App() {
  const { user } = useAuth();
  const { rights, loading } = useRights();

  // 1. Loading State - Importante para hindi mag-flicker ang UI
  if (loading) return <p>Checking permissions...</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Product Management System</h1>
      <p>Logged in as: <strong>{user?.email}</strong></p>

      <hr />

      {/* --- PR-02 SECTION: BUTTON GATING --- */}
      <section>
        <h3>Product Actions (PR-02)</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          
          {/* Add Button - Visible if PRD_ADD is 1 */}
          {rights.PRD_ADD === 1 && (
            <button style={{ padding: '10px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '5px' }}>
              Add Product
            </button>
          )}

          {/* Edit Button - Visible if PRD_EDIT is 1 */}
          {rights.PRD_EDIT === 1 && (
            <button style={{ padding: '10px', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '5px' }}>
              Edit Product
            </button>
          )}

          {/* Delete Button - Hidden base sa SQL trigger natin (PRD_DEL is 0) */}
          {rights.PRD_DEL === 1 && (
            <button style={{ padding: '10px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '5px' }}>
              Delete Product
            </button>
          )}
        </div>
      </section>

      <br />

      {/* --- PR-03 SECTION: SIDEBAR/MODULE GATING --- */}
      <section style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f4f4f4', borderRadius: '8px' }}>
        <h3>Navigation Modules (PR-03)</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ padding: '5px 0' }}>📂 Product List (Public)</li>
          
          {/* Admin Module - Visible only if ADM_MOD is 1 */}
          {rights.ADM_MOD === 1 ? (
            <li style={{ padding: '5px 0', color: 'darkblue', fontWeight: 'bold' }}>
              🛡️ Admin Settings Module
            </li>
          ) : (
            <li style={{ padding: '5px 0', color: 'gray', fontStyle: 'italic' }}>
              🔒 Admin Module (Access Denied)
            </li>
          )}

          {/* Trash Module - Only visible if user has Delete rights */}
          {rights.PRD_DEL === 1 && (
            <li style={{ padding: '5px 0', color: 'darkred' }}>
              🗑️ System Trash / Deleted Items
            </li>
          )}
        </ul>
      </section>

    </div>
  );
}

export default App;