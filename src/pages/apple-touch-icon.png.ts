import type { APIRoute } from 'astro';
import { iconPng } from '../lib/cards';

// iOS rounds the corners itself.
export const GET: APIRoute = async () => new Response(new Uint8Array(await iconPng(180, false)), { headers: { 'Content-Type': 'image/png' } });
