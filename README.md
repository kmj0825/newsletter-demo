# 🧠 HyperCLOVA-X Newsletter Automation Demo

HyperCLOVA-X와 N8N을 활용한 AI 뉴스레터 자동화 시스템의 **라이브 데모**입니다.

![Demo Status](https://img.shields.io/badge/demo-live-success.svg)
![HyperCLOVA-X](https://img.shields.io/badge/AI-HyperCLOVA--X-blue.svg)
![N8N](https://img.shields.io/badge/automation-N8N-orange.svg)

## ✨ 주요 기능

- 🔍 **키워드 기반 뉴스 수집**: 네이버 뉴스 API로 실시간 수집
- 🧠 **HyperCLOVA-X 큐레이션**: AI가 관련도 순으로 기사 재정렬
- 📧 **즉시 이메일 발송**: 개인화된 뉴스레터 자동 생성 및 전송
- ⚡ **실시간 처리**: 3단계 자동화 파이프라인

## 🚀 사용 방법

### 1. GitHub Pages에서 사용 (권장)

**Live Demo**: [https://kmj0825.github.io/newsletter-demo](https://kmj0825.github.io/newsletter-demo)

1. 위 링크 접속
2. 관심 키워드 입력 (예: `인공지능, 스타트업`)
3. 이메일 주소 입력
4. "뉴스레터 생성하기" 버튼 클릭
5. 실시간으로 뉴스레터 수신 확인

### 2. 로컬에서 사용

```bash
# 저장소 클론
git clone https://github.com/kmj0825/newsletter-demo.git
cd newsletter-demo

# 로컬 서버 실행
python3 -m http.server 8000

# 브라우저에서 확인
open http://localhost:8000
```

## 🛠️ 기술 스택

**Frontend**
- HTML5 + CSS3 + Vanilla JavaScript
- 반응형 디자인 (Grid + Flexbox)
- Progressive Web App

**Backend Integration**
- **N8N**: 워크플로우 자동화
- **HyperCLOVA-X**: AI 텍스트 생성 및 큐레이션
- **네이버 뉴스 API**: 실시간 뉴스 데이터
- **SMTP**: 이메일 자동 발송

**Hosting**
- GitHub Pages (라이브 데모)
- 로컬 HTTP 서버 지원

## 🎯 작동 원리

```
  키워드 입력   →   AI 뉴스 큐레이션     → 즉시 발송
     ↓                ↓                ↓
  사용자 입력      네이버 뉴스 수집       이메일 전송
               HyperCLOVA-X 분석
```

1. **키워드 입력**: 관심 키워드와 이메일 주소 입력
2. **AI 뉴스 큐레이션**: 네이버 뉴스를 수집하고 HyperCLOVA-X가 관련도 순으로 재정렬
3. **즉시 발송**: 완성된 맞춤 뉴스레터를 이메일로 바로 전송

## 📁 프로젝트 구조

```
newsletter-demo/
├── index.html              # 메인 페이지
├── config.js               # 환경 설정
├── styles/
│   ├── main.css           # 메인 스타일
│   └── components.css     # 컴포넌트 스타일
├── scripts/
│   ├── api.js             # API 통신
│   ├── main.js            # 메인 로직
│   └── validation.js      # 폼 검증
└── newsletter_demo.json   # N8N 워크플로우
```

## 🌐 멀티 환경 지원

- **로컬 개발**: `localhost:8000`
- **GitHub Pages**: `username.github.io/newsletter-demo`
- **자동 환경 감지**: 동일한 설정으로 두 환경 모두 지원

## 🎬 시연 가이드

이 프로젝트는 **라이브 데모**를 위해 최적화되었습니다:

- ✅ 깔끔한 3단계 워크플로우 표시
- ✅ 실시간 작동하는 AI 뉴스레터 생성
- ✅ 전문적인 프레젠테이션 레이아웃
- ✅ 모바일/데스크톱 반응형 디자인

---

**⭐ 라이브 데모를 체험해보세요!** [https://kmj0825.github.io/newsletter-demo](https://kmj0825.github.io/newsletter-demo)
