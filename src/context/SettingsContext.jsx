import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { resolveSettingsMedia } from '../lib/mediaStore';

const SettingsContext = createContext({
  settings: null,
  loading: true,
  refreshSettings: async () => {}
});

export const useSettings = () => useContext(SettingsContext);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const applySettings = useCallback(async (rawSettings) => {
    if (!rawSettings) return;
    try {
      const resolved = await resolveSettingsMedia(rawSettings);
      setSettings(resolved);
    } catch {
      setSettings(rawSettings);
    }
  }, []);

  const fetchSettings = useCallback(async () => {
    try {
      // Load initial cache from localStorage first for instant rendering
      try {
        const cached = localStorage.getItem('cached_settings');
        if (cached) {
          const parsed = JSON.parse(cached);
          await applySettings(parsed);
        }
      } catch {}

      const { data, error } = await supabase.from('settings').select('*').single();
      if (data && !error) {
        await applySettings(data);
        localStorage.setItem('cached_settings', JSON.stringify(data));
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  }, [applySettings]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const refreshSettings = useCallback(async () => {
    await fetchSettings();
  }, [fetchSettings]);

  const value = { settings, loading, refreshSettings };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}
