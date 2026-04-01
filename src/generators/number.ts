import { faker } from '@faker-js/faker';

export function number(): number {
  return faker.number.int({ min: 1, max: 100 });
}