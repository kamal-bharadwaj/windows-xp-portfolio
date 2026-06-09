'use client';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// ─── Health Guard ──────────────────────────────────────────────
// Once a network/DNS failure is detected we stop all subsequent
// Supabase calls so the browser console isn't flooded with
// net::ERR_NAME_NOT_RESOLVED for every render / tab switch.
let _supabaseHealthy = !!(supabaseUrl && supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] env vars missing — check NEXT_PUBLIC_SUPABASE_URL and ' +
    'NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local. Running in offline/fallback mode.'
  );
}

// Build the client only when credentials exist.
export const supabase = _supabaseHealthy
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Wrap every Supabase query.
 * • If the client is already marked offline → throws immediately (no fetch).
 * • If a network error occurs → marks offline and re-throws so callers can
 *   gracefully fall back to local defaults.
 * @param {() => Promise<{data: any, error: any}>} queryFn
 */
async function handleRequest(queryFn) {
  if (!_supabaseHealthy || !supabase) {
    throw new Error('Supabase is not available (offline/unconfigured).');
  }

  try {
    const result = await queryFn();
    // PostgREST wraps errors inside `result.error`; network errors are thrown.
    return result;
  } catch (err) {
    // Detect DNS / network failures and mark client offline.
    const isNetworkError =
      err?.message?.includes('Failed to fetch') ||
      err?.message?.includes('ERR_NAME_NOT_RESOLVED') ||
      err?.message?.includes('NetworkError') ||
      err?.name === 'TypeError';

    if (isNetworkError) {
      _supabaseHealthy = false;
      console.warn(
        '[Supabase] Network error — switching to offline/fallback mode. ' +
        'Check your Supabase project URL and ensure the project is active.'
      );
    }
    throw err;
  }
}

// ─── Portfolio Data ────────────────────────────────────────────

/** Fetch portfolio data from Supabase */
export const getPortfolioData = async () => {
  const { data, error } = await handleRequest(() =>
    supabase.from('portfolio').select('data').eq('id', 'main').single()
  );

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = row not found
  return data?.data ?? null;
};

/** Seed Supabase with default data if no row exists */
export const seedPortfolioData = async (defaultData) => {
  const { data: existing } = await handleRequest(() =>
    supabase.from('portfolio').select('id').eq('id', 'main').single()
  );

  if (!existing) {
    const { error } = await handleRequest(() =>
      supabase.from('portfolio').insert({ id: 'main', data: defaultData })
    );
    if (error) throw error;
    return true; // seeded
  }
  return false; // already existed
};

/** Save a single section (e.g. 'personal', 'projects') */
export const savePortfolioSection = async (section, sectionData) => {
  // Read existing data first, then merge
  const existing = await getPortfolioData();
  const merged = { ...(existing || {}), [section]: sectionData };

  const { error } = await handleRequest(() =>
    supabase
      .from('portfolio')
      .upsert({ id: 'main', data: merged, updated_at: new Date().toISOString() })
  );

  if (error) throw error;
};

/** Save the entire portfolio data object at once */
export const saveFullPortfolioData = async (data) => {
  const { error } = await handleRequest(() =>
    supabase
      .from('portfolio')
      .upsert({ id: 'main', data, updated_at: new Date().toISOString() })
  );

  if (error) throw error;
};

// ─── Contact Messages ──────────────────────────────────────────

/** Submit a new contact message */
export const submitContactMessage = async ({ name, email, message }) => {
  const { data, error } = await handleRequest(() =>
    supabase.from('contacts').insert({ name, email, message }).select().single()
  );

  if (error) throw error;
  return data.id;
};

/** Get all contact messages (newest first) */
export const getContactMessages = async () => {
  const { data, error } = await handleRequest(() =>
    supabase.from('contacts').select('*').order('created_at', { ascending: false })
  );

  if (error) throw error;
  return data || [];
};

/** Delete a contact message by ID */
export const deleteContactMessage = async (id) => {
  const { error } = await handleRequest(() =>
    supabase.from('contacts').delete().eq('id', id)
  );

  if (error) throw error;
};
