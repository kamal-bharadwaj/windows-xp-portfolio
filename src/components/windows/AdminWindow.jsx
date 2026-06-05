'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './AdminWindow.module.css';
import { usePortfolioData } from '@/lib/PortfolioContext';
import { getContactMessages, deleteContactMessage } from '@/lib/firebase';

/* ── Sidebar tabs ──────────────────────────────────────── */
const TABS = [
  { key: 'messages',  label: 'Messages',  icon: 'mail' },
  { key: 'about',     label: 'About Me',  icon: 'person' },
  { key: 'projects',  label: 'Projects',  icon: 'code' },
  { key: 'skills',    label: 'Skills',    icon: 'psychology' },
  { key: 'resume',    label: 'Resume',    icon: 'work_history' },
  { key: 'awards',    label: 'Awards',    icon: 'emoji_events' },
];

/* ── Helpers ───────────────────────────────────────────── */
const blankProject = () => ({
  title: '', description: '', tags: [], icon: 'code', color: '#245edb', highlights: [],
});
const blankEducation = () => ({
  degree: '', minor: '', institution: '', period: '', score: '', icon: 'school',
});
const blankExperience = () => ({
  role: '', org: '', location: '', period: '', highlights: [], icon: 'work',
});
const blankAward = () => ({ text: '', icon: 'emoji_events' });

/* ═══════════════════════════════════════════════════════ */
export default function AdminWindow({ user, showToast }) {
  const { data, loading: ctxLoading, updateSection } = usePortfolioData();

  const [tab, setTab] = useState('messages');

  /* ── Messages state ─────────────────────────────────── */
  const [messages, setMessages] = useState([]);
  const [msgsLoading, setMsgsLoading] = useState(false);
  const [msgsError, setMsgsError] = useState('');

  /* ── About Me state ─────────────────────────────────── */
  const [personal, setPersonal] = useState({});

  /* ── Projects state ─────────────────────────────────── */
  const [projects, setProjects] = useState([]);

  /* ── Skills state ───────────────────────────────────── */
  const [skills, setSkills] = useState({});
  const [newCatName, setNewCatName] = useState('');

  /* ── Resume state ───────────────────────────────────── */
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);

  /* ── Awards state ───────────────────────────────────── */
  const [awards, setAwards] = useState([]);

  /* ── Feedback state ─────────────────────────────────── */
  const [saving, setSaving] = useState(false);
  const [alertMsg, setAlertMsg] = useState({ type: '', text: '' });

  /* ── Sync local state from context when data changes ── */
  useEffect(() => {
    if (!data) return;
    setPersonal({ ...data.personal });
    setProjects(data.projects ? data.projects.map((p) => ({ ...p, tags: [...(p.tags || [])], highlights: [...(p.highlights || [])] })) : []);
    setSkills(data.skills ? JSON.parse(JSON.stringify(data.skills)) : {});
    setEducation(data.education ? data.education.map((e) => ({ ...e })) : []);
    setExperience(data.experience ? data.experience.map((e) => ({ ...e, highlights: [...(e.highlights || [])] })) : []);
    setAwards(data.awards ? data.awards.map((a) => ({ ...a })) : []);
  }, [data]);

  /* ── Load messages ──────────────────────────────────── */
  const loadMessages = useCallback(async () => {
    setMsgsLoading(true);
    setMsgsError('');
    try {
      const msgs = await getContactMessages();
      setMessages(msgs);
    } catch {
      setMsgsError('Failed to load messages.');
    } finally {
      setMsgsLoading(false);
    }
  }, []);

  // Load messages when we first switch to the tab
  useEffect(() => {
    if (tab === 'messages') loadMessages();
  }, [tab, loadMessages]);

  /* ── Flash a success / error alert ──────────────────── */
  const flash = useCallback((type, text) => {
    setAlertMsg({ type, text });
    if (showToast) showToast(text, type);
    setTimeout(() => setAlertMsg({ type: '', text: '' }), 3000);
  }, [showToast]);

  /* ── Generic save helper ────────────────────────────── */
  const save = useCallback(async (section, payload) => {
    setSaving(true);
    const ok = await updateSection(section, payload);
    setSaving(false);
    if (ok) flash('success', `${section} saved successfully!`);
    else flash('error', `Failed to save ${section}.`);
  }, [updateSection, flash]);

  /* ── Admin check ────────────────────────────────────── */
  const isAdmin = user && data?.personal?.adminEmail && user.email === data.personal.adminEmail;

  if (ctxLoading) {
    return (
      <div className={styles.wrap}>
        <div className={styles.loadRow}><div className={styles.spinner} />Loading admin panel…</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className={styles.denied}>
        <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#ba1a1a', fontVariationSettings: "'FILL' 1" }}>lock</span>
        <h2 className={styles.deniedTitle}>Access Denied</h2>
        <p className={styles.deniedMsg}>
          This panel is only accessible to the portfolio administrator.<br />
          Please log in with <strong>{data?.personal?.adminEmail || 'admin'}</strong> to continue.
        </p>
      </div>
    );
  }

  /* ═════════ Tab content renderers ═════════════════════ */

  /* ── Messages ───────────────────────────────────────── */
  const renderMessages = () => (
    <>
      <div className={styles.sectionHeader}>
        <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#245edb' }}>mail</span>
        <h2>Contact Messages ({messages.length})</h2>
        <button className={styles.refreshBtn} onClick={loadMessages}>
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>refresh</span>Refresh
        </button>
      </div>

      {msgsLoading && <div className={styles.loadRow}><div className={styles.spinner} />Loading…</div>}
      {msgsError && <div className={styles.errBox}>{msgsError}</div>}

      {!msgsLoading && messages.length === 0 && !msgsError && (
        <div className={styles.emptyState}>
          <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#c3c6d6' }}>inbox</span>
          <p>No messages yet.</p>
        </div>
      )}

      {messages.map((m) => (
        <div key={m.id} className={styles.msgCard}>
          <div className={styles.msgCardTop}>
            <div>
              <span className={styles.msgName}>{m.name}</span>
              <span className={styles.msgEmail}>&lt;{m.email}&gt;</span>
            </div>
            <span className={styles.msgTime}>
              {m.timestamp?.toDate ? new Date(m.timestamp.toDate()).toLocaleString() : '—'}
            </span>
          </div>
          <div className={styles.msgBody}>{m.message}</div>
          <div className={styles.cardActions}>
            <button className={styles.deleteBtn} onClick={async () => {
              try {
                await deleteContactMessage(m.id);
                setMessages((prev) => prev.filter((msg) => msg.id !== m.id));
                flash('success', 'Message deleted.');
              } catch {
                flash('error', 'Failed to delete message.');
              }
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>delete</span>Delete
            </button>
          </div>
        </div>
      ))}
    </>
  );

  /* ── About Me ───────────────────────────────────────── */
  const handlePersonalChange = (key, value) => setPersonal((p) => ({ ...p, [key]: value }));

  const renderAbout = () => (
    <>
      <div className={styles.sectionHeader}>
        <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#245edb' }}>person</span>
        <h2>About Me</h2>
        <button className={styles.saveBtn} disabled={saving} onClick={() => save('personal', personal)}>
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>save</span>{saving ? 'Saving…' : 'Save'}
        </button>
      </div>
      {alertMsg.text && <div className={alertMsg.type === 'success' ? styles.successBox : styles.errBox}>{alertMsg.text}</div>}

      <div className={styles.fieldRow}>
        <div className={styles.field}><label className={styles.label}>Name</label><input className={styles.input} value={personal.name || ''} onChange={(e) => handlePersonalChange('name', e.target.value)} /></div>
        <div className={styles.field}><label className={styles.label}>Title</label><input className={styles.input} value={personal.title || ''} onChange={(e) => handlePersonalChange('title', e.target.value)} /></div>
      </div>
      <div className={styles.fieldRow}>
        <div className={styles.field}><label className={styles.label}>Location</label><input className={styles.input} value={personal.location || ''} onChange={(e) => handlePersonalChange('location', e.target.value)} /></div>
        <div className={styles.field}><label className={styles.label}>Phone</label><input className={styles.input} value={personal.phone || ''} onChange={(e) => handlePersonalChange('phone', e.target.value)} /></div>
      </div>
      <div className={styles.fieldRow}>
        <div className={styles.field}><label className={styles.label}>Email</label><input className={styles.input} value={personal.email || ''} onChange={(e) => handlePersonalChange('email', e.target.value)} /></div>
        <div className={styles.field}><label className={styles.label}>SGPA</label><input className={styles.input} value={personal.sgpa || ''} onChange={(e) => handlePersonalChange('sgpa', e.target.value)} /></div>
      </div>
      <div className={styles.fieldRow}>
        <div className={styles.field}><label className={styles.label}>LinkedIn</label><input className={styles.input} value={personal.linkedin || ''} onChange={(e) => handlePersonalChange('linkedin', e.target.value)} /></div>
        <div className={styles.field}><label className={styles.label}>GitHub</label><input className={styles.input} value={personal.github || ''} onChange={(e) => handlePersonalChange('github', e.target.value)} /></div>
      </div>
      <div className={styles.field}><label className={styles.label}>Bio</label><textarea className={styles.textarea} rows={5} value={personal.bio || ''} onChange={(e) => handlePersonalChange('bio', e.target.value)} /></div>
    </>
  );

  /* ── Projects ───────────────────────────────────────── */
  const updateProject = (idx, key, value) => {
    setProjects((prev) => {
      const copy = prev.map((p) => ({ ...p }));
      copy[idx] = { ...copy[idx], [key]: value };
      return copy;
    });
  };

  const renderProjects = () => (
    <>
      <div className={styles.sectionHeader}>
        <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#245edb' }}>code</span>
        <h2>Projects ({projects.length})</h2>
        <button className={styles.addBtn} onClick={() => setProjects((p) => [blankProject(), ...p])}>
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>add</span>Add New Project
        </button>
        <button className={styles.saveBtn} disabled={saving} onClick={() => save('projects', projects)}>
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>save</span>{saving ? 'Saving…' : 'Save All'}
        </button>
      </div>
      {alertMsg.text && <div className={alertMsg.type === 'success' ? styles.successBox : styles.errBox}>{alertMsg.text}</div>}

      {projects.map((proj, i) => (
        <div key={i} className={styles.itemGroup}>
          <div className={styles.itemGroupHeader}>
            <span>{proj.title || `Project #${i + 1}`}</span>
            <button className={styles.deleteBtn} onClick={() => setProjects((p) => p.filter((_, j) => j !== i))}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>delete</span>Remove
            </button>
          </div>
          <div className={styles.fieldRow}>
            <div className={styles.field}><label className={styles.label}>Title</label><input className={styles.input} value={proj.title} onChange={(e) => updateProject(i, 'title', e.target.value)} /></div>
            <div className={styles.field}><label className={styles.label}>Icon (Material Symbol)</label><input className={styles.input} value={proj.icon || ''} onChange={(e) => updateProject(i, 'icon', e.target.value)} /></div>
            <div className={styles.field}><label className={styles.label}>Color</label><input className={styles.input} type="color" value={proj.color || '#245edb'} onChange={(e) => updateProject(i, 'color', e.target.value)} /></div>
          </div>
          <div className={styles.field}><label className={styles.label}>Description</label><textarea className={styles.textarea} rows={3} value={proj.description} onChange={(e) => updateProject(i, 'description', e.target.value)} /></div>
          <div className={styles.field}><label className={styles.label}>Tags (comma-separated)</label><input className={styles.input} value={(proj.tags || []).join(', ')} onChange={(e) => updateProject(i, 'tags', e.target.value.split(',').map((t) => t.trim()).filter(Boolean))} /></div>
          <div className={styles.field}><label className={styles.label}>Highlights (one per line)</label><textarea className={styles.textarea} rows={4} value={(proj.highlights || []).join('\n')} onChange={(e) => updateProject(i, 'highlights', e.target.value.split('\n'))} /></div>
        </div>
      ))}

      {projects.length === 0 && (
        <div className={styles.emptyState}>
          <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#c3c6d6' }}>folder_open</span>
          <p>No projects yet. Click &quot;Add New Project&quot; to get started.</p>
        </div>
      )}
    </>
  );

  /* ── Skills ─────────────────────────────────────────── */
  const renderSkills = () => {
    const categories = Object.keys(skills);

    const addSkill = (cat, skill) => {
      if (!skill.trim()) return;
      setSkills((prev) => ({ ...prev, [cat]: [...(prev[cat] || []), skill.trim()] }));
    };

    const removeSkill = (cat, idx) => {
      setSkills((prev) => ({ ...prev, [cat]: prev[cat].filter((_, i) => i !== idx) }));
    };

    const removeCategory = (cat) => {
      setSkills((prev) => {
        const copy = { ...prev };
        delete copy[cat];
        return copy;
      });
    };

    const addCategory = () => {
      if (!newCatName.trim() || skills[newCatName.trim()]) return;
      setSkills((prev) => ({ ...prev, [newCatName.trim()]: [] }));
      setNewCatName('');
    };

    return (
      <>
        <div className={styles.sectionHeader}>
          <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#245edb' }}>psychology</span>
          <h2>Skills ({categories.length} categories)</h2>
          <button className={styles.saveBtn} disabled={saving} onClick={() => save('skills', skills)}>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>save</span>{saving ? 'Saving…' : 'Save'}
          </button>
        </div>
        {alertMsg.text && <div className={alertMsg.type === 'success' ? styles.successBox : styles.errBox}>{alertMsg.text}</div>}

        {categories.map((cat) => (
          <div key={cat} className={styles.itemGroup}>
            <div className={styles.itemGroupHeader}>
              <span>{cat}</span>
              <button className={styles.deleteBtn} onClick={() => removeCategory(cat)}>
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>delete</span>Remove
              </button>
            </div>
            <div className={styles.chipWrap}>
              {(skills[cat] || []).map((sk, j) => (
                <span key={j} className={styles.chip}>
                  {sk}
                  <button className={styles.chipRemove} onClick={() => removeSkill(cat, j)} title="Remove skill">×</button>
                </span>
              ))}
            </div>
            <SkillAdder onAdd={(v) => addSkill(cat, v)} />
          </div>
        ))}

        <hr className={styles.divider} />
        <div className={styles.btnRow}>
          <input className={styles.tagInput} placeholder="New category name…" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') addCategory(); }} />
          <button className={styles.addBtn} onClick={addCategory}>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>add</span>Add Category
          </button>
        </div>
      </>
    );
  };

  /* ── Resume (Education + Experience) ────────────────── */
  const updateEducation = (idx, key, value) => {
    setEducation((prev) => {
      const copy = prev.map((e) => ({ ...e }));
      copy[idx] = { ...copy[idx], [key]: value };
      return copy;
    });
  };

  const updateExperience = (idx, key, value) => {
    setExperience((prev) => {
      const copy = prev.map((e) => ({ ...e }));
      copy[idx] = { ...copy[idx], [key]: value };
      return copy;
    });
  };

  const renderResume = () => (
    <>
      <div className={styles.sectionHeader}>
        <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#245edb' }}>work_history</span>
        <h2>Resume</h2>
        <button className={styles.saveBtn} disabled={saving} onClick={async () => {
          setSaving(true);
          const ok1 = await updateSection('education', education);
          const ok2 = await updateSection('experience', experience);
          setSaving(false);
          if (ok1 && ok2) flash('success', 'Resume saved successfully!');
          else flash('error', 'Failed to save resume.');
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>save</span>{saving ? 'Saving…' : 'Save All'}
        </button>
      </div>
      {alertMsg.text && <div className={alertMsg.type === 'success' ? styles.successBox : styles.errBox}>{alertMsg.text}</div>}

      {/* Education */}
      <h3 style={{ fontSize: 13, color: '#245edb', margin: '0 0 8px' }}>
        <span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: 'middle', marginRight: 4 }}>school</span>
        Education ({education.length})
      </h3>
      <div className={styles.btnRow} style={{ marginBottom: 10 }}>
        <button className={styles.addBtn} onClick={() => setEducation((p) => [blankEducation(), ...p])}>
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>add</span>Add Education
        </button>
      </div>

      {education.map((edu, i) => (
        <div key={i} className={styles.itemGroup}>
          <div className={styles.itemGroupHeader}>
            <span>{edu.degree || `Education #${i + 1}`}</span>
            <button className={styles.deleteBtn} onClick={() => setEducation((p) => p.filter((_, j) => j !== i))}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>delete</span>Remove
            </button>
          </div>
          <div className={styles.fieldRow}>
            <div className={styles.field}><label className={styles.label}>Degree</label><input className={styles.input} value={edu.degree || ''} onChange={(e) => updateEducation(i, 'degree', e.target.value)} /></div>
            <div className={styles.field}><label className={styles.label}>Minor</label><input className={styles.input} value={edu.minor || ''} onChange={(e) => updateEducation(i, 'minor', e.target.value)} /></div>
          </div>
          <div className={styles.fieldRow}>
            <div className={styles.field}><label className={styles.label}>Institution</label><input className={styles.input} value={edu.institution || ''} onChange={(e) => updateEducation(i, 'institution', e.target.value)} /></div>
            <div className={styles.field}><label className={styles.label}>Icon</label><input className={styles.input} value={edu.icon || ''} onChange={(e) => updateEducation(i, 'icon', e.target.value)} /></div>
          </div>
          <div className={styles.fieldRow}>
            <div className={styles.field}><label className={styles.label}>Period</label><input className={styles.input} value={edu.period || ''} onChange={(e) => updateEducation(i, 'period', e.target.value)} /></div>
            <div className={styles.field}><label className={styles.label}>Score</label><input className={styles.input} value={edu.score || ''} onChange={(e) => updateEducation(i, 'score', e.target.value)} /></div>
          </div>
        </div>
      ))}

      <hr className={styles.divider} />

      {/* Experience */}
      <h3 style={{ fontSize: 13, color: '#245edb', margin: '0 0 8px' }}>
        <span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: 'middle', marginRight: 4 }}>work</span>
        Experience ({experience.length})
      </h3>
      <div className={styles.btnRow} style={{ marginBottom: 10 }}>
        <button className={styles.addBtn} onClick={() => setExperience((p) => [blankExperience(), ...p])}>
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>add</span>Add Experience
        </button>
      </div>

      {experience.map((exp, i) => (
        <div key={i} className={styles.itemGroup}>
          <div className={styles.itemGroupHeader}>
            <span>{exp.role || `Experience #${i + 1}`}</span>
            <button className={styles.deleteBtn} onClick={() => setExperience((p) => p.filter((_, j) => j !== i))}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>delete</span>Remove
            </button>
          </div>
          <div className={styles.fieldRow}>
            <div className={styles.field}><label className={styles.label}>Role</label><input className={styles.input} value={exp.role || ''} onChange={(e) => updateExperience(i, 'role', e.target.value)} /></div>
            <div className={styles.field}><label className={styles.label}>Organization</label><input className={styles.input} value={exp.org || ''} onChange={(e) => updateExperience(i, 'org', e.target.value)} /></div>
          </div>
          <div className={styles.fieldRow}>
            <div className={styles.field}><label className={styles.label}>Location</label><input className={styles.input} value={exp.location || ''} onChange={(e) => updateExperience(i, 'location', e.target.value)} /></div>
            <div className={styles.field}><label className={styles.label}>Period</label><input className={styles.input} value={exp.period || ''} onChange={(e) => updateExperience(i, 'period', e.target.value)} /></div>
          </div>
          <div className={styles.fieldRow}>
            <div className={styles.field}><label className={styles.label}>Icon</label><input className={styles.input} value={exp.icon || ''} onChange={(e) => updateExperience(i, 'icon', e.target.value)} /></div>
          </div>
          <div className={styles.field}><label className={styles.label}>Highlights (one per line)</label><textarea className={styles.textarea} rows={4} value={(exp.highlights || []).join('\n')} onChange={(e) => updateExperience(i, 'highlights', e.target.value.split('\n'))} /></div>
        </div>
      ))}
    </>
  );

  /* ── Awards ─────────────────────────────────────────── */
  const updateAward = (idx, key, value) => {
    setAwards((prev) => {
      const copy = prev.map((a) => ({ ...a }));
      copy[idx] = { ...copy[idx], [key]: value };
      return copy;
    });
  };

  const renderAwards = () => (
    <>
      <div className={styles.sectionHeader}>
        <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#245edb' }}>emoji_events</span>
        <h2>Awards ({awards.length})</h2>
        <button className={styles.addBtn} onClick={() => setAwards((a) => [blankAward(), ...a])}>
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>add</span>Add Award
        </button>
        <button className={styles.saveBtn} disabled={saving} onClick={() => save('awards', awards)}>
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>save</span>{saving ? 'Saving…' : 'Save'}
        </button>
      </div>
      {alertMsg.text && <div className={alertMsg.type === 'success' ? styles.successBox : styles.errBox}>{alertMsg.text}</div>}

      {awards.map((aw, i) => (
        <div key={i} className={styles.itemGroup}>
          <div className={styles.itemGroupHeader}>
            <span>
              <span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: 'middle', marginRight: 4 }}>{aw.icon || 'emoji_events'}</span>
              {aw.text ? aw.text.substring(0, 50) : `Award #${i + 1}`}
            </span>
            <button className={styles.deleteBtn} onClick={() => setAwards((a) => a.filter((_, j) => j !== i))}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>delete</span>Remove
            </button>
          </div>
          <div className={styles.fieldRow}>
            <div className={styles.field} style={{ flex: 3 }}><label className={styles.label}>Award Text</label><input className={styles.input} value={aw.text} onChange={(e) => updateAward(i, 'text', e.target.value)} /></div>
            <div className={styles.field} style={{ flex: 1 }}><label className={styles.label}>Icon</label><input className={styles.input} value={aw.icon} onChange={(e) => updateAward(i, 'icon', e.target.value)} /></div>
          </div>
        </div>
      ))}

      {awards.length === 0 && (
        <div className={styles.emptyState}>
          <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#c3c6d6' }}>emoji_events</span>
          <p>No awards yet. Click &quot;Add Award&quot; to create one.</p>
        </div>
      )}
    </>
  );

  /* ── Tab body switch ────────────────────────────────── */
  const renderTab = () => {
    switch (tab) {
      case 'messages': return renderMessages();
      case 'about':    return renderAbout();
      case 'projects': return renderProjects();
      case 'skills':   return renderSkills();
      case 'resume':   return renderResume();
      case 'awards':   return renderAwards();
      default:         return null;
    }
  };

  /* ═════════ Main render ══════════════════════════════= */
  return (
    <div className={styles.wrap}>
      <div className={styles.layout}>
        {/* Sidebar */}
        <nav className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>admin_panel_settings</span>
            Admin Panel
          </div>
          {TABS.map((t) => (
            <button
              key={t.key}
              className={tab === t.key ? styles.sidebarItemActive : styles.sidebarItem}
              onClick={() => { setTab(t.key); setAlertMsg({ type: '', text: '' }); }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className={`${styles.content} xp-scroll`}>
          {renderTab()}
        </div>
      </div>
    </div>
  );
}

/* ── Tiny sub-component for adding a skill ────────────── */
function SkillAdder({ onAdd }) {
  const [value, setValue] = useState('');
  return (
    <div className={styles.btnRow}>
      <input
        className={styles.tagInput}
        placeholder="Add skill…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && value.trim()) { onAdd(value); setValue(''); } }}
      />
      <button className={styles.addBtn} onClick={() => { if (value.trim()) { onAdd(value); setValue(''); } }}>
        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>add</span>Add
      </button>
    </div>
  );
}
