import { faker } from '@faker-js/faker';

export const generateRandomTask = () => {
  const verb = faker.word.verb();
  const preposition = faker.word.preposition();
  const conjunction = faker.word.conjunction();
  const adjective = faker.word.adjective();
  const random = faker.helpers.arrayElement([
    '',
    '',
    '',
    'the',
    'to the',
    'on the',
    'at the',
    'in the',
    'of the',
    'above',
    'a',
    preposition,
    conjunction,
    adjective,
  ]);

  let sentence = verb + ' ' + random + ' ' + faker.word.noun();

  sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);

  return sentence;
};
