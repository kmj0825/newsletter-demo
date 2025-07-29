# API 문서

## N8N Webhook 연동 가이드

### 워크플로우 설정

1. **Webhook 노드 설정**
   - Path: `/webhook/research`
   - Method: `POST`
   - Response Mode: `lastNode`

2. **예상 요청 형식**
```json
{
  "query": "AI",
  "address": "user@example.com", 
  "language": "ko",
  "timestamp": "2025-07-29T02:30:00.000Z",
  "requestId": 1
}
```

3. **응답 형식**
```json
{
  "status": "success",
  "message": "뉴스레터가 발송되었습니다"
}
```

### 개발 환경 설정

1. **로컬 테스트**
   - N8N을 로컬에서 실행: `http://localhost:5678`
   - 워크플로우 활성화
   - `config.js`에서 URL 확인

2. **프로덕션 배포**
   - `config.js`의 `PROD_CONFIG.N8N_WEBHOOK_URL` 업데이트
   - N8N 인스턴스 URL로 변경

### 트러블슈팅

- **CORS 오류**: N8N에서 CORS 설정 확인
- **타임아웃**: 뉴스 검색 시간이 오래 걸릴 수 있음 (30초 기본값)
- **연결 실패**: N8N 서버 상태 및 워크플로우 활성화 상태 확인