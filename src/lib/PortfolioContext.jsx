'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getPortfolioData, seedPortfolioData, savePortfolioSection } from './supabase';
import defaultPortfolioData from './portfolioData';

const PortfolioContext = createContext(null);

export function PortfolioProvider({ children }) {
  const [data, setData] = useState(defaultPortfolioData);
  const [loading, setLoading] = useState(true);

  // Load portfolio data from Supabase on mount
  useEffect(() => {
    const load = async () => {
      try {
        let remoteData = await getPortfolioData();
        if (!remoteData) {
          // First time — seed Supabase with the static defaults
          await seedPortfolioData(defaultPortfolioData);
          remoteData = defaultPortfolioData;
        }
        setData({ ...defaultPortfolioData, ...remoteData });
      } catch (err) {
        console.warn('Supabase unavailable, using defaults:', err);
        setData(defaultPortfolioData);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Save a specific section and update local state
  const updateSection = useCallback(async (section, sectionData) => {
    try {
      await savePortfolioSection(section, sectionData);
      setData((prev) => ({ ...prev, [section]: sectionData }));
      return true;
    } catch (err) {
      console.error(`Failed to save ${section}:`, err);
      return false;
    }
  }, []);

  // Refresh data from Supabase
  const refreshData = useCallback(async () => {
    try {
      const remoteData = await getPortfolioData();
      if (remoteData) {
        setData({ ...defaultPortfolioData, ...remoteData });
      }
    } catch (err) {
      console.error('Failed to refresh portfolio data:', err);
    }
  }, []);

  return (
    <PortfolioContext.Provider value={{ data, loading, updateSection, refreshData }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolioData() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) {
    throw new Error('usePortfolioData must be used within a PortfolioProvider');
  }
  return ctx;
}

export default PortfolioContext;
