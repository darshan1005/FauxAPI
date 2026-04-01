# MockGen

A schema-based mock JSON generator with CLI and API mocking capabilities.

## Features

- 🎯 Schema-driven mock data generation
- 🔄 Deterministic output with seed support
- 🖥️ Powerful CLI tool
- 🌐 Mock API server (coming soon)
- 📦 TypeScript-first with full type inference
- 🚀 ESM and CommonJS support

## Installation

```bash
npm install -g mockgen
```

## Usage

### Programmatic API

```typescript
import { defineMock, generate, string, number, email } from 'mockgen';

const userSchema = defineMock({
  id: number(),
  name: string(),
  email: email(),
});

const user = generate(userSchema);
// { id: 42, name: "lorem", email: "john@example.com" }

const users = generate(userSchema, { count: 5, seed: 123 });
// Array of 5 users with deterministic data
```

### CLI

Generate from a schema file:

```bash
mockgen generate path/to/schema.js
mockgen generate path/to/schema.mjs
mockgen generate path/to/schema.json
mockgen generate path/to/schema.ts  # requires esbuild installed
```

Example `schema.mjs`:

```js
import { defineMock, string, number, email } from './dist/index.js';

export default defineMock({
  id: number,
  name: string,
  email: email,
});
```

Generate and print one object:

```bash
mockgen generate ./schema.mjs
```

Generate five deterministic objects:

```bash
mockgen generate ./schema.mjs --count 5 --seed 42
```

Options:

- `-o, --out <file>`: Output to file
- `-c, --count <number>`: Number objects (default: 1)
- `-s, --seed <number>`: Seed for deterministic data

## Built-in Generators

- `string()`: Random string
- `number()`: Random number
- `boolean()`: Random boolean
- `email()`: Random email
- `uuid()`: Random UUID
- `date()`: Random ISO date string

## Nested schema support

`generate` now supports nested object schemas and nested arrays within schema values.

```ts
import { defineMock, generate, string, number, boolean } from 'mockgen';

const schema = defineMock({
  user: {
    name: string,
    age: number,
  },
  settings: {
    theme: 'dark',
    notifications: boolean,
  },
});

const result = generate(schema);
// {
//   user: { name: '...', age: ... },
//   settings: { theme: 'dark', notifications: true }
// }
```

Nested arrays are also supported in schema values:

```ts
const schemaWithList = defineMock({
  tags: ['a', 'b', 'c'],
  entries: [
    { id: number, value: string },
  ],
});
```


## Custom Generators

```typescript
const schema = defineMock({
  custom: () => 'always this value',
  fakerName: () => faker.person.fullName(),
});
```

## API

### `defineMock(schema)`

Defines a mock schema.

### `generate(schema, options?)`

Generates mock data from schema.

Options:
- `seed?: number` - Seed for deterministic output
- `count?: number` - Number of items to generate (returns array if > 1)

## Development

```bash
npm install
npm run build
npm test
```

## License

MIT
