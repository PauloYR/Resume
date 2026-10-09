// Serves dist/ on a fixed port (used by Playwright). Usage: node scripts/serve.mjs [port]
import { serveDist } from './serve-dist.mjs';

const port = Number(process.argv[2] ?? 4329);
const { url } = await serveDist('dist', port);
console.log(`serving dist at ${url}`);
