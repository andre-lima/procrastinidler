import { localStorageSaveSystem } from './saveSystem';

export const resetAllStores = () => {
  localStorageSaveSystem.clearAll();
  setTimeout(() => {
    window.location.reload();
  }, 0);
};
