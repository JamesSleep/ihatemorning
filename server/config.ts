import { toGrid } from './grid.js';

function num(name: string, fallback?: number): number {
  const v = process.env[name];
  if (v === undefined || v === '') {
    if (fallback !== undefined) return fallback;
    throw new Error(`.env에 ${name} 값이 없음`);
  }
  const n = Number(v);
  if (Number.isNaN(n)) throw new Error(`${name} 값이 숫자가 아님: ${v}`);
  return n;
}

export type Place = { name: string; lat: number; lon: number; nx: number; ny: number };

function place(prefix: string, name: string): Place | null {
  const lat = process.env[`${prefix}_LAT`];
  const lon = process.env[`${prefix}_LON`];
  if (!lat || !lon) return null;
  const p = { lat: Number(lat), lon: Number(lon) };
  return { name, ...p, ...toGrid(p.lat, p.lon) };
}

export function loadConfig() {
  const serviceKey = process.env.DATA_GO_KR_KEY ?? '';
  if (!serviceKey) console.warn('[경고] DATA_GO_KR_KEY 없음 → /api/weather 호출 실패함');

  const places = {
    home: place('HOME', '집'),
    work: place('WORK', '회사'),
    transfer: place('TRANSFER', '안산역'),
  };

  return {
    port: num('PORT', 3000),
    serviceKey,
    places,
  };
}

export type Config = ReturnType<typeof loadConfig>;
