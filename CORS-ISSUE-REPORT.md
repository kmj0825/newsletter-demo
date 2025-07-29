# CORS 오류 해결 요청 - N8N Webhook + 브라우저 연동 문제

## 📋 문제 요약

N8N 워크플로우의 webhook 엔드포인트에 브라우저에서 POST 요청을 보낼 때 **CORS 오류**가 발생하여 연결이 실패합니다. curl을 통한 직접 요청은 정상 작동하지만, 웹 브라우저에서의 fetch 요청은 차단됩니다.

## 🌐 환경 정보

### N8N 설정
- **N8N 서버**: `https://hcx-n8n.io.naver.com`
- **Webhook URL**: `https://hcx-n8n.io.naver.com/webhook-test/research`
- **HTTP 메소드**: POST
- **Content-Type**: application/json

### 클라이언트 환경
- **브라우저**: Chrome, Safari, Firefox (모두 동일 문제)
- **로컬 서버**: `http://localhost:8000` (Python HTTP Server)
- **JavaScript**: Vanilla JS, fetch API 사용

## ✅ 정상 작동하는 것

### 1. curl을 통한 직접 요청
```bash
curl -X POST https://hcx-n8n.io.naver.com/webhook-test/research \
  -H "Content-Type: application/json" \
  -d '{
    "query": "AI",
    "address": "test@example.com", 
    "language": "ko"
  }'
```
**결과**: HTTP 200 OK, 정상 응답

### 2. N8N 워크플로우
N8N 내부에서 워크플로우는 정상적으로 실행되며, 이메일 발송까지 완료됩니다.

## ❌ 실패하는 것

### 브라우저에서의 fetch 요청
```javascript
const response = await fetch('https://hcx-n8n.io.naver.com/webhook-test/research', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  body: JSON.stringify({
    query: "AI",
    address: "test@example.com",
    language: "ko"
  })
});
```

**오류 메시지**: 
- Chrome: `Failed to fetch`
- Firefox: `NetworkError when attempting to fetch resource`
- Safari: `The request is not allowed by the user agent or the platform`

## 🔧 현재 N8N CORS 설정

N8N Webhook 노드에서 다음 CORS 헤더들이 설정되어 있습니다:

```json
{
  "responseHeaders": {
    "entries": [
      {
        "name": "Access-Control-Allow-Origin",
        "value": "*"
      },
      {
        "name": "Access-Control-Allow-Methods", 
        "value": "POST, OPTIONS"
      },
      {
        "name": "Access-Control-Allow-Headers",
        "value": "Content-Type, Accept"
      }
    ]
  }
}
```

## 🔍 브라우저 개발자 도구에서 확인된 내용

### Network 탭
- **요청 상태**: `(failed)` 또는 `CORS error`
- **실제 요청**: 브라우저에서 실제 POST 요청이 전송되지 않음
- **Preflight 요청**: OPTIONS 요청도 확인되지 않음

### Console 오류
```
Access to fetch at 'https://hcx-n8n.io.naver.com/webhook-test/research' 
from origin 'http://localhost:8000' has been blocked by CORS policy: 
Request had no target
```

## 🚨 예상 원인

1. **OPTIONS Preflight 요청 미처리**: 
   - 브라우저가 먼저 OPTIONS 요청을 보내지만 N8N이 처리하지 못함
   - Content-Type이 application/json이므로 preflight 요청 필요

2. **N8N Webhook의 CORS 처리 한계**:
   - Response 헤더만 설정되어 있고, OPTIONS 요청 자체를 처리하지 못함
   - Webhook이 POST만 받도록 설정되어 OPTIONS를 거부할 가능성

3. **브라우저 보안 정책**:
   - Cross-origin 요청에 대한 엄격한 검증
   - localhost:8000 → hcx-n8n.io.naver.com 도메인 간 요청

## 📁 전체 코드 구조

### 프론트엔드 구조
```
newsletter-demo/
├── index.html              # 메인 페이지
├── config.js               # API 설정
├── scripts/
│   ├── api.js             # API 통신 로직
│   ├── main.js            # 메인 애플리케이션
│   └── validation.js      # 폼 검증
├── styles/
│   ├── main.css           # 메인 스타일
│   └── components.css     # 컴포넌트 스타일
└── test-mode.js           # 테스트 모드 (CORS 우회용)
```

### API 통신 코드 (scripts/api.js)
```javascript
async makeHttpRequest(payload) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
  
  try {
    console.log('[API] Making request to:', this.config.webhookUrl);
    console.log('[API] Request payload:', payload);
    
    const response = await fetch(this.config.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    
    console.log('[API] Response received:', response.status, response.statusText);
    // ... 나머지 처리 로직
  } catch (error) {
    console.error('[API] Fetch error:', error);
    throw error;
  }
}
```

### N8N 워크플로우 (newsletter_demo.json)
```json
{
  "name": "세미나 데모 용 워크플로우",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "research", 
        "responseMode": "lastNode",
        "options": {
          "responseHeaders": {
            "entries": [
              {
                "name": "Access-Control-Allow-Origin",
                "value": "*"
              },
              {
                "name": "Access-Control-Allow-Methods",
                "value": "POST, OPTIONS"
              },
              {
                "name": "Access-Control-Allow-Headers", 
                "value": "Content-Type, Accept"
              }
            ]
          }
        }
      },
      "name": "Webhook 트리거",
      "type": "n8n-nodes-base.webhook"
    }
    // ... 나머지 노드들
  ]
}
```

## 🎯 요청사항

다음 해결방안들 중 어떤 것이 가장 효과적일지, 또는 다른 해결책이 있는지 조언을 부탁드립니다:

### 옵션 1: N8N 설정 수정
- Webhook에서 OPTIONS 메소드도 처리하도록 설정
- 추가 CORS 헤더 설정 (Access-Control-Max-Age 등)

### 옵션 2: 프록시 서버 구현  
- 로컬에서 프록시 서버를 띄워 CORS 우회
- Express.js 등으로 간단한 프록시 구현

### 옵션 3: N8N 대안
- N8N 대신 다른 webhook 서비스 사용
- 직접 서버 구현 (Node.js/Express)

### 옵션 4: 브라우저 설정
- Chrome에서 --disable-web-security 플래그 사용 (개발용)
- CORS 확장 프로그램 사용

## 🔧 이미 시도한 해결 방법

1. ✅ **CORS 헤더 추가**: N8N에 기본적인 CORS 헤더 설정 완료
2. ✅ **다양한 브라우저 테스트**: Chrome, Firefox, Safari 모두 동일 오류
3. ✅ **요청 방식 변경**: GET/POST 모두 시도
4. ✅ **헤더 최소화**: 불필요한 헤더 제거 시도
5. ✅ **테스트 모드 구현**: Mock API로 프론트엔드 동작 확인 완료

## 📞 추가 정보

- **긴급도**: 중간 (데모 프로젝트이지만 실제 동작 확인 필요)
- **제약사항**: N8N 서버는 변경하기 어려울 수 있음
- **목표**: 웹 브라우저에서 N8N webhook으로 성공적인 POST 요청

어떤 방향으로 접근하는 것이 가장 효과적일까요?