// Shared helpers for Claude Code hooks. Exit code 2 = block the tool call and show stderr to Claude.
export async function readInput() {
  const chunks = [];
  for await (const c of process.stdin) chunks.push(c);
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
  } catch {
    return {};
  }
}

export function block(title, lines) {
  process.stderr.write(
    `BLOCKED: ${title}\n${lines.map((l) => `  - ${l}`).join('\n')}\n`,
  );
  process.exit(2);
}

/** Text the tool call is about to write, for Write / Edit / MultiEdit. */
export function writtenText(input) {
  const t = input.tool_input ?? {};
  if (typeof t.content === 'string') return t.content;
  if (Array.isArray(t.edits))
    return t.edits.map((e) => e.new_string ?? '').join('\n');
  return t.new_string ?? '';
}
