import type { APIRoute } from 'astro';
import { iconSvg } from '../lib/cards';

export const GET: APIRoute = async () => new Response(await iconSvg(), { headers: { 'Content-Type': 'image/svg+xml' } });
