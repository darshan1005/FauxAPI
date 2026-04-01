import { faker } from '@faker-js/faker';

export function boolean(): boolean {
  return faker.datatype.boolean();
}