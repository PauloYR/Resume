// Minimal static server for dist/ (build.format is "file", so /curriculo maps to curriculo.html).
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.png': 'image/png',
  '.pdf': 'application/pdf',
  '.xml': 'application/xml',
};

export function serveDist(root = 'dist', fixedPort = 0) {
  const server = createServer((req, res) => {
    const path = normalize(
      decodeURIComponent((req.url ?? '/').split('?')[0] ?? '/'),
    ).replace(/^(\.\.[/\\])+/, '');
    const candidates = [
      join(root, path),
      join(root, `${path}.html`),
      join(root, path, 'index.html'),
    ];
    const file = candidates.find((c) => existsSync(c) && statSync(c).isFile());
    if (!file) {
      res.writeHead(404).end('not found');
      return;
    }
    res.writeHead(200, {
      'Content-Type': types[extname(file)] ?? 'application/octet-stream',
    });
    createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => {
    server.listen(fixedPort, '127.0.0.1', () => {
      const address = server.address();
      const port = typeof address === 'object' && address ? address.port : 0;
      resolve({ url: `http://127.0.0.1:${port}`, close: () => server.close() });
    });
  });
}
