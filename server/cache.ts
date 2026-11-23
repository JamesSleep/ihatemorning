// 메모리 캐시
//
// 왜 필요한가
// - 프론트가 1분마다 폴링해도 기상청은 10~30분에 한 번만 부르고 싶음 (트래픽 제한 + 기상청 데이터 갱신 주기)
// - 기상청 API가 가끔 죽음 → 그럴 때 화면이 비면 안 됨
//
// 요구사항
// - key별로 마지막 성공 값과 시각 저장 (Map 하나면 충분)
// - TTL 안이면 저장된 값 반환, fn 호출 안 함
// - TTL 지났으면 fn 호출
//   - 성공: 저장하고 반환 (stale: false)
//   - 실패 + 예전 값 있음: 예전 값 반환 (stale: true, error: 메시지)
//   - 실패 + 예전 값 없음: 그대로 throw
//
// 생각해볼 거 (면접 질문 거리)
// - 동시에 요청 두 개가 들어오면 fn이 두 번 불림. 문제인가? 막으려면?
// - 서버 재시작하면 캐시 날아감. 이 프로젝트에선 괜찮은 이유는?

export type Cached<T> = {
  data: T;
  fetchedAt: string; // ISO 문자열
  stale: boolean;
  error?: string;
};

export async function cached<T>(key: string, ttlMs: number, fn: () => Promise<T>): Promise<Cached<T>> {
  // TODO
  throw new Error('cached 미구현');
}
