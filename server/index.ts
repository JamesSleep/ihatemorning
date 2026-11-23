import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { cached } from './cache.js';
import { loadConfig } from './config.js';
import { getUltraSrtNcst, getVilageFcst } from './kma.js';

const config = loadConfig();
const app = new Hono();

app.get('/api/health', (c) =>
  c.json({
    ok: true,
    now: new Date().toISOString(),
    places: config.places,
  }),
);

// D0: 기상청 응답을 거의 그대로 보여줌 (D1에서 가공)
app.get('/api/weather', async (c) => {
  const home = config.places.home;
  if (!home) return c.json({ error: '.env에 HOME_LAT / HOME_LON 설정 필요' }, 500);
  try {
    const [ncst, fcst] = await Promise.all([
      cached('ncst:home', 10 * 60 * 1000, () => getUltraSrtNcst(config.serviceKey, home.nx, home.ny)),
      cached('fcst:home', 30 * 60 * 1000, () => getVilageFcst(config.serviceKey, home.nx, home.ny)),
    ]);
    return c.json({ place: home, ncst, fcst });
  } catch (e) {
    return c.json({ error: e instanceof Error ? e.message : String(e) }, 502);
  }
});

// 폭설 자동 기상용. 아이폰 단축어가 조회함. 주말에 실제 로직 연결
app.get('/api/snow-alert', (c) => c.json({ alert: false, reason: '아직 미구현' }));

// 빌드된 프론트 (dist/public)
const here = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.relative(process.cwd(), path.join(here, 'public')) || '.';
app.use('/*', serveStatic({ root: publicDir }));

serve({ fetch: app.fetch, port: config.port, hostname: '0.0.0.0' }, (info) => {
  console.log(`ihatemorning 서버 실행: http://localhost:${info.port}`);
  console.log('격자:', JSON.stringify(config.places));
});
