export const config = {
  clicksPerDifficultyLevel: 5,
  moneyPerTaskCompleted: 1,
  maxDeadline: 45 * 1000,
  maxCardsPerColumn: 30,
  /** Base max number of Todo+InReview slots (non-special); computer upgrade adds more. */
  maxTodoTasks: 10,
  tickLength: 1000,
  burnoutGrowthPerTick: 0.5,
  /** Rent amount (initial); burnout increases when money is below this; increases by 1 after each collection */
  rentAmount: 100,
  /** Seconds between rent collections (timer resets after each collection) */
  rentIntervalSeconds: 120,
  /** Seconds to fill task progress from 0% to 100% when holding (scaled by difficulty) */
  fillSpeedSeconds: 1.8,
  /** Seconds for an assistant to fill 0→100% (scaled by difficulty); higher = slower */
  assistantFillSpeedSeconds: 4,
  /** Seconds for the boss to fill 0→100% (scaled by difficulty); lower = faster */
  bossFillSpeedSeconds: 2,
};
