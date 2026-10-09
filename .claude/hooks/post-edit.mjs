#!/usr/bin/env node
// PostToolUse (Write|Edit|MultiEdit): format, then lint the touched file. Lint errors go back to Claude.
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readInput } from './lib.mjs';

const input = await readInput();
const file = String(input.tool_input?.file_path ?? '');
if (!file || !existsSync(file)) process.exit(0);

const run = (args) =>
  spawnSync('npx', ['--no-install', ...args], {
    encoding: 'utf8',
    cwd: process.env.CLAUDE_PROJECT_DIR,
  });

if (
  /\.(js|mjs|ts|tsx|astro|css|json|md|ya?ml)$/.test(file) &&
  !/package-lock\.json$/.test(file)
) {
  run(['prettier', '--write', file]);
}

if (/\.(js|mjs|ts|tsx|astro)$/.test(file)) {
  const r = run(['oxlint', '--deny-warnings', file]);
  if (r.status !== 0) {
    process.stderr.write(
      `oxlint found problems in ${file}. Fix them (do not disable the rule):\n${r.stdout}${r.stderr}`,
    );
    process.exit(2);
  }
}
