// Settings management with localStorage persistence

const STORAGE_KEY = 'tart-settings';

export interface Settings {
  apiUrl: string;
  refreshRate: number;
}

const DEFAULT_SETTINGS: Settings = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  refreshRate: 5,
};

// Event for settings changes
type SettingsChangeHandler = (settings: Settings) => void;
const changeHandlers: Set<SettingsChangeHandler> = new Set();

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function getSettings(): Settings {
  if (!isBrowser()) {
    return DEFAULT_SETTINGS;
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error('Failed to load settings:', e);
  }
  
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: Partial<Settings>): Settings {
  if (!isBrowser()) {
    return DEFAULT_SETTINGS;
  }
  
  const current = getSettings();
  const updated = { ...current, ...settings };
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    changeHandlers.forEach(h => h(updated));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
  
  return updated;
}

export function onSettingsChange(handler: SettingsChangeHandler): () => void {
  changeHandlers.add(handler);
  return () => changeHandlers.delete(handler);
}

// Convenience getters
export function getApiBase(): string {
  return getSettings().apiUrl;
}

export function getWsUrl(): string {
  const base = getApiBase();
  // Convert HTTP URL to WebSocket URL
  const wsBase = base.replace(/^http/, 'ws');
  return `${wsBase}/api/ws`;
}
