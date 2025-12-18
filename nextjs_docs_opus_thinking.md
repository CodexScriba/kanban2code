# Next.js 16 Skills Documentation - Opus Thinking Output

> **Generated:** 2025-12-18 | **Version:** Next.js 16.0.10 | **React:** 19

This document synthesizes insights from both Gemini 3.0 Pro and ChatGPT-5-Pro source documents into a single source of truth for AI coding agents working with Next.js 16.

---

## File Manifest

| # | File Path | Purpose |
|---|-----------|---------|
| 1 | `.kanban2code/_context/skills/nextjs-core-skills.md` | Core skills - ALWAYS attach |
| 2 | `.kanban2code/_context/skills/skill-caching-data-fetching.md` | Caching & PPR patterns |
| 3 | `.kanban2code/_context/skills/skill-server-actions-mutations.md` | Forms & mutations |
| 4 | `.kanban2code/_context/skills/skill-routing-layouts.md` | Routing & layouts |
| 5 | `.kanban2code/_context/skills/skill-metadata-seo.md` | SEO & metadata |
| 6 | `.kanban2code/_context/skills/skill-typescript-config.md` | TypeScript & config |
| 7 | `.kanban2code/_context/skills-index.json` | Trigger-based index |

---

---FILE: .kanban2code/_context/skills/nextjs-core-skills.md---
# Next.js 16 Core Skills

> **Target:** Next.js 16.0.10 | **React:** 19 | **Last Verified:** 2025-12-18

## 1. What AI Models Get Wrong

- **Synchronous params access** → LLMs generate `Page({ params }: { params: { slug: string } })` because training data from v14 used sync access. In v16, params is a Promise.
- **Using `middleware.ts`** → LLMs create middleware.ts because it existed in v14/15. In v16, it's deprecated in favor of `proxy.ts`.
- **Assuming fetch is cached** → LLMs expect fetch to cache by default (v14 behavior). In v16, all fetches are uncached by default.
- **Using `useFormState`** → LLMs import from 'react-dom' using React 18 patterns. React 19 renames this to `useActionState`.
- **Omitting `default.js` in parallel routes** → LLMs forget this file, causing build failures in v16 which strictly requires it for all @slots.

## 2. Golden Rules

### ✅ DO
- **Await all dynamic APIs** → `params`, `searchParams`, `cookies()`, `headers()` are Promises in v16
- **Use `proxy.ts` for request interception** → Replaces middleware.ts, runs on Node.js by default
- **Keep components Server by default** → Only add `'use client'` for interactivity (state, events, browser APIs)
- **Create `default.js` for every parallel route slot** → Required fallback for soft navigation
- **Use `useActionState` from 'react'** → React 19's replacement for useFormState

### ❌ DON'T  
- **Don't access params synchronously** → Causes runtime crash: "params is a Promise"
- **Don't use `middleware.ts`** → Deprecated, use proxy.ts instead
- **Don't use `useFormState` from 'react-dom'** → Renamed to useActionState in React 19
- **Don't assume fetch caches** → v16 is uncached by default, opt-in with `'use cache'`
- **Don't use `getServerSideProps`/`getStaticProps`** → Don't exist in App Router

## 3. Critical Patterns

### Async Params in Page Components

**❌ WRONG (v14/v15 - Hallucination Risk):**
```typescript
// Sync access causes runtime crash in v16
export default function Page({ params }: { params: { slug: string } }) {
  return <h1>{params.slug}</h1>; // Error: params is a Promise
}
```

**✅ CORRECT (v16):**
```typescript
// Await the Promise props
interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page(props: Props) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  return <h1>{params.slug}</h1>;
}
```
**Why:** v16's Partial Prerendering requires async access to support streaming dynamic content.

---

### Async Cookies and Headers

**❌ WRONG (v14/v15 - Hallucination Risk):**
```typescript
// Sync access returns Promise object, not data
import { cookies, headers } from 'next/headers';

export default function Page() {
  const cookieStore = cookies(); // Wrong: returns Promise
  const token = cookieStore.get('token'); // undefined
}
```

**✅ CORRECT (v16):**
```typescript
import { cookies, headers } from 'next/headers';

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token');
  
  const headerList = await headers();
  const userAgent = headerList.get('user-agent');
}
```
**Why:** Request APIs are async to support Edge runtime and streaming.

---

### Proxy.ts Instead of Middleware

**❌ WRONG (v14/v15 - Hallucination Risk):**
```typescript
// middleware.ts - DEPRECATED
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  return NextResponse.next();
}
```

**✅ CORRECT (v16):**
```typescript
// proxy.ts - at project root or src/
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const url = request.nextUrl;
  
  if (url.pathname === '/old') {
    url.pathname = '/new';
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```
**Why:** Renamed for clarity—it's a proxy/interception layer, not middleware chain. Runs on Node.js by default.

---

### React 19 Form Pattern

**❌ WRONG (v14/React 18 - Hallucination Risk):**
```typescript
'use client';
import { useFormState } from 'react-dom'; // Wrong import

export function Form() {
  const [state, action] = useFormState(submitAction, null);
}
```

**✅ CORRECT (v16/React 19):**
```typescript
'use client';
import { useActionState } from 'react'; // Correct import

export function Form() {
  const [state, formAction, isPending] = useActionState(submitAction, null);
  
  return (
    <form action={formAction}>
      <input name="email" />
      <button disabled={isPending}>Submit</button>
      {state?.error && <p>{state.error}</p>}
    </form>
  );
}
```
**Why:** React 19 renamed useFormState to useActionState and added isPending.

---

### Parallel Routes Default.js

**❌ WRONG (v14/v15 - Hallucination Risk):**
```
app/
├── @modal/
│   └── login/
│       └── page.tsx
└── layout.tsx
// Missing default.tsx causes 404 on soft navigation!
```

**✅ CORRECT (v16):**
```
app/
├── @modal/
│   ├── default.tsx  ← REQUIRED
│   └── login/
│       └── page.tsx
└── layout.tsx
```

```typescript
// app/@modal/default.tsx
export default function Default() {
  return null; // Render nothing when no modal active
}
```
**Why:** v16 strictly requires default.js as fallback when slot has no matching route during soft navigation.

## 4. Quick Reference Table

| Feature | ❌ Don't | ✅ Do |
|---------|---------|------|
| Params | `{ params: { id: string } }` | `{ params: Promise<{ id: string }> }` |
| Cookies | `const c = cookies()` | `const c = await cookies()` |
| Headers | `const h = headers()` | `const h = await headers()` |
| Middleware | `middleware.ts` | `proxy.ts` |
| Form State | `useFormState` from 'react-dom' | `useActionState` from 'react' |
| Caching | Assume cached by default | Use `'use cache'` explicitly |
| Parallel Routes | Skip default.js | Create default.js for every @slot |
| Config | `next.config.js` | `next.config.ts` (typed) |

## 5. Checklist Before Coding

- [ ] Verify Next.js version is 16.x and React 19 in package.json
- [ ] All `params` and `searchParams` props typed as `Promise<...>` and awaited
- [ ] All `cookies()` and `headers()` calls have `await`
- [ ] Using `proxy.ts` not `middleware.ts` for request interception
- [ ] Every parallel route @slot has a `default.tsx` file
- [ ] Using `useActionState` not `useFormState` for forms
---END FILE---

---FILE: .kanban2code/_context/skills/skill-caching-data-fetching.md---
# Caching & Data Fetching

> **Target:** Next.js 16.0.10 | **React:** 19 | **Last Verified:** 2025-12-18

## 1. What AI Models Get Wrong

- **Assuming fetch caches by default** → LLMs expect v14 behavior where fetch was cached. In v16, fetch is uncached by default.
- **Using `unstable_cache`** → LLMs suggest this deprecated API. In v16, use `'use cache'` directive instead.
- **Using `revalidate: 60` in fetch options** → LLMs still use this pattern. v16 prefers `'use cache'` with `cacheLife` profiles.
- **Expecting Route Handler GET to be static** → LLMs assume GET routes cache. In v16, they're dynamic by default.
- **Trying to cache in proxy.ts** → LLMs attempt fetch caching in proxy. This is explicitly not supported.

## 2. Golden Rules

### ✅ DO
- **Use `'use cache'` directive** → Opt-in caching for functions or files
- **Use `cacheLife` profiles** → Semantic durations: `seconds`, `minutes`, `hours`, `days`, `weeks`, `max`
- **Use `cacheTag` for invalidation** → Tag cached data for targeted revalidation
- **Wrap dynamic content in `<Suspense>`** → Enables PPR static shell + streaming
- **Call `revalidateTag` after mutations** → Purge cache in Server Actions

### ❌ DON'T  
- **Don't assume fetch is cached** → v16 defaults to uncached
- **Don't use `unstable_cache`** → Deprecated, replaced by `'use cache'`
- **Don't cache in proxy.ts** → Explicitly unsupported, all fetches run every request
- **Don't use `getStaticProps` patterns** → Not available in App Router
- **Don't forget UI refresh after mutations** → Use `router.refresh()` or revalidation

## 3. Critical Patterns

### Use Cache Directive

**❌ WRONG (v14/v15 - Hallucination Risk):**
```typescript
// Assuming fetch caches automatically
export async function getProduct(id: string) {
  const res = await fetch(`https://api.example.com/products/${id}`); // Not cached in v16!
  return res.json();
}

// Or using deprecated unstable_cache
import { unstable_cache } from 'next/cache';
const getData = unstable_cache(async () => {
  return { ok: true };
}); // Deprecated
```

**✅ CORRECT (v16):**
```typescript
import { cacheLife } from 'next/cache';

export async function getProduct(id: string) {
  'use cache'; // Directive enables caching
  cacheLife('hours'); // Use semantic profile
  
  const res = await fetch(`https://api.example.com/products/${id}`);
  return res.json();
}
```
**Why:** v16 inverts caching—uncached by default, explicit opt-in required.

---

### CacheLife Profiles

**❌ WRONG (v14/v15 - Hallucination Risk):**
```typescript
// Using arbitrary seconds in fetch options
const res = await fetch(url, { 
  next: { revalidate: 3600 } // Old pattern
});
```

**✅ CORRECT (v16):**
```typescript
import { cacheLife } from 'next/cache';

export async function getMarketingData() {
  'use cache';
  cacheLife('hours'); // Built-in: seconds, minutes, hours, days, weeks, max
  
  return fetch('https://api.example.com/marketing').then(r => r.json());
}

// Custom profiles in next.config.ts
const nextConfig: NextConfig = {
  cacheLife: {
    'marketing-pages': {
      stale: 3600,      // Serve stale up to 1 hour
      revalidate: 900,  // Check for updates every 15 mins
      expire: 86400,    // Hard expire after 1 day
    },
  },
};
```
**Why:** Semantic profiles are clearer and integrate with Next's SWR system.

---

### Tag-Based Invalidation

**❌ WRONG (v14/v15 - Hallucination Risk):**
```typescript
// Not tagging data for invalidation
async function getPosts() {
  return fetch('https://api.example.com/posts'); // No way to selectively invalidate
}
```

**✅ CORRECT (v16):**
```typescript
import { cacheTag, revalidateTag } from 'next/cache';

// Tag the cached data
async function getPosts() {
  'use cache';
  cacheTag('posts'); // Tag for invalidation
  return db.posts.findMany();
}

// Invalidate in Server Action
'use server';
export async function createPost(data: FormData) {
  await db.posts.create({
    title: String(data.get('title') ?? ''),
    body: String(data.get('body') ?? ''),
  });
  revalidateTag('posts'); // Purge cache
}
```
**Why:** Tags enable surgical cache invalidation without full revalidation.

---

### Partial Prerendering (PPR)

**❌ WRONG (v14/v15 - Hallucination Risk):**
```typescript
// No Suspense boundary - entire page becomes dynamic
export default async function Page() {
  const user = await getCurrentUser(); // Dynamic - cookies
  const products = await getProducts(); // Could be static
  
  return (
    <div>
      <UserGreeting user={user} />
      <ProductList products={products} />
    </div>
  ); // Entire page is dynamic
}
```

**✅ CORRECT (v16):**
```typescript
import { Suspense } from 'react';

export default function Page() {
  return (
    <main>
      <h1>Static Title (Instant Load)</h1>
      <ProductList /> {/* Can be cached */}
      
      <Suspense fallback={<p>Loading user...</p>}>
        <UserProfile /> {/* Dynamic - streams in */}
      </Suspense>
    </main>
  );
}
```
**Why:** PPR sends static shell immediately, streams dynamic "holes" via Suspense.

---

### Route Handler Caching

**❌ WRONG (v14/v15 - Hallucination Risk):**
```typescript
// Assuming GET is cached/static
export async function GET() {
  const data = await db.query('SELECT * FROM items');
  return Response.json(data); // Dynamic in v16!
}
```

**✅ CORRECT (v16):**
```typescript
// Explicitly set caching behavior
export const dynamic = 'force-static'; // Or use 'use cache'

export async function GET() {
  'use cache';
  cacheLife('minutes');
  
  const data = await db.query('SELECT * FROM items');
  return Response.json(data);
}
```
**Why:** GET routes are uncached by default in v16. Explicit opt-in required.

## 4. Quick Reference Table

| Feature | ❌ Don't | ✅ Do |
|---------|---------|------|
| Cache Data | Assume cached | Use `'use cache'` directive |
| Revalidation | `revalidate: 60` in fetch | `cacheLife('minutes')` |
| Old Cache API | `unstable_cache()` | `'use cache'` directive |
| Invalidation | `revalidatePath` only | `cacheTag()` + `revalidateTag()` |
| GET Routes | Assume static | Set `dynamic = 'force-static'` |
| Dynamic Data | No Suspense | Wrap in `<Suspense>` for PPR |
| Proxy.ts | Attempt caching | Move caching logic to pages |

## 5. Checklist Before Coding

- [ ] Enable `cacheComponents: true` in next.config.ts (default in 16.0.10)
- [ ] Add `'use cache'` directive to functions that should be cached
- [ ] Use semantic `cacheLife` profiles instead of raw seconds
- [ ] Tag cached data with `cacheTag()` for selective invalidation
- [ ] Call `revalidateTag()` in Server Actions after mutations
- [ ] Wrap dynamic components in `<Suspense>` for PPR benefits
---END FILE---

---FILE: .kanban2code/_context/skills/skill-server-actions-mutations.md---
# Server Actions & Mutations

> **Target:** Next.js 16.0.10 | **React:** 19 | **Last Verified:** 2025-12-18

## 1. What AI Models Get Wrong

- **Using `useFormState` from 'react-dom'** → LLMs use React 18 import. React 19 renames to `useActionState` from 'react'.
- **Skipping Zod validation** → LLMs trust FormData directly. Server Actions are public endpoints—validation is mandatory.
- **Placing `redirect()` inside try/catch** → LLMs catch the redirect error. redirect() throws intentionally and must not be caught.
- **Defining actions in 'use client' files** → LLMs put 'use server' inside client components. Actions must be in server files.
- **Using hidden inputs for IDs** → LLMs use `<input type="hidden">` for passing IDs. Use `.bind()` for secure argument passing.

## 2. Golden Rules

### ✅ DO
- **Validate ALL input with Zod** → Server Actions are public HTTP endpoints
- **Use `useActionState` from 'react'** → React 19's renamed hook with isPending
- **Use `.bind()` for secure argument passing** → Prevents client tampering
- **Place `redirect()` outside try/catch** → It throws to trigger navigation
- **Call `revalidateTag()` after mutations** → Update cached data

### ❌ DON'T  
- **Don't trust FormData** → Always validate server-side
- **Don't use `useFormState`** → Renamed to useActionState in React 19
- **Don't catch redirect/notFound errors** → They throw intentionally
- **Don't define 'use server' in 'use client' files** → Invalid, actions must be separate
- **Don't use hidden inputs for sensitive IDs** → Use .bind() instead

## 3. Critical Patterns

### Secure Server Action with Zod

**❌ WRONG (v14/v15 - Hallucination Risk):**
```typescript
'use server';

export async function createUser(formData: FormData) {
  // Trusting raw FormData - SECURITY RISK
  const email = formData.get('email') as string;
  const role = formData.get('role') as string;
  
  await db.user.create({ email, role }); // No validation!
}
```

**✅ CORRECT (v16):**
```typescript
'use server';

import { z } from 'zod';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

const schema = z.object({
  email: z.string().email(),
  role: z.enum(['user', 'admin']),
});

type CreateUserState =
  | {
      error: string;
      issues?: Record<string, string[]>;
    }
  | null;

export async function createUser(_prevState: CreateUserState, formData: FormData): Promise<CreateUserState> {
  // 1. Authentication
  const session = await auth();
  if (!session?.user) {
    return { error: 'Unauthorized' };
  }

  // 2. Validation (MANDATORY)
  const parsed = schema.safeParse({
    email: formData.get('email'),
    role: formData.get('role'),
  });

  if (!parsed.success) {
    return { error: 'Invalid input', issues: parsed.error.flatten().fieldErrors };
  }

  // 3. Mutation
  try {
    await db.user.create({ data: parsed.data });
  } catch (e) {
    return { error: 'Database error' };
  }

  // 4. Redirect (OUTSIDE try/catch)
  redirect('/users');
}
```
**Why:** Server Actions are public endpoints. Zod validation is non-negotiable security.

---

### useActionState (React 19)

**❌ WRONG (v14/React 18 - Hallucination Risk):**
```typescript
'use client';
import { useFormState } from 'react-dom'; // WRONG import

export function UserForm() {
  const [state, action] = useFormState(createUser, null); // Missing isPending
  
  return <form action={action}>...</form>;
}
```

**✅ CORRECT (v16/React 19):**
```typescript
'use client';
import { useActionState } from 'react'; // Correct import
import { createUser } from './actions';

export function UserForm() {
  // React 19: [state, dispatch, isPending]
  const [state, formAction, isPending] = useActionState(createUser, null);

  return (
    <form action={formAction}>
      <input name="email" type="email" required />
      
      {state?.issues?.email && (
        <span className="error">{state.issues.email}</span>
      )}
      
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create User'}
      </button>
      
      {state?.error && <div className="error">{state.error}</div>}
    </form>
  );
}
```
**Why:** React 19 renamed useFormState to useActionState and added isPending as third return value.

---

### Secure Argument Binding

**❌ WRONG (v14/v15 - Hallucination Risk):**
```typescript
// Hidden inputs can be tampered with in DevTools
export function DeleteButton({ userId }: { userId: string }) {
  return (
    <form action={deleteUser}>
      <input type="hidden" name="userId" value={userId} /> {/* Tamperable! */}
      <button>Delete</button>
    </form>
  );
}
```

**✅ CORRECT (v16):**
```typescript
// Server Component - .bind() is secure
export function DeleteButton({ userId }: { userId: string }) {
  const deleteUserWithId = deleteUser.bind(null, userId);
  
  return (
    <form action={deleteUserWithId}>
      <button>Delete</button>
    </form>
  );
}

// actions.ts
'use server';
export async function deleteUser(userId: string, formData: FormData) {
  // userId is bound server-side, client cannot tamper
  await db.user.delete({ where: { id: userId } });
  revalidateTag('users');
}
```
**Why:** .bind() serializes arguments in the React Server Components closure, not in client HTML.

---

### Redirect Outside Try/Catch

**❌ WRONG (v14/v15 - Hallucination Risk):**
```typescript
'use server';

export async function submitForm(formData: FormData) {
  try {
    await db.insert(formData);
    redirect('/success'); // CAUGHT by catch block!
  } catch (e) {
    return { error: 'Failed' }; // Redirect never happens
  }
}
```

**✅ CORRECT (v16):**
```typescript
'use server';
import { redirect } from 'next/navigation';

export async function submitForm(formData: FormData) {
  let success = false;
  
  try {
    await db.insert(formData);
    success = true;
  } catch (e) {
    return { error: 'Database error' };
  }

  // Redirect OUTSIDE try/catch
  if (success) {
    redirect('/success');
  }
}
```
**Why:** redirect() throws a NEXT_REDIRECT error to trigger navigation. Catching it prevents the redirect.

---

### useFormStatus for Submit Buttons

**❌ WRONG (v14/v15 - Hallucination Risk):**
```typescript
// Prop drilling isPending to button
export function Form({ isPending }: { isPending: boolean }) {
  return (
    <form>
      <SubmitButton disabled={isPending} />
    </form>
  );
}
```

**✅ CORRECT (v16/React 19):**
```typescript
'use client';
import { useFormStatus } from 'react-dom';

export function SubmitButton() {
  const { pending, data, method, action } = useFormStatus();
  
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}

// Usage - no prop drilling needed
export function Form() {
  return (
    <form action={submitAction}>
      <input name="email" />
      <SubmitButton /> {/* Reads pending from parent form */}
    </form>
  );
}
```
**Why:** useFormStatus reads status from the nearest parent form without prop drilling.

## 4. Quick Reference Table

| Feature | ❌ Don't | ✅ Do |
|---------|---------|------|
| Form Hook | `useFormState` from 'react-dom' | `useActionState` from 'react' |
| Validation | Trust raw FormData | Validate with Zod (mandatory) |
| Pass IDs | `<input type="hidden">` | `.bind(null, id)` |
| Redirect | Inside try/catch | Outside try/catch block |
| Action Files | 'use server' in 'use client' file | Separate actions.ts file |
| Button State | Prop drilling isPending | `useFormStatus` hook |
| After Mutation | Forget cache | `revalidateTag()` or `router.refresh()` |

## 5. Checklist Before Coding

- [ ] Server Action file has `'use server'` at top (not inside 'use client' file)
- [ ] All input validated with Zod before any database operations
- [ ] Using `useActionState` from 'react' (not useFormState from 'react-dom')
- [ ] `redirect()` and `notFound()` calls are outside try/catch blocks
- [ ] Using `.bind()` for passing IDs instead of hidden inputs
- [ ] Calling `revalidateTag()` or `router.refresh()` after mutations
---END FILE---

---FILE: .kanban2code/_context/skills/skill-routing-layouts.md---
# Routing & Layouts

> **Target:** Next.js 16.0.10 | **React:** 19 | **Last Verified:** 2025-12-18

## 1. What AI Models Get Wrong

- **Omitting `default.js` in parallel routes** → LLMs forget this file. v16 build fails without it for every @slot.
- **Using sync params in layouts** → LLMs access params directly. In v16, layout params are Promises too.
- **Confusing intercepting route syntax** → LLMs mix up `(.)` vs `(..)` vs `(...)` conventions.
- **Using Pages Router patterns** → LLMs suggest `_app.js`, `_document.js`, `next/router` in App Router context.
- **Creating page.tsx AND route.ts in same folder** → LLMs don't realize this causes conflicts.

## 2. Golden Rules

### ✅ DO
- **Create `default.js` for every parallel route @slot** → Required fallback for soft navigation
- **Await params in layouts** → Layouts receive `Promise<{ slug: string }>` too
- **Use `(.)` for same-level intercept, `(..)` for parent** → Precise routing semantics
- **Use `loading.js` for Suspense boundaries** → Automatic loading UI per segment
- **error.js must be 'use client'** → Error boundaries are client components

### ❌ DON'T  
- **Don't skip default.js** → Causes 404 or build failure in v16
- **Don't access layout params synchronously** → They're Promises
- **Don't use `_app.js`, `_document.js`** → App Router uses layout.tsx
- **Don't use `next/router`** → Use `next/navigation` in App Router
- **Don't have page.tsx and route.ts together** → Same segment conflict

## 3. Critical Patterns

### Parallel Routes with Default.js

**❌ WRONG (v14/v15 - Hallucination Risk):**
```
app/
├── @modal/
│   └── photo/
│       └── [id]/
│           └── page.tsx
├── layout.tsx
└── page.tsx
// Missing default.tsx = BUILD FAILURE in v16
```

**✅ CORRECT (v16):**
```
app/
├── @modal/
│   ├── default.tsx      ← REQUIRED
│   └── photo/
│       └── [id]/
│           └── page.tsx
├── layout.tsx
└── page.tsx
```

```typescript
// app/@modal/default.tsx
export default function Default() {
  return null; // Render nothing when no modal matches
}

// app/layout.tsx
export default function Layout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html>
      <body>
        {children}
        {modal}
      </body>
    </html>
  );
}
```
**Why:** When navigating away from /photo/123, Next needs default.tsx to know what to render in @modal slot.

---

### Async Params in Layouts

**❌ WRONG (v14/v15 - Hallucination Risk):**
```typescript
// Sync access in layout - CRASHES
export default function BlogLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string }; // Wrong type
}) {
  return (
    <div>
      <h1>Blog: {params.slug}</h1> {/* Error: params is Promise */}
      {children}
    </div>
  );
}
```

**✅ CORRECT (v16):**
```typescript
export default async function BlogLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>; // Promise type
}) {
  const { slug } = await params; // Await required
  
  return (
    <div className="blog-layout">
      <aside>Current Post: {slug}</aside>
      {children}
    </div>
  );
}
```
**Why:** All params are Promises in v16 to support PPR streaming.

---

### Intercepting Routes Syntax

**❌ WRONG (v14/v15 - Hallucination Risk):**
```
app/
├── feed/
│   └── (..)photo/      ← Wrong: should match route structure
│       └── [id]/
│           └── page.tsx
└── photo/
    └── [id]/
        └── page.tsx
```

**✅ CORRECT (v16):**
```
app/
├── @modal/
│   └── (.)photo/       ← (.) = same level intercept
│       └── [id]/
│           └── page.tsx
├── feed/
│   └── (..)photo/      ← (..) = one level up intercept  
│       └── [id]/
│           └── page.tsx
├── photo/
│   └── [id]/
│       └── page.tsx    ← Full page (hard navigation)
└── layout.tsx
```

**Syntax Reference:**
- `(.)` - Intercept from same level
- `(..)` - Intercept from one level up
- `(..)(..)` - Two levels up
- `(...)` - Intercept from app root

**Why:** Soft navigation shows intercepted modal; hard refresh shows full page.

---

### Loading.js and Error.js

**❌ WRONG (v14/v15 - Hallucination Risk):**
```typescript
// Manual loading state in page
'use client';
export default function Page() {
  const [loading, setLoading] = useState(true);
  // ... manual spinner logic
}

// error.js as Server Component
export default function Error({ error }) { // Missing 'use client'
  return <div>Error: {error.message}</div>;
}
```

**✅ CORRECT (v16):**
```typescript
// app/dashboard/loading.tsx - Automatic Suspense
export default function Loading() {
  return <div className="skeleton">Loading dashboard...</div>;
}

// app/dashboard/error.tsx - MUST be 'use client'
'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```
**Why:** loading.js auto-wraps in Suspense. error.js must be client for reset() interactivity.

---

### Default.js with Async Params

**❌ WRONG (v14/v15 - Hallucination Risk):**
```typescript
// Sync params in default.js
export default function Default({ params }: { params: { id: string } }) {
  return <div>Fallback for {params.id}</div>; // Crashes
}
```

**✅ CORRECT (v16):**
```typescript
// app/@sidebar/default.tsx
export default async function Default({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  return <div>Default sidebar for {id}</div>;
}
```
**Why:** default.js follows the same async params contract as page.tsx.

## 4. Quick Reference Table

| Feature | ❌ Don't | ✅ Do |
|---------|---------|------|
| Parallel Routes | Skip default.js | Create default.js for every @slot |
| Layout Params | `params: { slug: string }` | `params: Promise<{ slug: string }>` |
| Same-level Intercept | Random folder | `(.)folder` syntax |
| Parent-level Intercept | `(.)folder` | `(..)folder` syntax |
| Error Boundary | Server Component | `'use client'` directive |
| Loading UI | Manual useState | `loading.js` file |
| Global Layout | `_app.js` | `app/layout.tsx` |
| Navigation | `next/router` | `next/navigation` |

## 5. Checklist Before Coding

- [ ] Every parallel route @slot has a `default.tsx` file
- [ ] Layout components are `async` and `await` their params
- [ ] Using correct intercept syntax: `(.)` same, `(..)` parent, `(...)` root
- [ ] `error.js` files have `'use client'` at top
- [ ] No `_app.js`, `_document.js`, or `next/router` usage
- [ ] No page.tsx and route.ts in the same folder
---END FILE---

---FILE: .kanban2code/_context/skills/skill-metadata-seo.md---
# Metadata & SEO

> **Target:** Next.js 16.0.10 | **React:** 19 | **Last Verified:** 2025-12-18

## 1. What AI Models Get Wrong

- **Using sync params in generateMetadata** → LLMs use `{ params: { id: string } }`. In v16, params is a Promise.
- **Using `next/head` in App Router** → LLMs suggest the old Head component. App Router uses metadata exports.
- **Sync params in ImageResponse** → LLMs forget opengraph-image.tsx also receives async params.
- **Using sitemap.xml file** → LLMs create static XML. v16 prefers sitemap.ts with dynamic generation.
- **Missing parent metadata extension** → LLMs don't await parent to extend existing metadata.

## 2. Golden Rules

### ✅ DO
- **Await params in generateMetadata** → First argument is `{ params: Promise<...> }`
- **Use `export const metadata` or `generateMetadata`** → App Router's metadata API
- **Await params in opengraph-image.tsx** → Image routes also receive async params
- **Use sitemap.ts for dynamic sitemaps** → Return `MetadataRoute.Sitemap` array
- **Await `parent` for extending metadata** → Access parent's openGraph images, etc.

### ❌ DON'T  
- **Don't use `next/head`** → Not available in App Router
- **Don't access params synchronously** → They're Promises in generateMetadata
- **Don't create static sitemap.xml** → Use sitemap.ts for dynamic generation
- **Don't forget robots.ts** → Controls crawler behavior
- **Don't use local IPs in remotePatterns** → Blocked by default for SSRF prevention

## 3. Critical Patterns

### Async generateMetadata

**❌ WRONG (v14/v15 - Hallucination Risk):**
```typescript
import type { Metadata } from 'next';

// Sync params - CRASHES in v16
export async function generateMetadata({ 
  params 
}: { 
  params: { id: string } // Wrong type
}): Promise<Metadata> {
  const product = await fetch(`https://api.example.com/products/${params.id}`); // Error
  return { title: product.name };
}
```

**✅ CORRECT (v16):**
```typescript
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // 1. Await the params
  const { id } = await params;
  
  // 2. Fetch data
  const product = await fetch(`https://api.example.com/products/${id}`)
    .then((res) => res.json());

  // 3. Extend parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      images: [product.image, ...previousImages],
    },
  };
}
```
**Why:** v16's async params support PPR and streaming for metadata generation.

---

### OpenGraph Image with Async Params

**❌ WRONG (v14/v15 - Hallucination Risk):**
```typescript
// app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og';

// Sync params - CRASHES
export default function Image({ params }: { params: { slug: string } }) {
  return new ImageResponse(
    <div>Post: {params.slug}</div>, // Error
    { width: 1200, height: 600 }
  );
}
```

**✅ CORRECT (v16):**
```typescript
// app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Blog post image';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  
  // Optionally fetch post data
  const post = await fetch(`https://api.example.com/posts/${slug}`)
    .then(r => r.json());
  
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'linear-gradient(to bottom, #1a1a2e, #16213e)',
          color: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {post.title}
      </div>
    ),
    { ...size }
  );
}
```
**Why:** Image routes follow the same async params pattern as pages.

---

### Dynamic Sitemap

**❌ WRONG (v14/v15 - Hallucination Risk):**
```xml
<!-- public/sitemap.xml - Static, outdated -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
  </url>
</urlset>
```

**✅ CORRECT (v16):**
```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await fetch('https://api.example.com/posts')
    .then(r => r.json());

  const postUrls = posts.map((post: { slug: string; updatedAt: string }) => ({
    url: `https://example.com/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: 'https://example.com',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://example.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...postUrls,
  ];
}
```
**Why:** sitemap.ts generates dynamic XML at request time with fresh data.

---

### Robots.ts

**❌ WRONG (v14/v15 - Hallucination Risk):**
```
# public/robots.txt - Static file
User-agent: *
Disallow: /admin
```

**✅ CORRECT (v16):**
```typescript
// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/private/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
```
**Why:** robots.ts allows dynamic rules and environment-based URLs.

---

### Image Remote Patterns Security

**❌ WRONG (v14/v15 - Hallucination Risk):**
```typescript
// next.config.ts
const config = {
  images: {
    remotePatterns: [
      { hostname: 'localhost' }, // Blocked for SSRF prevention
      { hostname: '127.0.0.1' }, // Blocked
    ],
  },
};
```

**✅ CORRECT (v16):**
```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.example.com',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: '*.cloudinary.com',
      },
    ],
    // Only for development - NOT production
    // dangerouslyAllowLocalIP: true,
  },
};

export default nextConfig;
```
**Why:** v16 blocks loopback IPs by default to prevent SSRF attacks.

## 4. Quick Reference Table

| Feature | ❌ Don't | ✅ Do |
|---------|---------|------|
| Head Tags | `import Head from 'next/head'` | `export const metadata` or `generateMetadata` |
| Metadata Params | `params: { id: string }` | `params: Promise<{ id: string }>` |
| OG Image Params | Sync access | `await params` in async function |
| Sitemap | Static `sitemap.xml` | Dynamic `sitemap.ts` |
| Robots | Static `robots.txt` | Dynamic `robots.ts` |
| Local Images | `localhost` in remotePatterns | Only production domains |
| Parent Metadata | Ignore parent | `await parent` to extend |

## 5. Checklist Before Coding

- [ ] `generateMetadata` function awaits its `params` argument
- [ ] `opengraph-image.tsx` is async and awaits params  
- [ ] Using `export const metadata` or `generateMetadata` (not next/head)
- [ ] `sitemap.ts` returns `MetadataRoute.Sitemap` array
- [ ] `robots.ts` returns `MetadataRoute.Robots` object
- [ ] Image `remotePatterns` only includes production domains (no localhost)
---END FILE---

---FILE: .kanban2code/_context/skills/skill-typescript-config.md---
# TypeScript & Config

> **Target:** Next.js 16.0.10 | **React:** 19 | **Last Verified:** 2025-12-18

## 1. What AI Models Get Wrong

- **Using `next.config.js`** → LLMs use JavaScript config. v16 officially supports `next.config.ts` with type safety.
- **Using `experimental.serverActions`** → LLMs enable this flag. Server Actions are stable in v16, no flag needed.
- **Using `experimental.ppr`** → LLMs suggest this flag. In v16, use `cacheComponents: true` instead.
- **Wrong Promise types for props** → LLMs type params as objects. In v16, they must be `Promise<...>`.
- **Importing server-only in 'use client'** → LLMs import database modules in client files. This causes build failure.

## 2. Golden Rules

### ✅ DO
- **Use `next.config.ts`** → Typed configuration with autocomplete
- **Type params as Promises** → `params: Promise<{ slug: string }>`
- **Upgrade @types/react to v19** → Fixes async component type errors
- **Use `server-only` package** → Prevents accidental client imports
- **Set `cacheComponents: true`** → Enables 'use cache' and PPR

### ❌ DON'T  
- **Don't use `experimental.serverActions`** → Stable in v16, no flag needed
- **Don't use `experimental.ppr`** → Use `cacheComponents` instead
- **Don't import server code in 'use client' files** → Build failure
- **Don't use old @types/react** → Causes async component errors
- **Don't use `publicRuntimeConfig`** → Removed, use env variables

## 3. Critical Patterns

### Typed next.config.ts

**❌ WRONG (v14/v15 - Hallucination Risk):**
```javascript
// next.config.js - No type safety
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true, // Not needed in v16!
    ppr: true, // Wrong flag
  },
};

module.exports = nextConfig;
```

**✅ CORRECT (v16):**
```typescript
// next.config.ts - Typed configuration
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // v16 Caching - replaces experimental.ppr
  cacheComponents: true,
  
  // Logging for debugging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  
  // Optional: typed routes
  experimental: {
    typedRoutes: true,
  },
  
  // Custom cache profiles
  cacheLife: {
    'blog-posts': {
      stale: 3600,
      revalidate: 900,
      expire: 86400,
    },
  },
};

export default nextConfig;
```
**Why:** TypeScript config provides autocomplete and catches invalid options at compile time.

---

### Promise Props Type Errors

**❌ WRONG (v14/v15 - Hallucination Risk):**
```typescript
// Error: Property 'slug' does not exist on type 'Promise<...>'
interface Props {
  params: { slug: string }; // Wrong type
}

export default function Page({ params }: Props) {
  return <h1>{params.slug}</h1>; // Type error AND runtime error
}
```

**✅ CORRECT (v16):**
```typescript
// Correct Promise types
interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params;
  const query = await searchParams;
  
  return <h1>{slug}</h1>;
}

// For layouts
interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function Layout({ children, params }: LayoutProps) {
  const { slug } = await params;
  return <div data-slug={slug}>{children}</div>;
}
```
**Why:** v16 types params as Promises to support PPR streaming architecture.

---

### Async Component Type Errors

**❌ WRONG (v14/React 18 types - Hallucination Risk):**
```typescript
// Error: 'Page' cannot be used as a JSX component
// This happens with old @types/react
export default async function Page() {
  const data = await fetch('https://api.example.com/data').then(r => r.json());
  return <div>{data.title}</div>;
}
```

**✅ CORRECT (v16/React 19 types):**
```json
// package.json - Ensure React 19 types
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next": "^16.0.10"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.0.0"
  }
}
```

```typescript
// Now async components work without errors
export default async function Page() {
  const data = await fetch('https://api.example.com/data').then(r => r.json());
  return <div>{data.title}</div>;
}
```
**Why:** React 19 types support async components natively; old v18 types don't.

---

### Server-Only Module Protection

**❌ WRONG (v14/v15 - Hallucination Risk):**
```typescript
// lib/db.ts - Can accidentally be imported in client
import { prisma } from './prisma';

export async function getUsers() {
  return prisma.user.findMany();
}

// components/UserList.tsx
'use client';
import { getUsers } from '../lib/db'; // BUILD FAILURE
```

**✅ CORRECT (v16):**
```typescript
// lib/db.ts - Protected with server-only
import 'server-only'; // Import at top of file
import { prisma } from './prisma';

export async function getUsers() {
  return prisma.user.findMany();
}

// components/UserList.tsx
'use client';
// Cannot import from db.ts - build error with clear message:
// "You're importing a component that needs server-only"

// Instead, pass data as props from Server Component
export function UserList({ users }: { users: User[] }) {
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
```
**Why:** `server-only` package prevents accidental imports in client bundles.

---

### Module Resolution Issues

**❌ WRONG (v14/v15 - Hallucination Risk):**
```typescript
// tsconfig.json with loose settings
{
  "compilerOptions": {
    "moduleResolution": "node", // May cause issues
    "paths": {
      "@/*": ["./src/*"] // Path doesn't match actual structure
    }
  }
}
```

**✅ CORRECT (v16):**
```json
// tsconfig.json - Correct settings for Next 16
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      { "name": "next" }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```
**Why:** `moduleResolution: "bundler"` is recommended for Next 16 with modern bundlers.

## 4. Quick Reference Table

| Feature | ❌ Don't | ✅ Do |
|---------|---------|------|
| Config File | `next.config.js` | `next.config.ts` |
| Server Actions | `experimental.serverActions` | Remove (stable) |
| PPR | `experimental.ppr` | `cacheComponents: true` |
| Params Type | `{ slug: string }` | `Promise<{ slug: string }>` |
| React Types | `@types/react@18` | `@types/react@19` |
| Server Code | Unprotected | `import 'server-only'` |
| Runtime Config | `publicRuntimeConfig` | Environment variables |
| Module Resolution | `"node"` | `"bundler"` |

## 5. Checklist Before Coding

- [ ] Using `next.config.ts` (not .js) with `NextConfig` type
- [ ] Removed `experimental.serverActions` (stable in v16)
- [ ] Using `cacheComponents: true` instead of `experimental.ppr`
- [ ] All params/searchParams typed as `Promise<...>`
- [ ] `@types/react` and `@types/react-dom` are v19
- [ ] Server-only modules import `'server-only'` at top
- [ ] `tsconfig.json` uses `moduleResolution: "bundler"`
---END FILE---

---FILE: .kanban2code/_context/skills-index.json---
{
  "version": "16.0.10",
  "last_updated": "2025-12-18",
  "core_skills": [
    {
      "file": "_context/skills/nextjs-core-skills.md",
      "always_attach": true,
      "description": "Mandatory baseline for Next.js 16. Covers async APIs (params, cookies, headers), proxy.ts migration, React 19 patterns (useActionState), and parallel route requirements. Always attach for any Next.js task."
    }
  ],
  "conditional_skills": [
    {
      "name": "Caching & Data Fetching",
      "file": "_context/skills/skill-caching-data-fetching.md",
      "triggers": {
        "keywords": [
          "cache",
          "caching",
          "fetch",
          "revalidate",
          "revalidateTag",
          "cacheTag",
          "cacheLife",
          "use cache",
          "unstable_cache",
          "ISR",
          "stale",
          "PPR",
          "partial prerendering"
        ],
        "files": [
          "**/use-cache.ts",
          "**/cache.ts",
          "**/data.ts",
          "**/lib/fetch*.ts"
        ],
        "task_patterns": [
          "performance",
          "slow page",
          "data not updating",
          "stale data",
          "caching strategy",
          "incremental static regeneration"
        ]
      },
      "description": "Deep dive into 'use cache' directive, cacheLife profiles (seconds/minutes/hours/days/weeks/max), cacheTag for invalidation, PPR patterns, and the 'uncached by default' paradigm shift."
    },
    {
      "name": "Server Actions & Mutations",
      "file": "_context/skills/skill-server-actions-mutations.md",
      "triggers": {
        "keywords": [
          "server action",
          "use server",
          "useActionState",
          "useFormState",
          "useFormStatus",
          "form action",
          "FormData",
          "mutation",
          "submit",
          "zod",
          "validation",
          ".bind"
        ],
        "files": [
          "**/actions.ts",
          "**/actions/*.ts",
          "**/*-action.ts"
        ],
        "task_patterns": [
          "form submission",
          "create form",
          "update data",
          "delete record",
          "handle form",
          "validate input"
        ]
      },
      "description": "Security patterns (Zod validation mandatory), useActionState migration from useFormState, .bind() for secure argument passing, redirect() placement outside try/catch."
    },
    {
      "name": "Routing & Layouts",
      "file": "_context/skills/skill-routing-layouts.md",
      "triggers": {
        "keywords": [
          "parallel route",
          "@modal",
          "@slot",
          "default.js",
          "default.tsx",
          "intercepting route",
          "(.)folder",
          "(..)folder",
          "layout.tsx",
          "loading.js",
          "error.js",
          "route group"
        ],
        "files": [
          "**/default.tsx",
          "**/default.js",
          "**/@*/page.tsx",
          "**/loading.tsx",
          "**/error.tsx"
        ],
        "task_patterns": [
          "modal",
          "sidebar",
          "navigation",
          "nested layout",
          "create page",
          "add route",
          "parallel slot"
        ]
      },
      "description": "Parallel routes (default.js requirement), intercepting routes syntax (.)/(..)/(...), async params in layouts, loading.js and error.js patterns."
    },
    {
      "name": "Metadata & SEO",
      "file": "_context/skills/skill-metadata-seo.md",
      "triggers": {
        "keywords": [
          "metadata",
          "generateMetadata",
          "SEO",
          "openGraph",
          "og:image",
          "opengraph-image",
          "sitemap",
          "robots",
          "meta tags",
          "title",
          "description",
          "ImageResponse"
        ],
        "files": [
          "**/opengraph-image.tsx",
          "**/twitter-image.tsx",
          "**/sitemap.ts",
          "**/robots.ts",
          "**/icon.tsx"
        ],
        "task_patterns": [
          "SEO optimization",
          "social sharing",
          "meta tags",
          "sitemap generation",
          "open graph image",
          "twitter card"
        ]
      },
      "description": "Async generateMetadata signature change, ImageResponse with async params, sitemap.ts and robots.ts dynamic generation, image remotePatterns security."
    },
    {
      "name": "TypeScript & Config",
      "file": "_context/skills/skill-typescript-config.md",
      "triggers": {
        "keywords": [
          "next.config",
          "typescript",
          "type error",
          "Promise type",
          "tsconfig",
          "server-only",
          "experimental",
          "cacheComponents",
          "@types/react"
        ],
        "files": [
          "**/next.config.ts",
          "**/next.config.js",
          "**/tsconfig.json"
        ],
        "task_patterns": [
          "type error",
          "build error",
          "configuration",
          "setup project",
          "module resolution",
          "cannot be used as JSX"
        ]
      },
      "description": "next.config.ts (typed config), Promise prop type patterns, React 19 type compatibility, server-only module protection, module resolution settings."
    }
  ]
}
---END FILE---

---

## Summary

This document contains all 7 files synthesized from the Gemini 3.0 Pro and ChatGPT-5-Pro source documents. Key improvements made:

1. **Consistent Structure** - Every skill file follows the exact mandatory format with numbered sections
2. **WRONG/CORRECT Pairs** - Every pattern has both the hallucination-risk code and the v16-correct code
3. **Concise Tables** - Quick reference tables for fast lookup
4. **Actionable Checklists** - 5-6 items max per skill for pre-coding verification
5. **Comprehensive Triggers** - The skills-index.json includes keywords, file patterns, AND task patterns

### Critical Breaking Changes Covered:

| Change | Impact |
|--------|--------|
| Async params/cookies/headers | Runtime crashes if not awaited |
| proxy.ts replaces middleware.ts | File location and naming change |
| useActionState replaces useFormState | Import location and API change |
| Uncached by default | Data fetching behavior inversion |
| default.js required for parallel routes | Build failures without it |
| cacheComponents replaces experimental.ppr | Config structure change |
