
# Echoes of Korea: i18n Implementation Plan

## 1. Objective

Integrate internationalization (i18n) into the "Echoes of Korea" application to support both Korean (`ko`) and English (`en`). This will apply to the admin panel and the future public-facing site. Users should be able to switch languages, and the UI text, along with specific database content, should update accordingly.

## 2. Core Strategy & Technology Choice

*   **Library:** Use **`next-intl`**. It is designed for the Next.js App Router and offers robust i18n features for both Server and Client Components, making it the best fit for the current tech stack.
*   **Routing:** Implement **path-based routing** (e.g., `/en/admin/dashboard`, `/ko/admin/dashboard`). This is beneficial for SEO and provides a clear structure for users and developers.
*   **Translation Files:** Manage language messages in **JSON files** (`messages/en.json`, `messages/ko.json`) for easy maintenance.
*   **Content Translation Strategy:**
    *   **UI Strings:** All interface text (buttons, labels, titles) will be translated.
    *   **Database Content:** Specific fields in the `interviews` table, such as `title` and `summary`, will be adapted for multilingual support. The `full_transcript` will **not** be translated to preserve its authenticity as a source document.

## 3. Database Schema Changes (Supabase)

To store multilingual content, we will alter specific text fields in the `interviews` table to use the `JSONB` type, which is highly efficient for handling JSON data in PostgreSQL/Supabase.

**`interviews` Table Modifications:**

| Column Name   | Old Type | New Type | Description                                            |
| ------------- | -------- | -------- | ------------------------------------------------------ |
| `title`       | `TEXT`   | `JSONB`  | Stores multilingual titles, e.g., `{ "ko": "제목", "en": "Title" }` |
| `llm_summary` | `TEXT`   | `JSONB`  | Stores multilingual summaries, e.g., `{ "ko": "요약", "en": "Summary" }` |

## 4. Implementation Steps

### Step 1: Install Library

```bash
npm install next-intl
```

### Step 2: Create Translation Message Files

Create a `messages` directory in the project root.

*   `messages/en.json`:
    ```json
    {
      "AdminDashboard": {
        "title": "Dashboard",
        "totalInterviews": "Total Interviews"
      },
      "Buttons": {
        "save": "Save",
        "cancel": "Cancel"
      }
    }
    ```
*   `messages/ko.json`:
    ```json
    {
      "AdminDashboard": {
        "title": "대시보드",
        "totalInterviews": "총 인터뷰 수"
      },
      "Buttons": {
        "save": "저장",
        "cancel": "취소"
      }
    }
    ```

### Step 3: Create `i18n` Configuration File

Create `i18n.ts` in the project root.

*   `i18n.ts`:
    ```typescript
    import {getRequestConfig} from 'next-intl/server';
    
    export const locales = ['en', 'ko'];
    
    export default getRequestConfig(async ({locale}) => {
      if (!locales.includes(locale as any)) {
        // Handle invalid locale, e.g., redirect or 404
      }
    
      return {
        messages: (await import(`./messages/${locale}.json`)).default
      };
    });
    ```

### Step 4: Configure Middleware

Update `middleware.ts` to detect and handle locales for incoming requests.

*   `middleware.ts`:
    ```typescript
    import createMiddleware from 'next-intl/middleware';
    import { locales } from './i18n';
    
    export default createMiddleware({
      locales,
      defaultLocale: 'ko'
    });
    
    export const config = {
      matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
    };
    ```

### Step 5: Update Directory Structure

Create a `[locale]` dynamic segment directory under `app` to prefix all routes with the locale.

*   **Before:** `app/admin/dashboard/page.tsx`
*   **After:** `app/[locale]/admin/dashboard/page.tsx`

### Step 6: Modify Root Layout

Wrap the application in the `NextIntlClientProvider` in `app/[locale]/layout.tsx`.

*   `app/[locale]/layout.tsx`:
    ```typescript
    import {NextIntlClientProvider} from 'next-intl';
    import {getMessages} from 'next-intl/server';
    
    export default async function LocaleLayout({
      children,
      params: {locale}
    }: {
      children: React.ReactNode;
      params: {locale: string};
    }) {
      const messages = await getMessages();
    
      return (
        <html lang={locale}>
          <body>
            <NextIntlClientProvider messages={messages}>
              {children}
            </NextIntlClientProvider>
          </body>
        </html>
      );
    }
    ```

### Step 7: Use Translations in Components

Use the `useTranslations` hook to access translations.

*   Example `app/[locale]/admin/dashboard/page.tsx`:
    ```typescript
    import {useTranslations} from 'next-intl';
    
    export default function DashboardPage() {
      const t = useTranslations('AdminDashboard');
    
      return (
        <div>
          <h1>{t('title')}</h1>
          <p>{t('totalInterviews')}: 10</p>
        </div>
      );
    }
    ```

### Step 8: Create a Language Switcher Component

*   Example `components/LanguageSwitcher.tsx`:
    ```typescript
    'use client';
    
    import { usePathname, useRouter } from 'next/navigation';
    import { useLocale } from 'next-intl';
    
    export default function LanguageSwitcher() {
      const router = useRouter();
      const pathname = usePathname();
      const locale = useLocale();
    
      const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const nextLocale = e.target.value;
        const newPath = pathname.replace(`/${locale}`, `/${nextLocale}`);
        router.replace(newPath);
      };
    
      return (
        <select onChange={handleChange} defaultValue={locale}>
          <option value="en">English</option>
          <option value="ko">한국어</option>
        </select>
      );
    }
    ```

## 5. Testing Strategy

*   Verify language switching functionality
*   Test all UI components for proper translation rendering
*   Ensure proper URL handling for different locales
*   Validate database content retrieval in multiple languages

## 6. Future Considerations

*   **Content Management:** Consider implementing a CMS or admin interface for managing translations without touching code files.
*   **Performance:** Monitor bundle size as translation files grow and implement lazy loading if necessary.
*   **Right-to-Left Languages:** If planning to support RTL languages in the future, consider implementing proper text direction handling.
*   **Pluralization:** Implement proper plural rules for languages that have complex pluralization (Korean has simpler rules than English in most cases).

---

## 7. Implementation Considerations & Improvements

*Written by Claude Code Assistant based on current system analysis*

### 7.1 Middleware Integration Challenge

**Current Issue:** The project already has Supabase authentication middleware that conflicts with next-intl middleware.

**Proposed Solution:** Combine both middlewares using composition pattern:

```typescript
// middleware.ts
import createIntlMiddleware from 'next-intl/middleware';
import { createServerClient } from '@supabase/ssr';
import { locales } from './i18n';

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: 'ko'
});

export async function middleware(request: NextRequest) {
  // 1. Handle i18n first
  const intlResponse = intlMiddleware(request);
  
  // 2. Then handle Supabase auth
  const response = intlResponse || NextResponse.next();
  
  const supabase = createServerClient(/* ... */);
  const { data: { user } } = await supabase.auth.getSession();
  
  // 3. Auth logic with locale-aware redirects
  if (request.nextUrl.pathname.match(/^\/[^\/]+\/admin/) && !user) {
    const locale = request.nextUrl.pathname.split('/')[1];
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }
  
  return response;
}
```

### 7.2 Database Migration Strategy

**Gradual Migration Plan:**

1. **Phase 1**: Add new JSONB columns alongside existing TEXT columns
```sql
ALTER TABLE interviews 
ADD COLUMN title_i18n JSONB,
ADD COLUMN llm_summary_i18n JSONB;
```

2. **Phase 2**: Migrate existing data
```sql
UPDATE interviews 
SET title_i18n = jsonb_build_object('ko', title),
    llm_summary_i18n = jsonb_build_object('ko', llm_summary)
WHERE title_i18n IS NULL;
```

3. **Phase 3**: Update application code to use new columns

4. **Phase 4**: Drop old columns after verification

### 7.3 Enhanced URL Strategy

**Root Path Handling:**
- `/` → Auto-redirect to `/ko/` (default for Korean users)
- Browser language detection for first-time visitors
- Cookie-based language preference storage

**Legacy URL Support:**
```typescript
// Handle legacy URLs without locale
if (!pathname.match(/^\/[a-z]{2}\//)) {
  const locale = getUserPreferredLocale() || 'ko';
  return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
}
```

### 7.4 Type Safety Improvements

**Strongly-typed translation keys:**
```typescript
// types/i18n.ts
type Messages = typeof import('../messages/ko.json');
type IntlKeys = keyof Messages;

// Enhanced useTranslations with type safety
const t = useTranslations<'AdminDashboard'>();
t('title'); // ✅ TypeScript validates this key exists
t('invalid'); // ❌ TypeScript error
```

### 7.5 Database Content Helper Functions

**Utility functions for multilingual content:**
```typescript
// lib/i18n-helpers.ts
export function getLocalizedContent(
  content: { ko?: string; en?: string } | string, 
  locale: string,
  fallback: string = 'ko'
): string {
  if (typeof content === 'string') return content;
  return content[locale] || content[fallback] || '';
}

export function setLocalizedContent(
  existing: { ko?: string; en?: string } | null,
  locale: string,
  value: string
): { ko?: string; en?: string } {
  const current = existing || {};
  return { ...current, [locale]: value };
}
```

### 7.6 Performance Optimizations

**Bundle Splitting:**
```typescript
// Dynamic import for large translation files
export default getRequestConfig(async ({locale}) => {
  const messages = await import(`./messages/${locale}.json`);
  return { messages: messages.default };
});
```

**Caching Strategy:**
- Cache translation files in Redis for production
- Implement stale-while-revalidate for dynamic content

### 7.7 Content Management Integration

**Admin Interface for Translations:**
- Add translation management to admin panel
- Allow editing of multilingual `title` and `llm_summary` fields
- Translation status tracking (translated/untranslated/needs review)

**Workflow:**
1. Content created in Korean (primary language)
2. Mark for translation
3. Professional translator adds English version
4. Review and approval process

### 7.8 Implementation Priority

**Recommended Implementation Order:**
1. ✅ **Current System**: Basic functionality working
2. **Phase 1** (High Priority): Middleware integration + basic i18n
3. **Phase 2** (Medium Priority): Database migration + admin translation UI
4. **Phase 3** (Low Priority): Advanced features (CMS, automation)

This plan provides a solid foundation for implementing i18n in the Echoes of Korea application while maintaining code quality and user experience.
