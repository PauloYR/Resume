type Level = 'debug' | 'info' | 'warn' | 'error';
type Fields = Record<string, unknown>;

const order: Record<Level, number> = { debug: 0, info: 1, warn: 2, error: 3 };
const threshold: Level = process.env.LOG_LEVEL === 'debug' ? 'debug' : 'info';
const redacted = /token|secret|password|authorization|cookie|key/i;

function safe(fields: Fields): Fields {
  return Object.fromEntries(
    Object.entries(fields).map(([k, v]) => [
      k,
      redacted.test(k) ? '[redacted]' : v,
    ]),
  );
}

function emit(level: Level, message: string, fields: Fields = {}): void {
  if (order[level] < order[threshold]) return;
  const line = JSON.stringify({ level, message, ...safe(fields) });
  (level === 'error' || level === 'warn'
    ? process.stderr
    : process.stdout
  ).write(`${line}\n`);
}

/** Build-time structured logger. Never log tokens, cookies or personal data. */
export const logger = {
  debug: (m: string, f?: Fields) => emit('debug', m, f),
  info: (m: string, f?: Fields) => emit('info', m, f),
  warn: (m: string, f?: Fields) => emit('warn', m, f),
  error: (m: string, f?: Fields) => emit('error', m, f),
};
