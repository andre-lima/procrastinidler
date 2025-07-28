import { faker } from '@faker-js/faker';

export const generateRandomTask = () => {
  const verb = faker.word.verb();
  const preposition = faker.word.preposition();
  const conjunction = faker.word.conjunction();
  const adjective = faker.word.adjective();
  const random = faker.helpers.arrayElement([
    '',
    'the',
    'a',
    preposition,
    conjunction,
    adjective,
  ]);

  return verb + ' ' + random + ' ' + faker.word.noun();
};
