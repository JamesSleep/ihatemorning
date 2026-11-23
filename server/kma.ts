import { ncstBase, vilageBase } from './time.js';

// 기상청 단기예보 조회서비스 클라이언트
// 문서: 공공데이터포털 "기상청_단기예보 조회서비스" 활용가이드
//
// 엔드포인트: http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/{operation}
// 공통 파라미터: serviceKey, pageNo, numOfRows, dataType=JSON, base_date, base_time, nx, ny
//
// 요구사항
// - 성공 시 response.body.items.item 배열을 반환
// - 실패 시 원인이 드러나는 메시지로 throw (캐시 레이어가 받아서 처리함)
//
// 함정 (이거 다 실제로 터짐)
// 1. serviceKey 인코딩: 포털의 Encoding 키를 URLSearchParams에 넣으면 이중 인코딩됨 → Decoding 키 사용
// 2. 키 오류 같은 게이트웨이 에러는 dataType=JSON이어도 XML로 옴 → JSON.parse 전에 확인
//    (<returnAuthMsg>SERVICE_KEY_IS_NOT_REGISTERED_ERROR</returnAuthMsg> 같은 형태)
// 3. 정상 JSON이어도 response.header.resultCode가 '00'이 아니면 실패 (예: '03' NO_DATA)
// 4. 기상청 서버가 가끔 응답을 안 줌 → fetch에 타임아웃 걸기 (AbortSignal.timeout)
// 5. numOfRows 기본값이 10이라 예보 데이터가 잘림 → 넉넉하게 (1000)

export type KmaItem = {
  baseDate: string;
  baseTime: string;
  category: string; // T1H 기온, PTY 강수형태, POP 강수확률, SNO 적설 ...
  nx: number;
  ny: number;
  obsrValue?: string; // 실황 값
  fcstDate?: string; // 예보 대상 날짜
  fcstTime?: string; // 예보 대상 시각
  fcstValue?: string; // 예보 값
};

/** 초단기실황 */
export async function getUltraSrtNcst(key: string, nx: number, ny: number): Promise<KmaItem[]> {
  // TODO: ncstBase() 사용
  throw new Error('getUltraSrtNcst 미구현');
}

/** 단기예보 */
export async function getVilageFcst(key: string, nx: number, ny: number): Promise<KmaItem[]> {
  // TODO: vilageBase() 사용
  throw new Error('getVilageFcst 미구현');
}

// 위 두 함수가 공통으로 쓸 내부 함수 하나 만들어서 중복 줄이는 거 추천
void ncstBase;
void vilageBase;
