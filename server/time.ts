// 기상청 API 요청에 넣을 base_date / base_time 계산
//
// 요구사항
// - 항상 "한국시간" 기준으로 계산할 것 (서버 시간대 설정에 의존하지 않기)
//   └ 힌트: Date.getTime()에 9시간을 더한 뒤 getUTCHours() 같은 UTC 메서드로 읽으면 KST가 나옴
// - 반환 형식: { base_date: 'YYYYMMDD', base_time: 'HHMM' }
//
// 함정
// - 날짜가 넘어가는 경계 (00시대에 "1시간 전"이면 전날이 됨)
// - 한 자리 숫자 패딩 ('5' → '05')

export type BaseDateTime = { base_date: string; base_time: string };

/**
 * 초단기실황(getUltraSrtNcst)
 * - 매시 정시(HH00) 기준으로 생성
 * - 발표가 바로 안 됨 → 정시 후 약 40분 이후에 조회 가능
 * - 예: 06:30 → 05:00 기준 / 06:50 → 06:00 기준
 */
export function ncstBase(now = new Date()): BaseDateTime {
  // TODO
  throw new Error('ncstBase 미구현');
}

/**
 * 단기예보(getVilageFcst)
 * - 하루 8번 발표: 02, 05, 08, 11, 14, 17, 20, 23시
 * - 발표 후 약 10분 뒤부터 조회 가능 (여유 있게 15분 잡기)
 * - 예: 06:30 → 05:00 / 05:10 → 02:00 / 01:00 → 전날 23:00
 */
export function vilageBase(now = new Date()): BaseDateTime {
  // TODO
  throw new Error('vilageBase 미구현');
}
