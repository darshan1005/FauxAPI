import { describe, it, expect } from 'vitest';
import { generate } from '../src/core/generate';
import { defineMock } from '../src/schema/defineMock';
import { string, number, boolean } from '../src/generators/index';

describe('generate', () => {
  it('should generate single object', () => {
    const schema = defineMock({
      name: string,
      age: number,
      active: boolean,
    });

    const result = generate(schema);

    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('age');
    expect(result).toHaveProperty('active');
    expect(typeof result.name).toBe('string');
    expect(typeof result.age).toBe('number');
    expect(typeof result.active).toBe('boolean');
  });

  it('should generate array with count', () => {
    const schema = defineMock({
      id: number,
    });

    const result = generate(schema, { count: 3 });

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(3);
    result.forEach((item: { id: any; }) => {
      expect(item).toHaveProperty('id');
      expect(typeof item.id).toBe('number');
    });
  });

  it('should be deterministic with seed', () => {
    const schema = defineMock({
      value: number,
    });

    const result1 = generate(schema, { seed: 123 });
    const result2 = generate(schema, { seed: 123 });

    expect(result1.value).toBe(result2.value);
  });

  it('should support nested object schema', () => {
    const schema = defineMock({
      user: {
        name: string,
        age: number,
      },
      active: boolean,
    } as any);

    const result = generate(schema);

    expect(result).toHaveProperty('user');
    expect(result.user).toHaveProperty('name');
    expect(result.user).toHaveProperty('age');
    expect(typeof result.user.name).toBe('string');
    expect(typeof result.user.age).toBe('number');
    expect(typeof result.active).toBe('boolean');
  });
});