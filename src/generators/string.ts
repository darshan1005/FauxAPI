import { faker } from '@faker-js/faker';

export function string(): string {
  return faker.lorem.word();
}