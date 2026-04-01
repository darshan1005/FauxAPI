import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';

const schemaJs = `export default {
  id: () => 1,
  name: () => 'Alice',
};`;

describe('CLI generate', () => {
  it('should load schema from js file', () => {
    const schemaPath = './tests/tmp-schema.js';
    writeFileSync(schemaPath, schemaJs, 'utf-8');

    const out = execSync(`node dist/cli.cjs generate ${schemaPath}`, { encoding: 'utf-8' });

    unlinkSync(schemaPath);

    expect(out).toContain('"id": 1');
    expect(out).toContain('"name": "Alice"');
  });
});