type Side = 'top' | 'right' | 'bottom' | 'left';
type Insets = Record<Side, number>;

const INSETS_KEY = 'insets';
const safe = document.getElementById('safe')!;

// ---------- 여백 ----------
function loadInsets(): Insets {
  try {
    const raw = localStorage.getItem(INSETS_KEY);
    if (raw) return { top: 0, right: 0, bottom: 0, left: 0, ...JSON.parse(raw) };
  } catch {
    /* 저장소 못 쓰면 기본값 */
  }
  return { top: 0, right: 0, bottom: 0, left: 0 };
}

function applyInsets(i: Insets) {
  for (const side of Object.keys(i) as Side[]) {
    document.documentElement.style.setProperty(`--inset-${side}`, `${i[side]}px`);
  }
}

function saveInsets(i: Insets) {
  try {
    localStorage.setItem(INSETS_KEY, JSON.stringify(i));
  } catch {
    /* 무시 */
  }
}

function renderCalibration() {
  const insets = loadInsets();
  applyInsets(insets);
  safe.remove();

  const grid = document.createElement('div');
  grid.className = 'calib';
  const frame = document.createElement('div');
  frame.className = 'calib-frame';
  const panel = document.createElement('div');
  panel.className = 'calib-panel';
  document.body.append(grid, frame, panel);

  const sides: [Side, string][] = [
    ['top', '위'],
    ['right', '오른쪽'],
    ['bottom', '아래'],
    ['left', '왼쪽'],
  ];

  const draw = () => {
    panel.innerHTML = '';
    for (const [side, label] of sides) {
      const minus = document.createElement('button');
      minus.textContent = '−';
      minus.onclick = () => update(side, -10);
      const value = document.createElement('div');
      value.textContent = `${label} ${insets[side]}px`;
      const plus = document.createElement('button');
      plus.textContent = '+';
      plus.onclick = () => update(side, 10);
      panel.append(minus, value, plus);
    }
    const done = document.createElement('button');
    done.textContent = '저장하고 나가기';
    done.style.gridColumn = '1 / -1';
    done.onclick = () => {
      saveInsets(insets);
      location.href = location.pathname;
    };
    panel.append(done);
  };

  const update = (side: Side, delta: number) => {
    insets[side] = Math.max(0, insets[side] + delta);
    applyInsets(insets);
    draw();
  };

  draw();
}

// ---------- 메인 화면 (D0: 시계 + 기상청 원본 확인용) ----------
type KmaItem = { category: string; obsrValue?: string };
type WeatherRes = {
  error?: string;
  place?: { name: string; nx: number; ny: number };
  ncst?: { data: KmaItem[]; fetchedAt: string; stale: boolean; error?: string };
};

const PTY: Record<string, string> = { '0': '없음', '1': '비', '2': '비/눈', '3': '눈', '5': '빗방울', '6': '빗방울눈날림', '7': '눈날림' };

function renderMain() {
  applyInsets(loadInsets());
  safe.innerHTML = `
    <div class="clock" id="clock"></div>
    <div class="date" id="date"></div>
    <div class="temp" id="temp">--°</div>
    <div class="row" id="detail"></div>
    <div class="meta" id="meta"></div>
  `;

  const $ = (id: string) => document.getElementById(id)!;

  const tick = () => {
    const now = new Date();
    $('clock').textContent = now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
    $('date').textContent = now.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });
  };
  tick();
  setInterval(tick, 1000);

  const load = async () => {
    try {
      const res: WeatherRes = await fetch('/api/weather').then((r) => r.json());
      if (res.error || !res.ncst) throw new Error(res.error ?? '응답 이상');
      const v = Object.fromEntries(res.ncst.data.map((i) => [i.category, i.obsrValue]));
      $('temp').textContent = `${v.T1H ?? '--'}°`;
      $('detail').textContent = `습도 ${v.REH ?? '-'}% · 풍속 ${v.WSD ?? '-'}m/s · 강수 ${PTY[v.PTY ?? '0'] ?? v.PTY}`;
      const t = new Date(res.ncst.fetchedAt).toLocaleTimeString('ko-KR', { hour12: false });
      $('meta').innerHTML = `${res.place?.name} (${res.place?.nx},${res.place?.ny}) · 갱신 ${t}` +
        (res.ncst.stale ? ` <span class="error">· 갱신 실패: ${res.ncst.error}</span>` : '');
    } catch (e) {
      $('meta').innerHTML = `<span class="error">날씨 오류: ${e instanceof Error ? e.message : e}</span>`;
    }
  };
  load();
  setInterval(load, 60 * 1000);
}

if (new URLSearchParams(location.search).has('calibrate')) renderCalibration();
else renderMain();
