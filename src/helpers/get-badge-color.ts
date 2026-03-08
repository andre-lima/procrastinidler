import { Category } from '../types';

/** Returns a 386 theme CSS variable for badge/category color */
export const getBadgeColor = (category: Category): string => {
  if (category === Category.Metagame) {
    return 'var(--color-danger)';
  }
  if (category === Category.Personal) {
    return 'var(--color-success)';
  }
  if (category === Category.Work) {
    return 'var(--color-info)';
  }
  if (category === Category.Education) {
    return 'var(--color-warning)';
  }
  if (category === Category.Health) {
    return 'var(--color-fg-brand)';
  }
  if (category === Category.Leisure) {
    return 'var(--color-warning)';
  }
  if (category === Category.Other) {
    return 'var(--color-accent-hi)';
  }
  return 'var(--color-fg-dim)';
};
