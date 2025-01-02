# Quiz Forge Frontend

강의 음성을 분석하여 자동으로 학습 자료를 생성하는 웹 애플리케이션의 프론트엔드입니다.

## 🌏 멀티리전 배포

이 애플리케이션은 AWS Amplify를 통해 전세계 배포를 지원합니다:

### 배포 구성
- **AWS Amplify**: CI/CD 파이프라인 및 호스팅
- **CloudFront**: 전세계 엣지 로케이션을 통한 콘텐츠 전송
- **Route 53**: 도메인 관리 및 DNS 라우팅

### API 엔드포인트 설정
```javascript
// amplify/backend/api/config.json
{
  "api": {
    "endpoints": [
      {
        "name": "api",
        "endpoint": "https://api.yourdomain.com"
      }
    ]
  }
}
```

Route 53의 지연 시간 기반 라우팅을 통해 가장 가까운 리전의 API로 자동 연결됩니다.

## 🚀 배포 방법

### 사전 준비

1. Amplify CLI 설치 및 설정
```bash
npm install -g @aws-amplify/cli
amplify configure
```

2. 필요한 패키지 설치
```bash
npm install
```

### 배포 단계

1. Amplify 초기화 (최초 1회):
```bash
amplify init
```

2. 프론트엔드 배포:
```bash
amplify push
```

배포는 GitHub 저장소와 연동된 Amplify Console에서 자동으로 진행됩니다.

## 🛠 개발 환경 설정

### 로컬 개발 서버 실행

```bash
npm start
```

### 테스트 실행

```bash
npm test
```

### 프로덕션 빌드

```bash
npm run build
```

## 📦 주요 기능

- 사용자 인증 (로그인/회원가입)
- 강의 업로드 및 관리
- 실시간 처리 상태 모니터링
- 문제 및 분석 결과 조회
- 커뮤니티 기능 (게시글/댓글)

## 🔧 기술 스택

- **Framework**: React 18
- **상태 관리**: Redux Toolkit
- **스타일링**: TailwindCSS
- **라우팅**: React Router v7
- **API 통신**: Axios
- **AWS 서비스**: 
  - AWS Amplify
  - Amplify UI React
- **UI 컴포넌트**: 
  - Headless UI
  - Heroicons
  - Lucide React

## 📁 프로젝트 구조

```
study-app-frontend/
├── public/
├── src/
│   ├── api/          # API 통신 관련
│   ├── components/   # 재사용 가능한 컴포넌트
│   ├── pages/        # 페이지 컴포넌트
│   ├── store/        # Redux 스토어
│   ├── utils/        # 유틸리티 함수
│   └── App.jsx       # 메인 앱 컴포넌트
```

## ⚙️ 환경 변수

### 개발 환경 (.env.development)
```
REACT_APP_API_URL=http://localhost:3000
```

### 프로덕션 환경 (.env.production)
```
REACT_APP_API_URL=https://api.yourdomain.com
```

## 🔍 성능 최적화

- Route-based Code Splitting
- CloudFront를 통한 전세계 CDN 배포
- 이미지 최적화
- Lazy Loading 적용

## 📝 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.
