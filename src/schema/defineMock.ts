export type MockGenerator<T = any> = () => T;

export type MockSchema = Record<string, MockGenerator | any>;

export function defineMock<T extends MockSchema>(schema: T): T {
  return schema;
}