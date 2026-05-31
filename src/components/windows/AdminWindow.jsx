'use client';
import { useState, useEffect } from 'react';
import styles from './AdminWindow.module.css';
import { getContactMessages } from '@/lib/firebase';
import portfolioData from '@/lib/portfolioData';

const { personal } = portfolioData;

export default function AdminWindow({ user }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isAdmin = user && user.email === personal.adminEmail;

  useEffect(() => {
    if (!isAdmin) return;
    const load = async () => {
      try {
        const msgs = await getContactMessages();
        setMessages(msgs);
      } catch (e) {
        setError('Failed to load messages. Ensure Firestore rules allow admin reads.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className={styles.denied}>
        <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#ba1a1a', fontVariationSettings: "'FILL' 1" }}>lock</span>
        <h2 className={styles.deniedTitle}>Access Denied</h2>
        <p className={styles.deniedMsg}>
          This panel is only accessible to the portfolio administrator.<br />
          Please log in with <strong>{personal.adminEmail}</strong> to continue.
        </p>
      </div>
    );
  }

  return (
    <div className={`${styles.wrap} xp-scroll`}>
      <div className={styles.header}>
        <span className="material-symbols-outlined" style={{ fontSize: 24, color: '#245edb', fontVariationSettings: "'FILL' 1" }}>admin_panel_settings</span>
        <div>
          <h2 className={styles.title}>Portfolio Admin Panel</h2>
          <p className={styles.subtitle}>Contact message inbox — {messages.length} message(s)</p>
        </div>
        <button className={styles.refreshBtn} onClick={async () => {
          setLoading(true);
          try { setMessages(await getContactMessages()); } catch {}
          setLoading(false);
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>refresh</span>
          Refresh
        </button>
      </div>

      {loading && (
        <div className={styles.loadRow}>
          <div className={styles.spinner} />
          Loading messages...
        </div>
      )}
      {error && <div className={styles.errBox}>{error}</div>}

      {!loading && messages.length === 0 && !error && (
        <div className={styles.empty}>
          <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#c3c6d6' }}>inbox</span>
          <p>No messages yet. Share your portfolio and they will come!</p>
        </div>
      )}

      <div className={styles.messageList}>
        {messages.map((m) => (
          <div key={m.id} className={styles.card}>
            <div className={styles.cardTop}>
              <div>
                <span className={styles.msgName}>{m.name}</span>
                <span className={styles.msgEmail}>&lt;{m.email}&gt;</span>
              </div>
              <span className={styles.msgTime}>
                {m.timestamp?.toDate ? new Date(m.timestamp.toDate()).toLocaleString() : '—'}
              </span>
            </div>
            <div className={styles.cardBody}>{m.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
