/**
 * game-setup.ts
 *
 * Example of how all stores are wired together at game startup.
 * This file runs once before the game loop starts.
 * Shows the "subscribe" pattern for keeping stores in sync.
 */

import { useSettingsStore, type SettingsState } from './examples/useSettingsStore';
import { useEconomyStore } from './examples/useEconomyStore';
import { createUpgradesStore } from './examples/useUpgradesStore';

// ─── 1. Define your game's upgrade keys ────────────────────────────────────────

export type ProcrastinIdlerUpgrade =
  | 'COFFEE_MACHINE'       // +gold/sec
  | 'SECOND_MONITOR'       // +click value
  | 'MECHANICAL_KEYBOARD'  // +click speed
  | 'STANDING_DESK'        // multiplier
  | 'NOISE_CANCELLING';    // gem multiplier

export const upgradeDefinitions: Record<ProcrastinIdlerUpgrade, { maxLevel?: number }> = {
  COFFEE_MACHINE: { maxLevel: 10 },
  SECOND_MONITOR: { maxLevel: 5 },
  MECHANICAL_KEYBOARD: { maxLevel: 5 },
  STANDING_DESK: { maxLevel: 3 },
  NOISE_CANCELLING: { maxLevel: 1 },
};

export const useUpgradesStore = createUpgradesStore<ProcrastinIdlerUpgrade>(
  upgradeDefinitions,
  'procrastinidler', // savePrefix — overrides VITE_GAME_PREFIX for this game
);

// ─── 2. Wire stores together ───────────────────────────────────────────────────
// All cross-store reactions live here, not scattered through components.
// This is the single source of truth for "when X changes, do Y".

export function initStoreWiring() {
  // Audio: when mute/volume changes, tell the audio engine
  useSettingsStore.subscribe(
    (s: SettingsState) => ({ isMuted: s.isMuted, sfxVolume: s.sfxVolume, musicVolume: s.musicVolume }),
    ({ isMuted, sfxVolume, musicVolume }: { isMuted: boolean, sfxVolume: number, musicVolume: number }) => {
      // audioEngine.setMuted(isMuted);
      // audioEngine.setMusicVolume(isMuted ? 0 : musicVolume / 100);
      // audioEngine.setSfxVolume(isMuted ? 0 : sfxVolume / 100);
      console.log('[audio] volume updated', { isMuted, sfxVolume, musicVolume });
    },
  );

  // Economy: when upgrade levels change, recalculate passive income
  useUpgradesStore.subscribe(
    (s) => s.getUpgradeLevel('COFFEE_MACHINE'),
    (level) => {
      const BASE_GPS = 0.5;
      useEconomyStore.getState().setGoldPerSecond(BASE_GPS * level);
    },
  );

  useUpgradesStore.subscribe(
    (s) => s.getUpgradeLevel('STANDING_DESK'),
    (level) => {
      const multiplier = 1 + level * 0.25; // +25% per level
      useEconomyStore.getState().setGoldMultiplier(multiplier);
    },
  );

  useUpgradesStore.subscribe(
    (s) => s.getUpgradeLevel('NOISE_CANCELLING'),
    (level) => {
      useEconomyStore.getState().setGemMultiplier(level > 0 ? 1.5 : 1);
    },
  );
}

// ─── 3. Game loop integration (Excalibur System) ───────────────────────────────

/**
 * Drop this into your Excalibur scene or main game loop.
 *
 *   import { Engine, System, SystemType } from 'excalibur';
 *
 *   export class EconomyTickSystem extends System {
 *     systemType = SystemType.Update;
 *
 *     onPreUpdate(_engine: Engine, delta: number) {
 *       // delta is in milliseconds — convert to seconds
 *       useEconomyStore.getState().applyPassiveTick(delta / 1000);
 *     }
 *   }
 */

// ─── 4. Reading state in Excalibur actors ─────────────────────────────────────

/**
 * No hooks needed — just getState().
 *
 *   class ClickActor extends Actor {
 *     onClick() {
 *       const { getUpgradeLevel } = useUpgradesStore.getState();
 *       const monitorLevel = getUpgradeLevel('SECOND_MONITOR');
 *       const clickValue = BASE_CLICK_VALUE * (1 + monitorLevel * 0.5);
 *
 *       useEconomyStore.getState().earnGold(clickValue);
 *     }
 *   }
 */

// ─── 5. React component example ───────────────────────────────────────────────

/**
 *   function UpgradeShopItem({ upgradeKey }: { upgradeKey: ProcrastinIdlerUpgrade }) {
 *     // Selector keeps re-renders scoped to just this upgrade's level
 *     const level    = useUpgradesStore(s => s.getUpgradeLevel(upgradeKey));
 *     const isMaxed  = useUpgradesStore(s => s.isMaxed(upgradeKey));
 *     const purchase = useUpgradesStore(s => s.purchaseUpgrade);
 *     const gold     = useEconomyStore(s => s.gold);
 *     const spend    = useEconomyStore(s => s.spendGold);
 *
 *     const cost = calculateCost(upgradeKey, level); // your pricing function
 *     const canAfford = gold >= cost;
 *
 *     return (
 *       <button
 *         disabled={isMaxed || !canAfford}
 *         onClick={() => {
 *           if (spend(cost)) purchase(upgradeKey);
 *         }}
 *       >
 *         {upgradeKey} — Level {level}{isMaxed ? ' (MAX)' : ''}
 *       </button>
 *     );
 *   }
 */
