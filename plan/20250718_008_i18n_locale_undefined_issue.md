
# Troubleshooting Plan: Resolving `undefined` Locale in `i18n.ts`

**Document Status:** Actionable Plan
**Version:** 1.0
**Date:** 2025-07-18

## 1. Summary of the Issue

Excellent debugging has successfully pinpointed the root cause of the 500 error. The application is failing because `i18n.ts` receives `locale` as `undefined`, leading to the error: `Error: Cannot find module './undefined.json'`. 

This reveals a critical contradiction:
*   The `layout.tsx` component **correctly receives the `locale`** (e.g., 'ko') from its `params`. This confirms Next.js file-based routing is working.
*   The `getRequestConfig` function in `i18n.ts` **does not receive the `locale`**. This indicates that the internal context from the `next-intl` middleware is being lost before it reaches the configuration loader.

## 2. Root Cause: Decoupled i18n Configuration

The problem lies in a weak link between the `next-intl` middleware and the `getRequestConfig` function. While the middleware correctly handles the URL, it fails to reliably propagate the resolved `locale` into the configuration context that `getRequestConfig` depends on.

## 3. Solution: Centralized Configuration with `navigation.ts`

The most robust and recommended solution is to adopt `next-intl`'s best practice of centralizing all navigation-related configuration into a single `navigation.ts` file. This creates an explicit and strong link between all parts of the i18n system.

### Step 1: Create `navigation.ts`

Create a new file, `navigation.ts`, in the project root or under `lib/`. This file will be the single source of truth for locales and pathnames.

**File:** `navigation.ts`
```typescript
import {
  createLocalizedPathnamesNavigation,
  Pathnames
} from 'next-intl/navigation';

export const locales = ['ko', 'en'] as const;
export const defaultLocale = 'ko';

// For now, pathnames can be simple. This can be expanded later for translated URLs.
export const pathnames: Pathnames<typeof locales> = {
  '/': '/',
  '/admin/dashboard': '/admin/dashboard'
};

export const { Link, redirect, usePathname, useRouter } = 
  createLocalizedPathnamesNavigation({ locales, pathnames });
```

### Step 2: Update `middleware.ts`

Modify the middleware to import its configuration directly from the new `navigation.ts` file. This ensures it operates on the same definitions as the rest of the app.

**File:** `middleware.ts`
```typescript
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale, pathnames } from './navigation'; // Import from navigation.ts
import { updateSession } from '@/utils/supabase/middleware';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  pathnames,
  localePrefix: 'always' // Explicitly set the prefix strategy
});

export async function middleware(request) {
  const i18nResponse = intlMiddleware(request);
  return await updateSession(i18nResponse); // Chain with Supabase auth
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ]
};
```

### Step 3: Verify `i18n.ts`

No changes should be needed in `i18n.ts`, but with the new structure, it will now correctly receive the `locale` context.

**File:** `i18n.ts`
```typescript
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  // The locale parameter should now be correctly populated.
  return {
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
```

## 4. Why This Works

By using a central `navigation.ts` file, we create a tightly-coupled system where `createMiddleware` and other `next-intl` functions share the exact same configuration. This prevents the context loss that was causing `locale` to be `undefined` in `getRequestConfig`.

## 5. Next Action for Claude Code

1.  **Implement** the `navigation.ts` file as described above.
2.  **Update** the `middleware.ts` file to use the new centralized configuration.
3.  **Test** the application. The `Cannot find module './undefined.json'` error should be resolved, and the dashboard should render correctly with dynamic translations.
