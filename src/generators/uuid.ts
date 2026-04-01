import { faker } from '@faker-js/faker';

export function uuid(): string {
  return faker.string.uuid();
}