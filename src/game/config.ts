export const config = {
  clicksPerDifficultyLevel: 5,
  moneyPerTaskCompleted: 1,
  maxDeadline: 45 * 1000,
  maxCardsPerColumn: 30,
  maxTodoTasks: 50,
  tickLength: 1000,
  burnoutGrowthPerTick: 2,
  /** Seconds to fill task progress from 0% to 100% when holding (scaled by difficulty) */
  fillSpeedSeconds: 1.8,
  /** Seconds for an assistant to fill 0→100% (scaled by difficulty); higher = slower */
  assistantFillSpeedSeconds: 4,
  /** Seconds for the boss to fill 0→100% (scaled by difficulty); lower = faster */
  bossFillSpeedSeconds: 2,
};
