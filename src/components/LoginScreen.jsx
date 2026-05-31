'use client';
import { useState } from 'react';
import styles from './LoginScreen.module.css';
import { loginWithEmail, loginWithGoogle } from '@/lib/firebase';

export default function LoginScreen({ onDone, showToast }) {
  const [showPw, setShowPw] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailLogin = async () => {
    if (!password) { setError('Please enter a password.'); return; }
    setLoading(true); setError('');
    try {
      await loginWithEmail('kamal.bharadwj@gmail.com', password);
      showToast('Welcome back, Kamal!', 'success');
      onDone();
    } catch {
      setError('Incorrect password. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true); setError('');
    try {
      await loginWithGoogle();
      showToast('Signed in with Google!', 'success');
      onDone();
    } catch (e) {
      if (e.code !== 'auth/popup-closed-by-user') {
        setError('Google sign-in failed. Try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    showToast('Browsing as Guest', 'info');
    onDone();
  };

  return (
    <div className={styles.screen}>
      {/* Top: branding + users */}
      <div className={styles.top}>
        {/* Left branding */}
        <div className={styles.branding}>
          <div>
            <h1 className={styles.windowsText}>Windows</h1>
            <p className={styles.tagline}>
              <span className={styles.xp}>XP</span>&nbsp; Professional
            </p>
            <p className={styles.hint}>To begin, click your user name</p>
          </div>
          <div className={styles.divider} />
        </div>

        {/* Right user list */}
        <div className={styles.userList}>
          {/* Kamal's tile */}
          <div
            className={styles.userTile}
            onClick={() => setShowPw(!showPw)}
          >
            <div className={styles.avatar}>
              <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#245edb', fontVariationSettings: "'FILL' 1" }}>person</span>
            </div>
            <div className={styles.userInfo}>
              <span className={styles.username}>Kamal Kumar</span>
              <span className={styles.userRole}>Administrator</span>
              {showPw && (
                <div className={styles.pwRow}>
                  <input
                    type="password"
                    className={styles.pwInput}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    onKeyDown={(e) => e.key === 'Enter' && handleEmailLogin()}
                    autoFocus
                  />
                  <button
                    className={styles.goBtn}
                    onClick={handleEmailLogin}
                    disabled={loading}
                  >
                    {loading
                      ? <span className="material-symbols-outlined" style={{ fontSize: 14 }}>autorenew</span>
                      : <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_forward</span>
                    }
                  </button>
                </div>
              )}
              {error && <p className={styles.errMsg}>{error}</p>}
            </div>
          </div>

          {/* Separator */}
          <div className={styles.orRow}><span>— or sign in with —</span></div>

          {/* Google */}
          <button className={styles.googleBtn} onClick={handleGoogle} disabled={loading}>
            <svg width="16" height="16" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Sign in with Google
          </button>

          {/* Guest */}
          <button className={styles.guestBtn} onClick={handleGuestLogin}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>visibility</span>
            Browse as Guest (view only)
          </button>
        </div>
      </div>

      {/* Bottom bar */}
      <div className={styles.bottomBar}>
        <div className={styles.powerBtn} onClick={() => window.close()}>
          <div className={styles.powerIcon}>
            <span className="material-symbols-outlined" style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}>power_settings_new</span>
          </div>
          <span className={styles.powerLabel}>Turn off computer</span>
        </div>
        <p className={styles.bottomNote}>
          After you log on, you can add or change accounts.<br />
          Just go to Control Panel and click User Accounts.
        </p>
      </div>
    </div>
  );
}
