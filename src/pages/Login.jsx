import { supabase } from '../supabaseClient';

export default function Login() {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Ito ang magsasabi kung saan babalik ang user pagkatapos mag-login
        redirectTo: window.location.origin + '/auth/callback',
      },
    });

    if (error) {
      console.error("Error logging in:", error.message);
      alert("Error: " + error.message);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
      <h1>HopePMS Login</h1>
      <p>Rights & Authentication Specialist Security Gate</p>
      
      <button 
        onClick={handleGoogleLogin}
        style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#4285F4', color: 'white', border: 'none', borderRadius: '5px' }}
      >
        Sign in with Google
      </button>
    </div>
  );
}