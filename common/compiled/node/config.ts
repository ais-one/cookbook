import fs from 'node:fs';
import path from 'node:path';
import { loadEnvFile } from 'node:process';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const envFilePath = path.resolve(process.cwd(), '.env');

if (process.env.NODE_ENV === 'development') {
  try {
    loadEnvFile(`${envFilePath}.local`);
  } catch {}
  try {
    loadEnvFile(envFilePath);
  } catch {}
}

/** Strip `//` line comments from a JSONC string, preserving strings and newlines. */
const normalizeJsonc = (source: string): string => {
  let result = '';
  let inString = false;
  let isEscaped = false;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];

    if (inString) {
      result += char;
      if (isEscaped) isEscaped = false;
      else if (char === '\\') isEscaped = true;
      else if (char === '"') inString = false;
      continue;
    }

    if (char === '"') {
      inString = true;
      result += char;
      continue;
    }

    if (char === '/' && next === '/') {
      while (index < source.length && source[index] !== '\n') {
        index += 1;
      }
      if (index < source.length) result += '\n';
      continue;
    }

    result += char;
  }

  return result;
};

/** Parse a JSONC string into a plain config object. Throws if the result is not an object. */
const parseJsoncObject = (raw: string, filePath: string): Record<string, unknown> => {
  const normalized = normalizeJsonc(raw).trim();
  if (!normalized) return {};

  const config: unknown = JSON.parse(normalized);
  if (!config || typeof config !== 'object' || Array.isArray(config)) {
    throw new TypeError(`JSON config must be a top-level object: ${filePath}`);
  }
  return config as Record<string, unknown>;
};

/** Read and parse a `.env.json` / `.env.jsonc` file. Returns `{}` if the file does not exist. */
const loadJsonConfigFile = (filePath: string): Record<string, unknown> => {
  if (!fs.existsSync(filePath)) return {};

  const raw = fs.readFileSync(filePath, 'utf8').trim();
  if (!raw) return {};

  return parseJsoncObject(raw, filePath);
};

const __config = Object.freeze(loadJsonConfigFile(`${envFilePath}.json`));
globalThis.__config = __config;

export { __config };
