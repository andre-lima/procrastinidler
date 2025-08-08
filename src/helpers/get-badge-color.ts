import { Category } from '../types';

export const getBadgeColor = (category: Category) => {
  if (category === Category.Metagame) {
    return 'red';
  }

  if (category === Category.Personal) {
    return 'green';
  }

  if (category === Category.Work) {
    return 'blue';
  }

  if (category === Category.Education) {
    return 'yellow';
  }

  if (category === Category.Health) {
    return 'purple';
  }

  if (category === Category.Leisure) {
    return 'orange';
  }

  if (category === Category.Other) {
    return 'indigo';
  }

  return 'gray';
};
