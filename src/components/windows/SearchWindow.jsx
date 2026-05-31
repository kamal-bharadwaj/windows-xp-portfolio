'use client';
import { useState } from 'react';
import styles from './SearchWindow.module.css';
import portfolioData from '@/lib/portfolioData';

const { personal, skills, projects, education, experience, awards } = portfolioData;

// Build a flat searchable index
const buildIndex = () => {
  const entries = [];
  entries.push({ category: 'About', label: 'Name', value: personal.name });
  entries.push({ category: 'About', label: 'Location', value: personal.location });
  entries.push({ category: 'About', label: 'Email', value: personal.email });
  entries.push({ category: 'About', label: 'Bio', value: personal.bio });

  Object.entries(skills).forEach(([cat, items]) => {
    items.forEach((s) => entries.push({ category: 'Skills', label: cat, value: s }));
  });
  projects.forEach((p) => {
    entries.push({ category: 'Projects', label: p.title, value: p.description });
    p.tags.forEach((t) => entries.push({ category: 'Projects', label: p.title, value: t }));
    p.highlights.forEach((h) => entries.push({ category: 'Projects', label: p.title, value: h }));
  });
  education.forEach((e) => entries.push({ category: 'Education', label: e.degree, value: e.institution }));
  experience.forEach((e) => entries.push({ category: 'Experience', label: e.role, value: e.org }));
  awards.forEach((a) => entries.push({ category: 'Awards', label: 'Achievement', value: a.text }));
  return entries;
};

const INDEX = buildIndex();

export default function SearchWindow({ openWindow }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  const doSearch = () => {
    if (!query.trim()) return;
    const q = query.toLowerCase();
    const found = INDEX.filter(
      (e) => e.value.toLowerCase().includes(q) || e.label.toLowerCase().includes(q)
    );
    // deduplicate by value+category
    const seen = new Set();
    const deduped = found.filter((e) => {
      const key = `${e.category}:${e.label}:${e.value}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    setResults(deduped.slice(0, 20));
    setSearched(true);
  };

  const CATEGORY_WINDOW = { Skills: 'skills', Projects: 'projects', Education: 'skills', Experience: 'skills', Awards: 'about', About: 'about' };

  return (
    <div className={styles.wrap}>
      {/* Dog companion */}
      <div className={styles.companion}>
        <div className={styles.dogEmoji}>🐕</div>
        <div className={styles.bubble}>
          {!searched ? 'What are you looking for?' : results.length > 0 ? `Found ${results.length} result(s)!` : 'No results found. Try another search?'}
        </div>
      </div>

      {/* Search area */}
      <div className={styles.searchArea}>
        <p className={styles.prompt}>Search Kamal's portfolio:</p>
        <div className={styles.inputRow}>
          <input
            type="text"
            className={styles.searchInput}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && doSearch()}
            placeholder="e.g. Python, DRDO, Sign Language..."
            id="search-input"
            autoFocus
          />
          <button className={styles.searchBtn} onClick={doSearch} id="search-go-btn">
            <span className="material-symbols-outlined" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}>search</span>
            Search
          </button>
        </div>

        {/* Results */}
        {searched && (
          <div className={`${styles.results} xp-scroll`}>
            {results.length === 0 ? (
              <div className={styles.noResults}>No results. Try a different keyword.</div>
            ) : (
              <ul className={styles.resultList}>
                {results.map((r, i) => (
                  <li
                    key={i}
                    className={styles.resultItem}
                    onClick={() => openWindow(CATEGORY_WINDOW[r.category] || 'about')}
                    title={`Open ${r.category}`}
                  >
                    <span className={styles.resultCategory}>{r.category}</span>
                    <span className={styles.resultLabel}>{r.label}</span>
                    <span className={styles.resultValue}>
                      {r.value.length > 80 ? r.value.slice(0, 80) + '…' : r.value}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {!searched && (
          <div className={styles.suggestions}>
            <p className={styles.suggestTitle}>Try searching for:</p>
            {['Python', 'DRDO', 'Next.js', 'Sign Language', 'SGPA', 'Agra'].map((s) => (
              <button key={s} className={styles.suggestChip} onClick={() => { setQuery(s); }}>
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
