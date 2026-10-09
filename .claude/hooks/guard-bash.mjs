#!/usr/bin/env node
// PreToolUse (Bash): stop commands that leak secrets or bypass the safety net.
import { block, readInput } from './lib.mjs';

const input = await readInput();
const cmd = String(input.tool_input?.command ?? '');
const problems = [];

const envFile = String.raw`(^|[\s/'"=])\.env(\.(?!example|sample|template)[\w.-]+)?(?=$|[\s'";|&)])`;
const reader = String.raw`\b(cat|bat|less|more|head|tail|grep|rg|awk|sed|cut|nl|tac|xxd|od|strings|source|export|set\s+-a|cp|mv|scp|rsync|curl|base64)\b`;
if (
  new RegExp(`${reader}[^\\n;|&]*${envFile}`).test(cmd) ||
  new RegExp(`<\\s*[^\\s]*${envFile}`).test(cmd)
) {
  problems.push(
    'reading/copying a real .env file (only .env.example may be read)',
  );
}
if (
  /\b(printenv|env)\b\s*($|[|;&>])/.test(cmd) ||
  /\bdeclare\s+-x\b|\bset\s*$/.test(cmd)
) {
  problems.push('dumping the whole environment');
}
if (
  /\bgit\s+(add|stage)\b[^\n;|&]*(\s-f\b|--force|\.env(\.(?!example|sample|template)[\w.-]+)?(\s|$))/.test(
    cmd,
  )
) {
  problems.push('staging a .env file or forcing past .gitignore');
}
if (
  /--no-verify|--no-gpg-sign|core\.hooksPath\s*=\s*\/dev\/null|LEFTHOOK\s*=\s*0|\bHUSKY\s*=\s*0/.test(
    cmd,
  )
) {
  problems.push(
    'bypassing git hooks (fix the finding instead of skipping the check)',
  );
}
if (/\bgit\s+push\b[^\n;|&]*(--force\b|-f\b)(?!-with-lease)/.test(cmd)) {
  problems.push(
    'force push (use --force-with-lease only with explicit user approval)',
  );
}
if (/\b(curl|wget)\b[^\n|]*\|\s*(sudo\s+)?(ba|z|fi)?sh\b/.test(cmd)) {
  problems.push('piping a remote script into a shell');
}
if (/\bnpm\s+publish\b|\bgit\s+push\b[^\n]*--tags/.test(cmd)) {
  problems.push('publishing is outward-facing: ask the user first');
}

if (problems.length) block('unsafe shell command', problems);
