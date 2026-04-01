#!/usr/bin/env node

import { Command } from 'commander';
import { generate } from './core/generate';
import { pathToFileURL } from 'url';
import { readFileSync, writeFileSync, unlinkSync } from 'fs';
import { resolve, extname } from 'path';
import { tmpdir } from 'os';

async function loadSchemaFromFile(schemaFile: string): Promise<any> {
  const entry = resolve(schemaFile);
  const extension = extname(entry).toLowerCase();

  if (extension === '.json') {
    const fileContents = readFileSync(entry, 'utf-8');
    return JSON.parse(fileContents);
  }

  if (extension === '.js' || extension === '.mjs') {
    const module = await import(pathToFileURL(entry).href);
    return module.default ?? module.schema ?? module;
  }

  if (extension === '.ts') {
    try {
      const esbuild = await import('esbuild');
      const source = readFileSync(entry, 'utf-8');
      const result = esbuild.transformSync(source, {
        loader: 'ts',
        format: 'esm',
        target: 'es2022',
      });
      const tempFile = `${tmpdir()}/mockgen-schema-${Date.now()}-${Math.random().toString(36).slice(2)}.mjs`;
      writeFileSync(tempFile, result.code, 'utf-8');
      const module = await import(pathToFileURL(tempFile).href);
      try {
        return module.default ?? module.schema ?? module;
      } finally {
        unlinkSync(tempFile);
      }
    } catch (error) {
      throw new Error(`Failed to load TypeScript schema file. Install esbuild and use an ESM schema, or use .js/.mjs/.json. (${String(error)})`);
    }
  }

  throw new Error(`Unsupported schema file type: ${extension}. Use .json, .js, .mjs, or .ts`);
}

const generateCommand = new Command('generate')
  .description('Generate mock data from a schema file')
  .argument('<schemaFile>', 'Path to the schema file (json/js/mjs/ts)')
  .option('-o, --out <file>', 'Output file (default: stdout)')
  .option('-c, --count <number>', 'Number of items to generate', (value) => parseInt(value, 10), 1)
  .option('-s, --seed <number>', 'Seed for deterministic output', (value) => parseInt(value, 10))
  .action(async (schemaFile: string, options: { out?: string; count: number; seed?: number }) => {
    try {
      const schema = await loadSchemaFromFile(schemaFile);

      if (schema && typeof schema === 'object' && !Array.isArray(schema)) {
        const data = generate(schema, { count: options.count, seed: options.seed });
        const output = JSON.stringify(data, null, 2);

        if (options.out) {
          writeFileSync(options.out, output, 'utf-8');
          console.log(`Generated data written to ${options.out}`);
        } else {
          console.log(output);
        }
      } else {
        throw new Error('Schema must export an object map of generator functions or static values.');
      }
    } catch (error) {
      console.error('Error generating mock data:', error);
      process.exit(1);
    }
  });

const program = new Command();

program
  .name('mockgen')
  .description('A schema-based mock JSON generator')
  .version('1.0.0');

program.addCommand(generateCommand);

program.parse();