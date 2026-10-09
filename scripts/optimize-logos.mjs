// Normalizes every logo in assets/logos-src/ into a uniform "brand tile" in public/logos/<slug>.webp.
// Each tile: the mark is trimmed, scaled to fit the same box and centered on the brand's own background.
// Requires ImageMagick (`magick`) and ffmpeg (only for AVIF sources). Usage: node scripts/optimize-logos.mjs
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs';

const SRC = 'assets/logos-src';
const OUT = 'public/logos';
const MARK = { w: 300, h: 84 }; // fits inside this box (2x pixels)
const PAD = { x: 52 };
const TILE_H = 148;

// bg: a color, or "auto" to sample the source corner. fuzz: tolerance used when trimming the background.
const logos = [
  { slug: 'mobiup', src: 'mobiup.png', bg: '#ffffff', fuzz: 10 },
  { slug: 'g4f', src: 'g4f.webp', bg: '#0d0f14', fuzz: 2 },
  { slug: 'gft', src: 'GFT.avif', bg: '#ffffff', fuzz: 10 },
  { slug: 'gfx', src: 'gfx.jpg', bg: 'auto', fuzz: 8 },
  {
    slug: 'banco-original',
    src: 'banco original.jpg',
    bg: 'auto',
    crop: '520x170+152+162',
  },
  { slug: 'boa-safra', src: 'boa-safra.png', bg: '#ffffff' },
  { slug: 'heineken', src: 'heineken.png', bg: '#ffffff', fuzz: 2 },
  { slug: 'nuclea', src: 'nuclea.webp', bg: '#ffffff', fuzz: 10 },
  { slug: 'pepsi', src: 'pepsi.webp', bg: '#ffffff', fuzz: 2 },
  {
    slug: 'sistema-verdes-mares',
    src: 'sistemas-verders-mares.jpg',
    bg: 'auto',
    fuzz: 10,
  },
  {
    slug: 'sorocaba-refrescos',
    src: 'sorocaba-refrescos.jpg',
    bg: 'auto',
    fuzz: 8,
  },
];

const run = (cmd, args) => execFileSync(cmd, args, { encoding: 'utf8' }).trim();
mkdirSync(OUT, { recursive: true });
const sizes = {};

for (const logo of logos) {
  let input = `${SRC}/${logo.src}`;
  if (!existsSync(input)) {
    console.warn(`skip ${logo.slug}: ${input} not found`);
    continue;
  }
  if (input.endsWith('.avif')) {
    const png = `/tmp/${logo.slug}.png`;
    run('ffmpeg', ['-loglevel', 'error', '-y', '-i', input, png]);
    input = png;
  }

  const pre = logo.crop ? ['-crop', logo.crop, '+repage'] : [];
  const bg =
    logo.bg === 'auto'
      ? run('magick', [input, ...pre, '-format', '%[pixel:p{3,3}]', 'info:'])
      : logo.bg;
  const trim =
    logo.fuzz === undefined
      ? []
      : ['-fuzz', `${logo.fuzz}%`, '-trim', '+repage'];
  const out = `${OUT}/${logo.slug}.webp`;

  run('magick', [
    input,
    ...pre,
    ...trim,
    '-resize',
    `${MARK.w}x${MARK.h}`,
    '-background',
    bg,
    '-gravity',
    'center',
    '-extent',
    `%[fx:w+${PAD.x * 2}]x${TILE_H}`,
    '-define',
    'webp:method=6',
    '-quality',
    '90',
    out,
  ]);
  const size = run('magick', ['identify', '-format', '%wx%h', out]);
  const [width, height] = size.split('x').map(Number);
  sizes[logo.slug] = { width, height };
  console.log(
    `${logo.slug}: ${size}, ${(statSync(out).size / 1024).toFixed(1)} KB, bg ${bg}`,
  );
}

writeFileSync(
  'src/content/logo-sizes.json',
  `${JSON.stringify(sizes, null, 2)}\n`,
);
