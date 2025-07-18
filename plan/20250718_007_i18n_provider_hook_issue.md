
# Troubleshooting Plan: `next-intl` Provider & Hook Integration Issues

**Document Status:** Actionable Plan
**Version:** 1.0
**Date:** 2025-07-18

## 1. Summary of the Issue

The i18n implementation has progressed, but is blocked by a critical issue. While basic routing and hardcoded translations are working, dynamic translation management via the `next-intl` context is failing.

*   **✅ Working:** Locale-based routing (`/ko/...`), middleware redirects, and simple text rendering.
*   **❌ Failing:** The application throws errors when `NextIntlClientProvider` is used to provide messages, and when `getTranslations` or `useTranslations` are called to consume them.

## 2. Root Cause Analysis: The Server/Client Boundary

The problem originates from a misunderstanding of the strict separation between **Server Components** and **Client Components** in the Next.js App Router. The `next-intl` library is designed to work within this paradigm, and its APIs have distinct roles:

*   **`getMessages` & `getTranslations` (Server-Side):**
    *   These are **async functions** designed to be called **only within Server Components**.
    *   They fetch translation data directly on the server before the page is rendered.
    *   They **cannot** be used in files marked with `'use client'`.

*   **`useTranslations` (Client-Side):**
    *   This is a **React hook** designed to be used **only within Client Components** (files marked with `'use client'`).
    *   It accesses the translations passed down from the server via the `NextIntlClientProvider`.
    *   It **cannot** be used in Server Components.

*   **`NextIntlClientProvider` (The Bridge):**
    *   This is a **Client Component** (`'use client'`) that acts as a bridge.
    *   Its purpose is to take the `messages` fetched on the server (in a Server Component like `layout.tsx`) and make them available to all its descendant Client Components.

## 3. Likely Error Scenarios and Solutions

The current errors are almost certainly caused by one of the following configuration mistakes.

### Scenario A: Incorrect `LocaleLayout` Setup (Most Likely)

The `app/[locale]/layout.tsx` file must be a **Server Component** that correctly fetches messages and passes them to the **Client Component** `NextIntlClientProvider`.

**Correct Implementation:**
```typescript
// File: app/[locale]/layout.tsx

import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server'; // Ensure import is from 'next-intl/server'

// This layout component MUST be an async function
export default async function LocaleLayout({ children, params: { locale } }) {
  let messages;
  try {
    // getMessages() is async and MUST be awaited
    messages = await getMessages();
  } catch (error) {
    console.error("Failed to load translation messages:", error);
    // Provide a fallback to prevent a crash
    messages = {}; 
  }

  return (
    <html lang={locale}>
      <body>
        {/* The Provider receives the server-fetched messages as a prop */}
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

### Scenario B: Using a Client Hook in a Server Component
An attempt was made to use `useTranslations` in a component that is not marked with `'use client'`.

**Incorrect:**
```typescript
// File: app/[locale]/admin/dashboard/page.tsx (Server Component by default)
import { useTranslations } from 'next-intl';

export default function Dashboard() {
  const t = useTranslations('Dashboard'); // This will crash
  return <h1>{t('title')}</h1>;
}
```

**Correct:**
```typescript
// To use hooks, the component MUST be a Client Component
'use client';

import { useTranslations } from 'next-intl';

export default function Dashboard() {
  const t = useTranslations('Dashboard');
  return <h1>{t('title')}</h1>;
}
```

## 4. Recommended Diagnostic Steps

Claude Code should perform the following actions to identify and fix the issue:

1.  **Inspect `app/[locale]/layout.tsx`:** Carefully compare the existing file with the **Correct Implementation** provided in Scenario A. Pay close attention to the `async`/`await` keywords and the `messages` prop being passed to the provider.

2.  **Analyze Terminal Error Logs:** Review the error messages in the `npm run dev` terminal. Errors like `React Context is not available in Server Components` or `Error: Attempted to call the hook "useContext" on the server` are definitive proof that a client-side hook was used in a Server Component.

3.  **Audit Component Boundaries:** Systematically check every component that uses `useTranslations`. Ensure that every single one of these files has the `'use client';` directive at the very top.

By following these steps, the exact point of failure in the Server/Client architecture can be located and corrected.
