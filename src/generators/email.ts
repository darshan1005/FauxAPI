import { faker } from '@faker-js/faker';

export function email(): string {
  return faker.internet.email();
}