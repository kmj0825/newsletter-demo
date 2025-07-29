# 🗞️ AI Newsletter Demo

N8N 자동화 파이프라인을 활용한 맞춤형 뉴스레터 서비스 데모 웹페이지

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-development-orange.svg)
![GitHub Pages](https://img.shields.io/badge/deployed-GitHub%20Pages-success.svg)

## 🎯 프로젝트 소개

이 프로젝트는 사용자가 입력한 키워드를 바탕으로 자동으로 뉴스를 수집하고, AI가 맞춤형 뉴스레터를 작성하여 이메일로 발송하는 데모 서비스입니다. N8N 워크플로우 자동화를 통해 전체 프로세스가 자동으로 처리됩니다.

### ✨ 주요 기능

- 🔍 **키워드 기반 뉴스 검색**: 관심 주제의 최신 뉴스 자동 수집
- 🤖 **AI 뉴스레터 생성**: 수집된 뉴스를 바탕으로 읽기 쉬운 뉴스레터 자동 작성
- 📧 **이메일 자동 발송**: 완성된 뉴스레터를 지정한 이메일로 발송
- 📱 **반응형 디자인**: 모든 기기에서 최적화된 사용자 경험
- ⚡ **실시간 처리**: 빠른 응답과 상태 피드백

## 🚀 빠른 시작

### 데모 사용하기

1. **웹사이트 방문**: [https://kmj0825.github.io/newsletter-demo](https://kmj0825.github.io/newsletter-demo)
2. **키워드 입력**: 관심 있는 뉴스 주제 입력 (예: "인공지능", "스타트업", "기술트렌드")
3. **이메일 입력**: 뉴스레터를 받을 이메일 주소 입력
4. **언어 선택**: 한국어 또는 영어 선택
5. **구독 신청**: "뉴스레터 구독하기" 버튼 클릭
6. **확인**: 처리 상태 확인 후 이메일로 뉴스레터 수신

**⚠️ 주의사항**: 현재 데모는 N8N 워크플로우 URL 설정이 필요합니다. `config.js` 파일에서 실제 N8N 인스턴스 URL로 업데이트해주세요.

### 로컬 개발 환경 설정

```bash
# 저장소 클론
git clone https://github.com/kmj0825/newsletter-demo.git
cd newsletter-demo

# 로컬 서버 실행 (Python 3)
python -m http.server 8000

# 또는 Node.js 사용
npx http-server

# 브라우저에서 확인
open http://localhost:8000
```

## 🛠️ 기술 스택

### Frontend
- **HTML5**: 시맨틱 마크업과 접근성
- **CSS3**: 모던 스타일링 (Grid, Flexbox, CSS Variables)
- **JavaScript (ES6+)**: 바닐라 자바스크립트로 경량화
- **Progressive Web App**: 오프라인 지원 및 모바일 최적화

### Backend Integration
- **N8N**: 워크플로우 자동화 플랫폼
- **Webhook API**: RESTful API 통신
- **뉴스 API**: 실시간 뉴스 데이터 수집
- **AI 서비스**: 자연어 처리 및 텍스트 생성

### Hosting
- **GitHub Pages**: 무료 정적 사이트 호스팅
- **Custom Domain**: 선택적 도메인 연결 지원
- **HTTPS**: SSL/TLS 보안 연결

## 📋 사용 방법

### 1. 기본 사용법

```
1. 웹페이지 접속
   ↓
2. 관심 키워드 입력 (예: "AI", "스타트업")
   ↓
3. 이메일 주소 입력
   ↓
4. "구독하기" 버튼 클릭
   ↓
5. 처리 상태 확인
   ↓
6. 이메일 수신 확인
```

### 2. 고급 옵션

- **여러 키워드**: 쉼표로 구분하여 여러 키워드 입력 가능
- **언어 설정**: 한국어/영어 뉴스 선택
- **빈도 설정**: 일간/주간 뉴스레터 선택

### 3. 구독 관리

- **구독 확인**: 이메일로 전송되는 확인 링크 클릭
- **구독 해지**: 뉴스레터 하단의 구독 해지 링크 사용
- **설정 변경**: 키워드나 빈도 변경 시 재구독 필요

## 🔧 설정 및 커스터마이제이션

### N8N Webhook 설정

1. **N8N 워크플로우 불러오기**
   - `newsletter_workflow.json` 파일을 N8N에 import
   - 또는 새 워크플로우 생성

2. **Webhook 노드 설정**
   - Path: `/webhook/research`
   - Method: `POST`
   - Response Mode: `lastNode`

3. **API 키 설정**
   - 네이버 API 키 (Client ID, Client Secret)
   - HyperCLOVA-X API 토큰
   - SMTP 설정 (이메일 발송용)

4. **웹훅 URL 업데이트**
```javascript
// config.js에서 설정
const PROD_CONFIG = {
  N8N_WEBHOOK_URL: 'https://your-n8n-instance.com/webhook/research',
  DEBUG: false,
  TIMEOUT: 30000
};
```

### 환경별 설정

```javascript
// 개발 환경
const DEV_CONFIG = {
  WEBHOOK_URL: 'http://localhost:5678/webhook/newsletter',
  DEBUG: true
};

// 프로덕션 환경
const PROD_CONFIG = {
  WEBHOOK_URL: 'https://your-domain.com/webhook/newsletter',
  DEBUG: false
};
```

## 📚 API 문서

### 요청 형식

```http
POST /webhook/newsletter
Content-Type: application/json

{
  "keyword": "인공지능",
  "email": "user@example.com",
  "language": "ko",
  "frequency": "daily"
}
```

### 응답 형식

```json
// 성공
{
  "status": "success",
  "message": "뉴스레터 구독이 등록되었습니다",
  "subscription_id": "sub_123456789"
}

// 실패
{
  "status": "error",
  "message": "잘못된 이메일 형식입니다",
  "error_code": "INVALID_EMAIL"
}
```

### 에러 코드

| 코드 | 설명 | 해결 방법 |
|------|------|----------|
| `INVALID_EMAIL` | 이메일 형식 오류 | 올바른 이메일 형식 입력 |
| `EMPTY_KEYWORD` | 키워드 미입력 | 최소 1개 키워드 입력 |
| `WEBHOOK_ERROR` | N8N 연결 오류 | 잠시 후 다시 시도 |
| `RATE_LIMIT` | 요청 제한 초과 | 1분 후 재시도 |

## 🧪 테스트

### 로컬 테스트

```bash
# 폼 유효성 테스트
npm test

# E2E 테스트 (Playwright)
npx playwright test

# 접근성 테스트
npm run a11y-test
```

### 지원 브라우저

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ 모바일 브라우저

## 🚀 배포

### GitHub Pages 자동 배포

1. **Repository 설정**
   - Settings → Pages
   - Source: Deploy from a branch
   - Branch: main

2. **커스텀 도메인** (선택사항)
   ```
   # CNAME 파일 생성
   echo "your-domain.com" > CNAME
   ```

3. **배포 확인**
   - Actions 탭에서 배포 상태 확인
   - 5-10분 후 사이트 접속 가능

### 수동 배포

```bash
# 빌드 (필요시)
npm run build

# GitHub에 푸시
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

## 🔒 보안 및 프라이버시

### 데이터 보호
- **최소 수집**: 이메일과 키워드만 수집
- **암호화**: HTTPS 통신으로 데이터 보호
- **보관 정책**: 구독 해지 시 데이터 삭제

### 스팸 방지
- **Rate Limiting**: 1분당 최대 5회 요청
- **이메일 검증**: 실제 이메일 주소 확인
- **Captcha**: 봇 방지 (옵션)

## 🐛 문제 해결

### 일반적인 문제

1. **뉴스레터가 오지 않아요**
   - 스팸 폴더 확인
   - 이메일 주소 재확인
   - 10-15분 후 재시도

2. **"서버 연결 오류" 메시지**
   - 인터넷 연결 확인
   - N8N 서버 상태 확인
   - 잠시 후 재시도

3. **모바일에서 레이아웃이 깨져요**
   - 브라우저 캐시 삭제
   - 최신 브라우저 사용
   - 이슈 리포트 제출

### 개발자 도구

```javascript
// 콘솔에서 디버그 모드 활성화
localStorage.setItem('debug', 'true');
location.reload();

// 로그 확인
console.log(window.newsletterApp.getStats());
```

## 🤝 기여하기

### 기여 방법

1. **Fork** 저장소를 포크하세요
2. **Branch** 기능 브랜치를 생성하세요 (`git checkout -b feature/amazing-feature`)
3. **Commit** 변경사항을 커밋하세요 (`git commit -m 'Add amazing feature'`)
4. **Push** 브랜치에 푸시하세요 (`git push origin feature/amazing-feature`)
5. **Pull Request** PR을 생성하세요

### 개발 가이드라인

- **코딩 스타일**: ESLint 설정 준수
- **커밋 메시지**: [Conventional Commits](https://conventionalcommits.org/) 형식
- **테스트**: 새 기능은 테스트 코드 포함
- **문서화**: README 및 코드 주석 업데이트

## 📊 로드맵

### v1.0 (현재)
- ✅ 기본 뉴스레터 구독 기능
- ✅ 반응형 웹 디자인
- ✅ N8N 워크플로우 통합

### v1.1 (예정)
- 🔄 구독 관리 페이지
- 🔄 뉴스레터 미리보기
- 🔄 다국어 지원

### v2.0 (계획)
- 📋 사용자 대시보드
- 📋 뉴스레터 아카이브
- 📋 소셜 미디어 공유

## 📄 라이선스

이 프로젝트는 [MIT License](LICENSE)를 따릅니다.

## 📞 지원 및 연락

- **Issues**: [GitHub Issues](https://github.com/kmj0825/newsletter-demo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/kmj0825/newsletter-demo/discussions)
- **Email**: [프로젝트 이메일]

## 🙏 감사의 말

- [N8N](https://n8n.io/) - 워크플로우 자동화 플랫폼
- [GitHub Pages](https://pages.github.com/) - 무료 호스팅 서비스
- [OpenAI](https://openai.com/) - AI 뉴스레터 생성

---

**⭐ 이 프로젝트가 도움이 되었다면 Star를 눌러주세요!**