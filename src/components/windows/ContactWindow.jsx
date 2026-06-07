'use client';
import { useState, useEffect } from 'react';
import styles from './ContactWindow.module.css';
import { submitContactMessage } from '@/lib/firebase';
import { usePortfolioData } from '@/lib/PortfolioContext';

export default function ContactWindow({ showToast }) {
  const { data } = usePortfolioData();
  const { personal } = data;
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      showToast('Please fill in all fields.', 'error');
      return;
    }
    setStatus('loading');
    try {
      await submitContactMessage(form);
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
      showToast('Message sent! Kamal will reply soon 📬', 'success');
    } catch (err) {
      setStatus('error');
      showToast('Failed to send. Check Firebase config.', 'error');
    }
  };

  // Auto-reset success state so form is re-usable
  useEffect(() => {
    if (status === 'success') {
      const t = setTimeout(() => setStatus('idle'), 4000);
      return () => clearTimeout(t);
    }
  }, [status]);

  return (
    <div className={styles.wrap}>
      {/* Left: info */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTitle}>Get In Touch</div>
        <div className={styles.contactList}>
          <a href={`mailto:${personal.email}`} className={styles.cItem}>
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#245edb', fontVariationSettings: "'FILL' 1" }}>mail</span>
            <span className={styles.cLabel}>Email</span>
            <span className={styles.cVal}>{personal.email}</span>
          </a>
          <a href={`tel:${personal.phone}`} className={styles.cItem}>
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#245edb', fontVariationSettings: "'FILL' 1" }}>phone</span>
            <span className={styles.cLabel}>Phone</span>
            <span className={styles.cVal}>{personal.phone}</span>
          </a>
          <div className={styles.cItem}>
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#245edb', fontVariationSettings: "'FILL' 1" }}>location_on</span>
            <span className={styles.cLabel}>Location</span>
            <span className={styles.cVal}>{personal.location}</span>
          </div>
          <a href={`https://${personal.linkedin}`} target="_blank" rel="noreferrer" className={styles.cItem}>
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#245edb', fontVariationSettings: "'FILL' 1" }}>work</span>
            <span className={styles.cLabel}>LinkedIn</span>
            <span className={styles.cVal}>{personal.linkedin?.split('/').pop()}</span>
          </a>
          <a href={`https://${personal.github}`} target="_blank" rel="noreferrer" className={styles.cItem}>
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#245edb', fontVariationSettings: "'FILL' 1" }}>code</span>
            <span className={styles.cLabel}>GitHub</span>
            <span className={styles.cVal}>{personal.github?.split('/').pop()}</span>
          </a>
        </div>
      </aside>

      {/* Right: form */}
      <div className={styles.formWrap}>
        <h2 className={styles.formTitle}>Send a Message</h2>
        <p className={styles.formSubtitle}>Messages are saved to a database and Kamal will reply via email.</p>

        {status === 'success' && (
          <div className={styles.successBox}>
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#266c2d', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            Message sent successfully! Kamal will get back to you soon.
          </div>
        )}

        <div className={styles.field}>
          <label className={styles.label} htmlFor="contact-name">Your Name</label>
          <input id="contact-name" name="name" type="text" className={styles.input} value={form.name} onChange={handle} placeholder="John Doe" disabled={status === 'loading'} />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="contact-email">Email Address</label>
          <input id="contact-email" name="email" type="email" className={styles.input} value={form.email} onChange={handle} placeholder="you@example.com" disabled={status === 'loading'} />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="contact-message">Message</label>
          <textarea id="contact-message" name="message" className={styles.textarea} value={form.message} onChange={handle} placeholder="Hi Kamal, I'd like to..." rows={5} disabled={status === 'loading'} />
        </div>

        <div className={styles.btnRow}>
          <button className={styles.sendBtn} onClick={submit} disabled={status === 'loading'} id="contact-send-btn">
            {status === 'loading'
              ? <><span className="material-symbols-outlined" style={{ fontSize: 16, animation: 'spin 0.7s linear infinite' }}>autorenew</span> Sending...</>
              : <><span className="material-symbols-outlined" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}>send</span> Send Message</>
            }
          </button>
          <button className={styles.clearBtn} onClick={() => { setForm({ name: '', email: '', message: '' }); setStatus('idle'); }}>
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
