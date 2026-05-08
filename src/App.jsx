import { useRights } from './context/UserRightsContext';
import { useAuth } from './context/AuthContext';

function App() {
  const { user } = useAuth();
  const { rights, loading } = useRights();

  if (loading) return <p>Checking permissions...</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Product Management System</h1>
      <p>Logged in as: <strong>{user?.email}</strong></p>
      <hr />
      <section>
        <h3>Product Actions (PR-02)</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          {rights.PRD_ADD === 1 && (
            <button style={{ padding: '10px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '5px' }}>
              Add Product
            </button>
          )}
          {rights.PRD_EDIT === 1 && (
            <button style={{ padding: '10px', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '5px' }}>
              Edit Product
            </button>
          )}
          {rights.PRD_DEL === 1 && (
            <button style={{ padding: '10px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '5px' }}>
              Delete Product
            </button>
          )}
        </div>
      </section>
      <br />
      <section style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f4f4f4', borderRadius: '8px' }}>
        <h3>Navigation Modules (PR-03)</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ padding: '5px 0' }}>📂 Product List (Public)</li>
          {rights.ADM_MOD === 1 ? (
            <li style={{ padding: '5px 0', color: 'darkblue', fontWeight: 'bold' }}>
              🛡️ Admin Settings Module
            </li>
          ) : (
            <li style={{ padding: '5px 0', color: 'gray', fontStyle: 'italic' }}>
              🔒 Admin Module (Access Denied)
            </li>
          )}
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