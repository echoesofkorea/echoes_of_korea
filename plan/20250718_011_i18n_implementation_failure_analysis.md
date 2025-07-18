# i18n 구현 시도 및 실패 분석

## 개요
2025년 7월 18일, next-intl을 사용한 국제화(i18n) 구현을 시도했으나 지속적인 404 오류로 인해 실패하여 모든 i18n 관련 코드를 제거하고 원상복구함.

## 시도한 구현 방법

### 1. 기본 구조 및 설정
- **라이브러리**: next-intl (Next.js App Router 호환)
- **라우팅 전략**: 경로 기반 라우팅 (`/ko/admin`, `/en/admin`)
- **지원 언어**: 한국어(ko), 영어(en)

#### 구현된 파일들:
```
messages/
├── ko.json - 한국어 번역
└── en.json - 영어 번역

i18n.ts - next-intl 설정
middleware.ts - next-intl + Supabase 인증 미들웨어 결합
app/[locale]/layout.tsx - 로케일별 루트 레이아웃
```

### 2. 번역 파일 구조
```json
{
  "common": {
    "loading": "로딩 중...",
    "error": "오류가 발생했습니다",
    "save": "저장",
    "cancel": "취소"
  },
  "auth": {
    "login": "로그인",
    "logout": "로그아웃",
    "email": "이메일",
    "password": "비밀번호"
  },
  "dashboard": {
    "title": "대시보드",
    "totalInterviews": "총 인터뷰",
    "completedInterviews": "완료된 인터뷰"
  }
}
```

### 3. 미들웨어 통합
next-intl의 `createMiddleware`와 Supabase 인증 미들웨어를 결합하려 시도:

```typescript
// 시도한 미들웨어 구조
import createMiddleware from 'next-intl/middleware';
import { createServerClient } from '@supabase/ssr';

const intlMiddleware = createMiddleware({
  locales: ['ko', 'en'],
  defaultLocale: 'ko'
});

export async function middleware(request: NextRequest) {
  // 1. next-intl 미들웨어 실행
  const response = intlMiddleware(request);
  
  // 2. Supabase 인증 처리
  const supabase = createServerClient(/* ... */);
  await supabase.auth.getUser();
  
  return response;
}
```

## 발생한 문제들

### 1. 지속적인 404 오류
- **증상**: 모든 `/ko/admin/*` 경로에서 404 오류 발생
- **미들웨어 동작**: 정상적으로 `/admin/dashboard` → `/ko/admin/dashboard`로 리다이렉트
- **문제점**: 리다이렉트 후에도 페이지를 찾을 수 없음

### 2. Next.js 15 호환성 문제
```typescript
// 오류가 발생한 코드
export default async function Page({ params }: { params: { locale: string } }) {
  // Error: params is a Promise in Next.js 15
  const locale = params.locale;
}

// 수정된 코드
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
}
```

### 3. getMessages() 함수에서 undefined locale
```typescript
// i18n.ts에서 발생한 오류
export default getRequestConfig(async ({ locale }) => {
  console.log('Locale received:', locale); // undefined
  
  return {
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
```

### 4. 서버/클라이언트 컴포넌트 경계 문제
- NextIntlClientProvider 설정 시 클라이언트 컴포넌트 오류
- useTranslations() vs getTranslations() 혼용 문제
- 서버 컴포넌트에서 getMessages() 호출 오류

### 5. 레이아웃 충돌
- 루트 `layout.tsx`와 `[locale]/layout.tsx` 간의 html/body 태그 중복
- NextIntlClientProvider 래핑으로 인한 렌더링 문제

## 시도한 해결 방법들

### 1. 단계적 단순화
```typescript
// 복잡한 대시보드를 단순한 버전으로 교체
export default async function DashboardPage() {
  return (
    <div>
      <h1>Simple Dashboard</h1>
      <p>Test page</p>
    </div>
  );
}
```

### 2. 하드코딩된 링크 수정
```typescript
// 수정 전
<Link href="/admin/dashboard">

// 수정 후  
<Link href={`/${locale}/admin/dashboard`}>
```

### 3. 명시적 로케일 전달
```typescript
// navigation.ts를 통한 중앙화된 설정
export const { Link, redirect, usePathname, useRouter } = createLocalizedPathnamesNavigation({
  locales: ['ko', 'en'],
  defaultLocale: 'ko',
  pathnames: {
    '/admin/dashboard': '/admin/dashboard',
    '/admin/interviews': '/admin/interviews'
  }
});
```

### 4. 서버/클라이언트 컴포넌트 분리
```typescript
// 서버 컴포넌트
const messages = await getMessages({ locale });

// 클라이언트 컴포넌트로 전달
<DashboardClient messages={messages} />
```

## 근본적인 문제점 분석

### 1. 미들웨어 실행 순서
- next-intl과 Supabase 미들웨어의 실행 순서 충돌
- 리다이렉트 체인이 복잡해져서 라우팅 실패

### 2. App Router와 next-intl 호환성
- Next.js 15 App Router의 동적 경로 처리 방식 변경
- next-intl의 내부 라우팅 메커니즘과의 충돌

### 3. 설정 복잡성
- 여러 미들웨어와 프로바이더의 조합으로 인한 복잡성 증가
- 디버깅이 어려운 블랙박스 상황 발생

## 최종 결정

### 원상복구 사유
1. **개발 일정**: 404 오류 해결에 과도한 시간 소요
2. **복잡성**: 현재 프로젝트 규모에 비해 i18n 구현이 과도하게 복잡
3. **안정성**: 기존 인증 시스템과의 충돌 위험

### 제거된 파일들
```
messages/ko.json
messages/en.json
i18n.ts
app/[locale]/layout.tsx
app/[locale]/admin/dashboard/page.tsx
components/admin/DashboardClientUI.tsx
types/i18n.ts
```

### 복구된 파일들
```
app/layout.tsx - 단순한 루트 레이아웃으로 복구
app/admin/dashboard/page.tsx - 하드코딩된 한국어 버전
middleware.ts - Supabase 인증만 처리
components/admin/Sidebar.tsx - 하드코딩된 한국어 메뉴
```

## 교훈 및 향후 계획

### 교훈
1. **점진적 구현**: 기존 시스템을 완전히 변경하지 말고 점진적으로 추가
2. **단순성 우선**: 프로젝트 초기에는 단순한 구조 유지
3. **호환성 검증**: 새로운 라이브러리 도입 전 충분한 호환성 테스트 필요

### 향후 i18n 구현 고려사항
1. **프로젝트 성숙도**: 핵심 기능 완성 후 i18n 추가 고려
2. **대안 라이브러리**: react-i18next 등 다른 라이브러리 검토
3. **단계적 접근**: 먼저 클라이언트 사이드 번역부터 시작

## 참고 문서
- plan/20250718_004_i18n_implementation_plan.md
- plan/20250718_005_i18n_revised_plan.md
- plan/20250718_006_i18n_routing_issue_and_solution.md
- plan/20250718_007_i18n_provider_hook_issue.md
- plan/20250718_008_i18n_locale_undefined_issue.md
- plan/20250718_009_i18n_explicit_locale_fix.md
- plan/20250718_010_i18n_final_resolution.md