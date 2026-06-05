'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getPortfolioData, seedPortfolioData, savePortfolioSection } from './firebase';
import defaultPortfolioData from './portfolioData';

const PortfolioContext = createContext(null);

export function PortfolioProvider({ children }) {
  const [data, setData] = useState(defaultPortfolioData);
  const [loading, setLoading] = useState(true);

  // Load portfolio data from Firestore on mount
  useEffect(() => {
    const load = async () => {
      try {
        let firestoreData = await getPortfolioData();
        if (!firestoreData) {
          // First time — seed Firestore with the static defaults
          await seedPortfolioData(defaultPortfolioData);
          firestoreData = defaultPortfolioData;
        }
        setData(firestoreData);
      } catch (err) {
        console.warn('Failed to load portfolio data from Firestore, using defaults:', err);
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

  // Refresh data from Firestore
  const refreshData = useCallback(async () => {
    try {
      const firestoreData = await getPortfolioData();
      if (firestoreData) {
        setData(firestoreData);
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
