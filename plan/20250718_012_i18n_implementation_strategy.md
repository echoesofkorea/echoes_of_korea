# 향후 i18n 도입 전략 (Next.js + Supabase + App Router)

이 문서는 `next-intl`, `Supabase`, 그리고 `Next.js App Router (v15)`를 사용하는 프로젝트에서 국제화(i18n)를 안전하고 안정적으로 도입하기 위한 단계별 전략을 설명합니다. 각 단계는 점진적 확장성과 안정성을 고려하여 구성되어 있으며, 실무 개발자와 Claude Code 등의 자동화 도구를 고려해 문서화되었습니다.

---

## ✅ 단계 1: 클라이언트 사이드 i18n만 우선 도입

### 목표
- 서버 라우팅, 미들웨어와의 충돌 없이 클라이언트 컴포넌트 안에서 다국어 지원을 구현

### 라이브러리
- `react-i18next` 또는 `next-translate`

### 예제 (react-i18next)
```tsx
// i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: { welcome: 'Welcome' } },
    ko: { translation: { welcome: '환영합니다' } },
  },
  lng: 'ko',
  fallbackLng: 'ko',
  interpolation: { escapeValue: false },
});

export default i18n;
```

```tsx
// App.tsx
import './i18n';
import { useTranslation } from 'react-i18next';

export default function App() {
  const { t } = useTranslation();
  return <h1>{t('welcome')}</h1>;
}
```

---

## ✅ 단계 2: 경로 기반 라우팅 도입 (국가별 URL 사용)

### 목표
- `/ko`, `/en`과 같은 경로 기반 locale 지원

### 구현 방식
- `[locale]/` 경로로 폴더 생성 (Next.js App Router 방식)
- `generateStaticParams()`로 locale 목록 미리 제공

### 주의
- `params`는 Next.js 15에서 `Promise`로 전달되므로 `await` 필요
```tsx
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  ...
}
```

---

## ✅ 단계 3: `next-intl` 서버/클라이언트 번역 시스템 도입

### 목표
- SSR과 CSR을 모두 지원하는 정식 i18n 구조 도입

### 구현 방식
- `next-intl`의 `createTranslator`, `useTranslations`, `getMessages` 사용
- `/messages/[locale].json` 구성

### Provider 설정 예시
```tsx
// app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from '@/i18n';

export default async function LocaleLayout({ children, params }) {
  const messages = await getMessages({ locale: params.locale });
  return (
    <html lang={params.locale}>
      <body>
        <NextIntlClientProvider messages={messages} locale={params.locale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

---

## ✅ 단계 4: Supabase 인증 미들웨어 통합

### 목표
- 로그인 여부 확인과 locale 경로 처리 병합

### 핵심 포인트
- `intlMiddleware()`와 Supabase `createMiddlewareClient()`는 동일한 `NextResponse` 객체를 공유해야 함

### 예시
```ts
// middleware.ts
import createMiddleware from 'next-intl/middleware';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: ['ko', 'en'],
  defaultLocale: 'ko'
});

export async function middleware(req) {
  const res = intlMiddleware(req); // i18n 먼저 처리
  const supabase = createMiddlewareClient({ req, res });

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  return res;
}
```

---

## ✅ 단계 5: 테스트 및 확장

### 테스트 전략
- 로그인 유무에 따라 페이지 접근 확인
- `/ko/admin` 과 `/en/admin` 모두 정상 작동하는지 테스트
- SSR + 클라이언트 hydration 동작 확인

### 향후 확장
- 브라우저 언어 감지 후 자동 locale 선택
- `createLocalizedPathnamesNavigation()` 등으로 라우팅 추상화
- CMS 기반 메시지 로딩

---

## ✅ 결론 및 권장 순서

1. **react-i18next** 기반 클라이언트 사이드 i18n으로 시작
2. **[locale] 경로 구조** 추가하여 경로 기반 라우팅 실험
3. **next-intl + getMessages** 구조로 점진적 마이그레이션
4. **middleware에서 Supabase 인증 + locale 병합**
5. **SSR/CSR 모두 커버되는 안정 구조 확정**

---

**Tip**: Claude Code에게는 각 단계를 정확히 지시해 주되, `middleware.ts`, `layout.tsx`, `messages/*.json`, `auth-provider.tsx` 파일의 구조를 명확히 나눠서 설계하면 구현이 수월합니다.
