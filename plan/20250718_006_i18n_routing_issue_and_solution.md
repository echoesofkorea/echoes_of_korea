
# Troubleshooting Plan: i18n Routing 404 Error

**Document Status:** Actionable Plan
**Version:** 1.0
**Date:** 2025-07-18

## 1. Summary of the Issue

The project has successfully implemented the initial i18n routing logic using `next-intl` and Supabase authentication middleware. However, it is facing a critical issue:

*   **✅ Successful Redirection:** The middleware correctly processes requests. For example, accessing `/` correctly redirects to `/ko`, which then correctly attempts to load a protected admin route like `/ko/admin/dashboard`.
*   **✅ Successful Compilation:** The Next.js application compiles without errors.
*   **❌ Critical Error:** Despite the successful redirection, the target page (e.g., `/ko/admin/dashboard`) results in a **404 Not Found** error.
*   **❌ Isolation Test Failed:** The error persists even when the page content is replaced with a simple component, indicating the problem lies in the routing structure, not the page itself.

## 2. Root Cause Analysis

The root cause of this 404 error is the **absence of a root layout file within the `app/[locale]` directory**. 

In the Next.js App Router, for a dynamic route segment like `[locale]` to be considered a valid part of the routing tree, it **must** contain a `layout.tsx` or `page.tsx` file. Without `app/[locale]/layout.tsx`, Next.js has no "shell" or entry point to render the routes nested inside that segment (like `/admin/dashboard`).

The middleware is correctly rewriting the URL, but when the Next.js router receives the request for `/ko/admin/dashboard`, it cannot find a valid layout chain starting from `app/ko/`, and therefore concludes that the page does not exist.

## 3. Immediate Solution

The definitive solution is to create the missing root layout file for the localized routes. This file will serve as the entry point for all pages under a given locale.

**Action:** Create the following file:

**File Path:** `app/[locale]/layout.tsx`

**File Content:**
```typescript
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ReactNode } from 'react';

// It's good practice to import global styles or fonts here.
// import { Noto_Sans_KR } from 'next/font/google';
// const noto_sans_kr = Noto_Sans_KR({ subsets: ['latin'], weight: ['400', '700'] });

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: Props) {
  // Using the messages passed from the i18n config
  const messages = await getMessages();

  return (
    <html lang={locale}>
      {/* Example of applying a font class to the body */}
      {/* <body className={noto_sans_kr.className}> */}
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

## 4. Next Steps

1.  **Implement:** Claude Code should immediately create the `app/[locale]/layout.tsx` file with the content provided above.
2.  **Verify:** After creating the file, restart the development server and test the redirection flow again. The 404 error should be resolved, and the dashboard page should now render correctly.
3.  **Proceed:** Once the routing issue is unblocked, development can continue based on the `20250718_005_i18n_revised_plan.md` document.
