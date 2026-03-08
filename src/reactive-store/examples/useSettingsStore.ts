import { createGameStore } from '../src';
import { SuperSaveSystem } from '@game-libs/super-save-system';

// ─── State ─────────────────────────────────────────────────────────────────────
// All fields are plain values — no Signals, no wrapping.
// Zustand handles reactivity; TypeScript handles safety.

export interface SettingsState {
  musicVolume: number;
  sfxVolume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  shakeIntensity: number;
  crtFilterEnabled: boolean;
  chromaticAberration: number;
  useAlternativeFont: boolean;
  language: string;
}

// ─── Actions ───────────────────────────────────────────────────────────────────
// Defined separately from state for clarity and to enable
// the generic constraint in createGameStore.

export interface SettingsActions {
  setMusicVolume: (volume: number) => void;
  setSfxVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  toggleMuted: () => void;
  setFullscreen: (fullscreen: boolean) => void;
  setShakeIntensity: (intensity: number) => void;
  setCrtFilter: (enabled: boolean) => void;
  setChromaticAberration: (value: number) => void;
  setAlternativeFont: (enabled: boolean) => void;
  setLanguage: (language: string) => void;
  resetToDefaults: () => void;
}

// ─── Initial State ─────────────────────────────────────────────────────────────

const initialSettingsState: SettingsState = {
  musicVolume: 25,
  sfxVolume: 60,
  isMuted: false,
  isFullscreen: false,
  shakeIntensity: 30,
  crtFilterEnabled: false,
  chromaticAberration: 10,
  useAlternativeFont: false,
  language: 'en',
};

// ─── Store ─────────────────────────────────────────────────────────────────────

export const useSettingsStore = createGameStore<SettingsState, SettingsActions>(
  {
    saveKey: 'settings',
    initialState: initialSettingsState,
    saveSystem: SuperSaveSystem(),
    // Settings are fully persisted — every key matters across sessions.
    // No persistKeys filter needed here.
  },
  (set, get, initialState) => ({
    setMusicVolume: (volume) =>
      set({ musicVolume: Math.max(0, Math.min(100, volume)) }),

    setSfxVolume: (volume) =>
      set({ sfxVolume: Math.max(0, Math.min(100, volume)) }),

    setMuted: (isMuted) => set({ isMuted }),

    toggleMuted: () => set({ isMuted: !get().isMuted }),

    setFullscreen: (isFullscreen) => set({ isFullscreen }),

    setShakeIntensity: (intensity) =>
      set({ shakeIntensity: Math.max(0, Math.min(100, intensity)) }),

    setCrtFilter: (crtFilterEnabled) => set({ crtFilterEnabled }),

    setChromaticAberration: (chromaticAberration) =>
      set({ chromaticAberration: Math.max(0, Math.min(100, chromaticAberration)) }),

    setAlternativeFont: (useAlternativeFont) => set({ useAlternativeFont }),

    setLanguage: (language) => set({ language }),

    resetToDefaults: () => set({ ...initialState }),
  }),
);

// ─── Usage Examples ────────────────────────────────────────────────────────────

/**
 * REACT COMPONENT — with selector for granular re-renders:
 *
 *   const musicVolume = useSettingsStore(s => s.musicVolume);
 *   const setMusicVolume = useSettingsStore(s => s.setMusicVolume);
 *
 *   // Or destructure everything (re-renders on any change):
 *   const { musicVolume, setMusicVolume } = useSettingsStore();
 *
 * OUTSIDE REACT (Excalibur actor, plain function):
 *
 *   const { isMuted, sfxVolume } = useSettingsStore.getState();
 *
 * SUBSCRIBE TO CHANGES (Excalibur system reacting to mute toggle):
 *
 *   useSettingsStore.subscribe(
 *     s => s.isMuted,
 *     (isMuted) => audioEngine.setMuted(isMuted)
 *   );
 */
