import { faker } from '@faker-js/faker';

export function date(): string {
  return faker.date.recent().toISOString();
}