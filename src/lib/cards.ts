/**
 * Images made at build time: the 1200×630 link-preview card of every page and
 * the site icons. Satori lays out the card in the site's own type, Source
 * Serif 4, and resvg turns it into a PNG. The plain text of a formula
 * (`plain()`: ℝⁿ, p⁽ⁿ⁾ᵢⱼ) takes its symbols from STIX Two Math and its
 * raised and lowered letters from Noto Serif; a character that no font draws
 * stops the build.
 */
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
// @ts-expect-error: satori's own font parser, without type declarations.
import opentype from '@shuding/opentype.js';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { SITE } from './site';

// The build runs from the repository root, locally and in CI.
const ROOT = process.cwd();
const serif = (file: string) => readFileSync(join(ROOT, 'node_modules/@fontsource/source-serif-4/files', file));
const font = (pkg: string, file: string) => readFileSync(join(ROOT, 'node_modules/@fontsource', pkg, 'files', file));

const FONTS = [
  { name: 'Serif', data: serif('source-serif-4-latin-400-normal.woff'), weight: 400 as const, style: 'normal' as const },
  { name: 'Serif', data: serif('source-serif-4-latin-400-italic.woff'), weight: 400 as const, style: 'italic' as const },
  { name: 'Serif', data: serif('source-serif-4-latin-600-normal.woff'), weight: 600 as const, style: 'normal' as const },
  { name: 'SerifExt', data: serif('source-serif-4-latin-ext-400-normal.woff'), weight: 400 as const, style: 'normal' as const },
  { name: 'SerifExt', data: serif('source-serif-4-latin-ext-600-normal.woff'), weight: 600 as const, style: 'normal' as const },
  { name: 'SerifGreek', data: serif('source-serif-4-greek-400-normal.woff'), weight: 400 as const, style: 'normal' as const },
  { name: 'SerifGreek', data: serif('source-serif-4-greek-600-normal.woff'), weight: 600 as const, style: 'normal' as const },
  { name: 'Math', data: font('stix-two-math', 'stix-two-math-latin-400-normal.woff'), weight: 400 as const, style: 'normal' as const },
  { name: 'Scripts', data: font('noto-serif', 'noto-serif-latin-ext-400-normal.woff'), weight: 400 as const, style: 'normal' as const },
  { name: 'ScriptsMath', data: font('noto-serif', 'noto-serif-math-400-normal.woff'), weight: 400 as const, style: 'normal' as const },
];
// Satori draws from one file per family name (the one that best matches
// weight and style), so every subset has its own name, in fallback order.
const FAMILY = 'Serif, SerifExt, SerifGreek, Math, Scripts, ScriptsMath';

// Every character of a card must be drawn by one of the fonts: satori would
// leave a blank where none has a glyph.
const PARSED = FONTS.map((f) => opentype.parse(f.data.buffer.slice(f.data.byteOffset, f.data.byteOffset + f.data.byteLength)));
function assertDrawable(text: string) {
  for (const ch of new Set(text)) {
    if (/\s/.test(ch)) continue;
    if (!PARSED.some((p: { charToGlyphIndex(c: string): number }) => p.charToGlyphIndex(ch) !== 0)) {
      throw new Error(`cards: no font draws "${ch}" (U+${ch.codePointAt(0)!.toString(16).toUpperCase()}) in "${text}"`);
    }
  }
}
// resvg draws satori's outlines: no system font is needed or wanted.
const RESVG = { font: { loadSystemFonts: false } };

// The light theme of global.css.
const PAGE = '#fbf8f2';
const INK = '#221f1c';
const MUTED = '#6f6a63';
const RULE = '#e5dfd4';
const LINK = '#2f4f8f';

type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, ...children: (Node | string | null)[]): Node => {
  const kids = children.filter((c) => c !== null);
  // Satori reads an array as several nodes: a single child goes in alone.
  return { type, props: { style, children: kids.length === 0 ? undefined : kids.length === 1 ? kids[0] : kids } };
};

const portrait = () => `data:image/jpeg;base64,${readFileSync(join(ROOT, 'content', SITE.photo)).toString('base64')}`;

export interface Card {
  /** Small line above the title: the thread of a post, or the kind of page. */
  kicker?: string;
  title: string;
  /** One or two sentences under the title. */
  text?: string;
  /** Right end of the footer, for example a date. */
  note?: string;
  /** Left end of the footer, the author's name unless given. */
  byline?: string;
  /** Show the portrait at the right (the main page). */
  photo?: boolean;
}

/** The link-preview card of one page, as a PNG. */
export async function cardPng(card: Card): Promise<Buffer> {
  for (const part of [card.kicker, card.title, card.text, card.note, card.byline]) if (part) assertDrawable(part);
  const size = card.title.length > 70 ? 54 : card.title.length > 44 ? 62 : 70;
  const text = card.text && card.text.length > 190 ? `${card.text.slice(0, 187).replace(/\s+\S*$/, '')}…` : card.text;
  const root = h(
    'div',
    { width: 1200, height: 630, display: 'flex', flexDirection: 'column', background: PAGE, color: INK, fontFamily: FAMILY, padding: '64px 76px 56px' },
    h(
      'div',
      { display: 'flex', flex: 1, gap: 48 },
      h(
        'div',
        { display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' },
        h('div', { width: 64, height: 5, background: LINK, marginBottom: 26 }),
        card.kicker ? h('div', { fontSize: 32, fontStyle: 'italic', color: MUTED, marginBottom: 18 }, card.kicker) : null,
        h('div', { fontSize: size, fontWeight: 600, lineHeight: 1.12, letterSpacing: -0.5 }, card.title),
        text ? h('div', { fontSize: 29, lineHeight: 1.4, color: MUTED, marginTop: 26, textWrap: 'balance' }, text) : null,
      ),
      card.photo
        ? h('div', { display: 'flex', alignItems: 'center' }, { type: 'img', props: { src: portrait(), width: 260, height: 260, style: { borderRadius: 12 } } })
        : null,
    ),
    h(
      'div',
      { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `2px solid ${RULE}`, paddingTop: 22, fontSize: 28 },
      h('div', { color: INK }, card.byline ?? SITE.name),
      h('div', { color: MUTED }, card.note ? `${card.note} · clainstone.com` : card.byline ? '' : 'clainstone.com'),
    ),
  );
  const svg = await satori(root as never, { width: 1200, height: 630, fonts: FONTS });
  return new Resvg(svg, { ...RESVG, fitTo: { mode: 'width', value: 1200 } }).render().asPng();
}

/* ---- icons ------------------------------------------------------------- */

/** The monogram: the initials in the page's cream on an ink square. */
async function monogramSvg(px: number, rounded: boolean): Promise<string> {
  const root = h(
    'div',
    {
      width: px, height: px, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: INK, color: PAGE, borderRadius: rounded ? px * 0.2 : 0,
      fontFamily: 'Serif', fontWeight: 600, fontSize: px * 0.52, letterSpacing: -px * 0.02, paddingBottom: px * 0.04,
    },
    'AP',
  );
  return satori(root as never, { width: px, height: px, fonts: FONTS });
}

export const iconSvg = () => monogramSvg(64, true);

export async function iconPng(px: number, rounded = true): Promise<Buffer> {
  // Drawn at 8× and scaled down, so that small sizes stay crisp.
  const svg = await monogramSvg(512, rounded);
  return new Resvg(svg, { ...RESVG, fitTo: { mode: 'width', value: px } }).render().asPng();
}

/** A .ico file that wraps PNG images, one per size. */
export async function iconIco(sizes = [16, 32, 48]): Promise<Buffer> {
  const pngs = await Promise.all(sizes.map((s) => iconPng(s)));
  const head = Buffer.alloc(6 + 16 * pngs.length);
  head.writeUInt16LE(0, 0);
  head.writeUInt16LE(1, 2);
  head.writeUInt16LE(pngs.length, 4);
  let offset = head.length;
  pngs.forEach((png, k) => {
    const at = 6 + 16 * k;
    head.writeUInt8(sizes[k] % 256, at);
    head.writeUInt8(sizes[k] % 256, at + 1);
    head.writeUInt16LE(1, at + 4);
    head.writeUInt16LE(32, at + 6);
    head.writeUInt32LE(png.length, at + 8);
    head.writeUInt32LE(offset, at + 12);
    offset += png.length;
  });
  return Buffer.concat([head, ...pngs]);
}
