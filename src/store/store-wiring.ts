/**
 * Central place for cross-store subscriptions (e.g. settings → audio,
 * upgrade levels → economy recalculations). Call initStoreWiring() once
 * at app boot (e.g. in main.tsx or App.tsx).
 *
 * Currently a no-op; add subscribe() calls here when you need reactive
 * wiring (e.g. when an audio engine or separate economy store exists).
 */
export function initStoreWiring(): void {
  // Future: e.g. useSettingsStore.subscribe(...) → audioEngine.setVolume(...)
  // Future: useUpgradesStore.subscribe(...) → useEconomyStore.getState().setGoldPerSecond(...)
}
