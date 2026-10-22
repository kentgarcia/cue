import { createHash } from 'node:crypto';
import { mkdir, readFile, stat, unlink, writeFile } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = fileURLToPath(new URL('../', import.meta.url));
const outputDir = resolve(root, 'public/media/optimized');
const manifestPath = resolve(root, 'src/presentation/media-manifest.json');
const sources = [
  ...['champion.png', 'japan.png', 'international.png'].map(name => ({ path: `/media/journey/${name}`, quality: 88 })),
  { path: '/media/slide-6/poster.png', quality: 95 },
  { path: '/media/atomiq/icon.png', lossless: true, width: 512 },
  { path: '/media/atomiq/phone.png', quality: 95 },
];
const current = await readFile(manifestPath, 'utf8').catch(() => '{}');
const previous = JSON.parse(current);
const manifest = {};
let originalBytes = 0;
let optimizedBytes = 0;
await mkdir(outputDir, { recursive: true });
for (const { path, width = 1920, quality, lossless = false } of sources) {
  const input = await readFile(resolve(root, 'public' + path));
  const recipe = { width, quality, lossless, sharp: sharp.versions.sharp, vips: sharp.versions.vips };
  const hash = createHash('sha256').update(input).update(JSON.stringify(recipe)).digest('hex').slice(0, 12);
  const name = `${basename(path).replace(/\.[^.]+$/, '')}.${hash}.webp`;
  const output = resolve(outputDir, name);
  try { await stat(output); } catch {
    await sharp(input).rotate().resize({ width, withoutEnlargement: true }).webp({ quality, lossless, alphaQuality: 100, effort: 5 }).toFile(output);
  }
  manifest[path] = `/media/optimized/${name}`;
  originalBytes += input.length;
  optimizedBytes += (await stat(output)).size;
}
const json = JSON.stringify(manifest, null, 2) + '\n';
if (current !== json) await writeFile(manifestPath, json);
const retained = new Set(Object.values(manifest));
for (const old of Object.values(previous)) {
  if (old.startsWith('/media/optimized/') && !retained.has(old)) await unlink(resolve(root, 'public' + old)).catch(error => { if (error.code !== 'ENOENT') throw error; });
}
console.log(`Presentation media: ${(originalBytes / 1e6).toFixed(2)} MB → ${(optimizedBytes / 1e6).toFixed(2)} MB (${Math.round((1 - optimizedBytes / originalBytes) * 100)}% smaller). Originals preserved.`);
