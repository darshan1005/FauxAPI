import { faker } from '@faker-js/faker';
import type { MockSchema, MockGenerator } from '../schema/defineMock';

export interface GenerateOptions {
  seed?: number;
  count?: number;
}

export function generate<T extends MockSchema>(
  schema: T,
  options: GenerateOptions = {}
): any {
  const { seed, count = 1 } = options;

  if (seed !== undefined) {
    faker.seed(seed);
  }

  const buildValue = (value: any): any => {
    if (typeof value === 'function') {
      return value();
    }

    if (Array.isArray(value)) {
      return value.map((item) => buildValue(item));
    }

    if (value !== null && typeof value === 'object') {
      return buildObject(value);
    }

    return value;
  };

  const buildObject = (obj: Record<string, any>): any => {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = buildValue(value);
    }
    return result;
  };

  const generateSingle = (): any => buildObject(schema as Record<string, any>);

  if (count === 1) {
    return generateSingle();
  }

  return Array.from({ length: count }, generateSingle);
}