import { Category } from '../store/tasksStore';

export const getRandomCategory = () => {
  const categories = Object.values(Category).filter(
    (category) => category !== Category.Metagame
  );

  return categories[Math.floor(Math.random() * categories.length)];
};
