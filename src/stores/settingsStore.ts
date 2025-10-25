import {create} from 'zustand';
import {AppSettings} from '../types';
import {databaseService} from '../services/database';

interface SettingsState extends AppSettings {
  isLoading: boolean;
  error: string | null;

  // Actions
  loadSettings: () => Promise<void>;
  updateSettings: (settings: Partial<AppSettings>) => Promise<void>;
  setPro: (isPro: boolean) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  id: 'default',
  theme: 'auto',
  playbackSpeed: 1.0,
  smartSpeedEnabled: false,
  skipSilence: false,
  forwardSkipSeconds: 30,
  backwardSkipSeconds: 15,
  autoplay: true,
  sleepTimerMinutes: undefined,
  volumeBoost: 0,
  showWaveform: true,
  hapticFeedback: true,
  lockScreenControls: true,
  downloadQuality: 'high',
  storageLimit: undefined,
  isPro: false,
  isLoading: false,
  error: null,

  loadSettings: async () => {
    set({isLoading: true, error: null});
    try {
      const settings = await databaseService.getSettings();
      set({...settings, isLoading: false});
    } catch (error) {
      set({error: (error as Error).message, isLoading: false});
    }
  },

  updateSettings: async (settings: Partial<AppSettings>) => {
    try {
      await databaseService.updateSettings(settings);
      set(settings);
    } catch (error) {
      set({error: (error as Error).message});
    }
  },

  setPro: async (isPro: boolean) => {
    await get().updateSettings({isPro});
  },
}));
