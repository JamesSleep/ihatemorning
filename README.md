# ihatemorning

출근 전 노트10에 날씨 · 우산 여부 · 버스 도착을 띄워두는 웹앱.

## PC (리눅스 민트)

```bash
npm install
cp .env.example .env   # 키, 집/회사 좌표 입력
npm run dev:server     # API 서버 :3000
npm run dev:web        # 프론트 :5173 (/api는 3000으로 프록시)
```

배포용 빌드 (dist까지 커밋):

```bash
npm run build
git add -A && git commit -m "..." && git push
```

## 폰 (노트10, Termux)

최초 1회:

```bash
pkg update && pkg upgrade
pkg install nodejs-lts git
git clone https://github.com/JamesSleep/ihatemorning.git
cd ihatemorning
cp .env.example .env && nano .env
```

실행 (npm install 필요 없음, 서버는 단일 파일로 번들됨):

```bash
termux-wake-lock
node --env-file=.env dist/server.js
```

업데이트: `git pull` 후 서버 재시작.

## 화면

- `http://localhost:3000` 메인
- `http://localhost:3000/?calibrate` 깨진 액정 여백 보정 (파란 테두리가 보이는 영역에 맞추고 저장)

## API

- `GET /api/health` 설정된 위치·격자 확인
- `GET /api/weather` 기상청 초단기실황 + 단기예보 (현재는 원본)
- `GET /api/snow-alert` 폭설 여부 (아이폰 단축어용, 미구현)
