export const resetAllStores = () => {
  localStorage.removeItem('game-store');
  localStorage.removeItem('tasks-store');
  localStorage.removeItem('upgrades-store');
  localStorage.removeItem('boss-store');
  localStorage.removeItem('assistant-store');

  window.location.reload();
};
