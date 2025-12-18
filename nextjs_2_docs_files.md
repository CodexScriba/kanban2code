Answer # 1Twin#1
Comprehensive Engineering Analysis and Guardrail Specification for Next.js 16.0.10 App Router1. Executive Summary and Version Verification1.1 Scope and ObjectiveThis report details the architectural standards, breaking changes, and implementation guardrails for Next.js 16.0.10 (App Router). The primary objective is to define a library of "Skill Files" (context documents) designed to be attached to Large Language Model (LLM) coding agents. These agents, often trained on outdated datasets (Next.js 13/14), frequently hallucinate deprecated patterns. This report provides the authoritative "Ground Truth" for Next.js 16 development, focusing on the prevention of common, costly mistakes regarding server-client boundaries, caching strategies, and asynchronous request handling.1.2 Version Target VerificationAs of December 2025, Next.js 16.0.10 is the confirmed stable release.Release Verification: Official sources confirm Next.js 16.0.10 was published recently.1Core Dependencies:React: v19 (Stable). Next.js 16 enforces a minimum of React 19.Bundler: Turbopack (Stable/Default).Node.js: Minimum v20.9.0.1.3 The "LLM Failure Mode" LandscapeLLMs trained prior to late 2024 possess strong biases toward Next.js 14 conventions. The transition to Next.js 16 introduces fundamental architectural shifts that directly contradict these biases:Synchronous vs. Asynchronous Requests: LLMs assume params and cookies() are synchronous. In v16, they are Promises. This causes immediate runtime crashes.Middleware vs. Proxy: LLMs generate middleware.ts. In v16, this file is deprecated in favor of proxy.ts with distinct semantics.Caching Defaults: LLMs assume fetch requests are cached by default. In v16, they are uncached by default, requiring explicit use cache directives.Parallel Route Fallbacks: LLMs frequently omit default.js in parallel slots, leading to build failures in v16.This report analyzes these failure modes and formulates precise guardrails (Skills) to counteract them.2. Architectural Analysis: The "Async Everywhere" Paradigm2.1 The Shift to Asynchronous Request APIsThe most significant breaking change in Next.js 16 is the mandatory asynchronous access to dynamic request data. This change is driven by the Partial Prerendering (PPR) architecture, which allows the static "shell" of a page to render immediately while dynamic parts (dependent on cookies, headers, or params) stream in later.2.1.1 The Legacy Pattern (Hallucination Risk)In Next.js 14, accessing params in a Page component was synchronous:TypeScript// ❌ Legacy Next.js 14 (Causes Error in v16)
export default function Page({ params }: { params: { slug: string } }) {
  return <div>{params.slug}</div>; // Runtime Error: params is a Promise
}
LLMs heavily favor this pattern due to its prevalence in training data.2.1.2 The Next.js 16 StandardIn version 16, params, searchParams, cookies(), headers(), and draftMode() are strictly asynchronous. They must be awaited. This applies to:app/page.tsxapp/layout.tsxapp/route.ts (Route Handlers)app/default.tsxgenerateMetadataopengraph-image.tsxImplication for Guardrails: The Core Skill file must explicitly forbid synchronous access and provide the await pattern as the only valid approach.2.2 Re-engineering the Network Boundary: proxy.tsNext.js 16 formally deprecates middleware.ts in favor of proxy.ts. This is not merely a rename but a semantic clarification.2.2.1 Why the Change?The term "Middleware" in the JavaScript ecosystem (Express, Koa) implies a chain of functions that run during request processing. In Next.js, this file runs at the Edge (or Node.js) before the request even reaches the App Router rendering logic. It acts as a reverse proxy router. The name proxy.ts aligns the mental model with the behavior: request interception, rewriting, and redirection at the network boundary.2.2.2 Implementation DetailsFile Location: Root or src/proxy.ts.Export: Must export a function named proxy (or default).Runtime: Node.js runtime is now stable and supported for proxy.ts, removing previous Edge constraints that limited library usage (e.g., database drivers in middleware).Caching Constraints: fetch requests inside proxy.ts are never cached.3. The Caching Strategy: "Uncached by Default"3.1 The Caching InversionNext.js 13/14 aggressively cached fetch requests by default. This led to the "stale data" confusion where developers struggled to opt-out of caching.Next.js 15/16 inverts this: Data is uncached by default.fetch(...) -> Dynamic (No cache).GET Route Handler -> Dynamic (No cache).Client Router Cache -> minimal stale time.3.2 The use cache DirectiveTo opt-in to caching, Next.js 16 introduces the use cache directive, similar to use server or use client.Scope: Can be applied to a function or a file.Mechanism: Memoizes the function execution based on arguments.Configuration: Controlled via cacheLife profiles.3.3 cacheLife ProfilesInstead of arbitrary "revalidate seconds," v16 uses semantic profiles:seconds, minutes, hours, days, weeks, max.These profiles configure the Stale-While-Revalidate (SWR) behavior, including "stale" time (when to serve old data) and "expire" time (when to hard-fetch).4. Skill File DefinitionsThe following sections define the content of the "Skill Files" to be generated. Each file is designed to be injected into the LLM's context window to override its outdated internal knowledge.4.1 Artifact A: Core Skill (nextjs-core-skills.md)This file is the "Constitution" of the project. It must be attached to every Next.js task. It addresses the high-frequency breaking changes that cause immediate crashes (Async APIs, Proxy).Analysis of Content:Target: Next.js 16.0.10.Rule 1: Async Props. Explicitly shows Promise<{ slug: string }> type definition.Rule 2: proxy.ts requirement.Rule 3: Strict Directory Structure (App Router only).Rule 4: Parallel Route default.js requirement.4.2 Artifact B: Conditional Skills4.2.1 Skill: Caching & Data Fetching (skill-caching-data-fetching.md)Trigger: Performance tuning, "why is my page slow", database queries.Key Insights:LLMs try to use revalidate: 60 in fetch options. v16 prefers use cache with cacheLife.LLMs try to use unstable_cache. This is deprecated/stabilized as use cache.Guardrail: Enforce the "Uncached by Default" mental model.4.2.2 Skill: Server Actions & Mutations (skill-server-actions-mutations.md)Trigger: Forms, buttons, data updates.Key Insights:Security: Server Actions are public endpoints. Zod validation is mandatory.React 19: useFormState is renamed to useActionState. LLMs hallucinate useFormState (React 18) constantly.Pattern: "Bind" arguments for secure ID passing.4.2.3 Skill: Routing & Layouts (skill-routing-layouts.md)Trigger: Navigation, sidebars, modals, new pages.Key Insights:Parallel Routes: The most fragile part of App Router. Next.js 16 build fails if default.js is missing for a slot. LLMs rarely generate this file.Intercepting Routes: Syntax (.) vs (..) is confusing for LLMs.4.2.4 Skill: Metadata & SEO (skill-metadata-seo.md)Trigger: SEO, OpenGraph, sitemap.xml.Key Insights:generateMetadata now receives params as a Promise. The signature change is subtle but breaking.ImageResponse in Route Handlers also receives async params.4.2.5 Skill: TypeScript & Config (skill-typescript-config.md)Trigger: next.config.js, type errors, build setup.Key Insights:next.config.ts (TypeScript config) is now standard.Common type errors regarding Promise props.4.3 Artifact C: Skills Index (skills-index.json)A deterministic JSON mapping keywords to files. This allows an orchestrator (or the LLM itself) to select only the relevant context, saving tokens.4.4 Artifact D: Skills Catalog (skills-catalog.md)A human-readable description of the skills, useful for developers debugging the agent's context or manually selecting skills.5. Detailed Guardrail SpecificationsThe following section presents the exact content required for the output artifacts. These blocks represent the crystallized knowledge of the "Senior Next.js Engineer" persona, formatted strictly for consumption by a coding agent.5.1 Core Skill SpecificationThe core skill serves as the primary override for version mismatches. It establishes proxy.ts and Async APIs as non-negotiable.5.2 Caching Skill SpecificationThis skill focuses on the "use cache" directive, which is foreign to models trained on Next.js 14. It explains the cacheLife profiles which replace the numeric revalidate concept.5.3 Server Action Skill SpecificationThis skill bridges the gap between React 18 (useFormState) and React 19 (useActionState), a critical renaming that causes type errors if missed.6. Output Artifacts GenerationThe following file blocks constitute the final deliverable.---FILE:.kanban2code/_context/skills/nextjs-core-skills.md---Next.js 16.0.10 Core Competency & Architecture Guidelines1. Executive Summary & Version TargetTarget Version: Next.js 16.0.10 (App Router)React Version: React 19 (Stable)Bundler: Turbopack (Default/Stable)This core skill file establishes the fundamental architectural constraints for Next.js 16.0.10. It is designed to override outdated training data regarding Next.js 13/14/15 patterns, particularly concerning the synchronous access of request-time data, the deprecation of middleware.ts, and the shift to explicit caching policies.⚠️ CRITICAL WARNING FOR AI AGENTS:Next.js 16 introduces Breaking Changes that are not backward compatible with Next.js 14/15 code.Request APIs are Async: You CANNOT access params, searchParams, cookies(), headers() synchronously.Middleware is proxy.ts: middleware.ts is deprecated. You must use proxy.ts.Uncached by Default: fetch and GET handlers are no longer cached by default. You must opt-in using use cache or cacheLife.Parallel Routes Rigidity: Missing default.js files will cause build failures.2. The "Async Everywhere" Paradigm (Blocking Change)2.1 The ConceptIn Next.js 16, any API that relies on runtime request information (dynamic data) is asynchronous. This prepares the framework for Partial Prerendering (PPR) and allows the server to yield during I/O operations without blocking the main thread.2.2 Synchronous Access Failure Mode (Hallucination Trap)❌ INCORRECT (Legacy v14/15 Pattern):AI models frequently generate components that access params or searchParams directly as props. This causes immediate runtime errors in v16.TypeScript// ❌ WRONG: Causes runtime error in Next.js 16
interface Props {
  params: { slug: string };
  searchParams: { q: string };
}

export default function Page({ params, searchParams }: Props) {
  // CRASH: params is a Promise
  return <h1>{params.slug} results for {searchParams.q}</h1>;
}
2.3 Correct Async Implementation✅ CORRECT (Next.js 16 Pattern):All dynamic props must be awaited.TypeScript// ✅ RIGHT: Awaiting the promise props
interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string | undefined }>;
}

export default async function Page(props: Props) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  return <h1>{params.slug} results for {searchParams.q}</h1>;
}
2.4 Request APIsSimilarly, cookies() and headers() are now Promises.TypeScriptimport { cookies, headers } from 'next/headers';

export default async function UserProfile() {
  // ❌ WRONG: const cookieStore = cookies();
  
  // ✅ RIGHT:
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token');
  
  // ✅ RIGHT:
  const headerList = await headers();
  const userAgent = headerList.get('user-agent');
}
3. proxy.ts: The New Network Boundary3.1 Migration from MiddlewareNext.js 16 replaces middleware.ts with proxy.ts. The name change reflects a shift in philosophy: this file acts as an explicit HTTP proxy/interception layer before the request hits the React rendering tree or Route Handlers.Location: Root of the project (or /src/proxy.ts if using src directory).Runtime: Explicitly runs on the defined runtime (Node.js support is now stable and preferred for many use cases).3.2 Implementation ConstraintsNo Fetch Caching: You cannot use fetch caching strategies inside proxy.ts. All fetches are strictly uncached.Execution Order: proxy.ts runs before any caching layout or page logic.Redirects & Rewrites: This is the primary location for internationalization (i18n) routing and authentication guards.3.3 The Code Standard❌ INCORRECT (Legacy Middleware):TypeScript// middleware.ts (DEPRECATED)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  return NextResponse.next();
}
✅ CORRECT (v16 Proxy):TypeScript// proxy.ts (REQUIRED)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 1. Export named function 'proxy' (or default export)
export async function proxy(request: NextRequest) {
  const url = request.nextUrl;

  // Example: Redirect /old to /new
  if (url.pathname === '/old') {
    url.pathname = '/new';
    return NextResponse.redirect(url);
  }

  // Example: Rewrite for multi-tenant subdomains
  const hostname = request.headers.get('host');
  if (hostname?.startsWith('app.')) {
     url.pathname = `/app${url.pathname}`;
     return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

// 2. Config object for matching paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
4. Turbopack & Strict Build Mode4.1 Turbopack DefaultNext.js 16 uses Turbopack by default for next dev and next build.Implication: Custom .babelrc or complex webpack configurations in next.config.js may cause de-optimization or build failures unless explicitly handled.Action: Prefer SWC plugins over Babel. Only revert to Webpack (--webpack flag) if absolutely necessary for legacy loaders.4.2 Strict TypeScript ConfigurationNext.js 16 enforces strict type checks on next.config.ts (Typed Config).✅ CORRECT (next.config.ts):TypeScriptimport type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // New v16 Caching Flag
  cacheComponents: true,
  
  // Experimental options stabilized or removed
  // ❌ experimental: { serverActions: true } -> REMOVED (now default)
  // ❌ experimental: { ppr: true } -> REMOVED (use cacheComponents)
};

export default nextConfig;
5. Route Handlers (route.ts) Conventions5.1 Request Object PreferenceIn v16 Route Handlers, prefer NextRequest over standard Request for easier access to Next.js specific helpers like nextUrl and cookies.5.2 Caching Behavior ChangeGET requests in Route Handlers are UNCACHED BY DEFAULT in Next.js 16.v14 Behavior: GET routes were static by default unless dynamic headers were read.v16 Behavior: GET routes are dynamic/uncached.Opt-in Static: You must export dynamic = 'force-static' or use use cache to cache the response.✅ CORRECT (Route Handler):TypeScriptimport { NextResponse, type NextRequest } from 'next/server';

// Default is 'auto' (usually dynamic in v16), set to 'force-static' for static generation
// export const dynamic = 'force-static'; 

export async function GET(request: NextRequest) {
  // Accessing searchParams directly from nextUrl
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  // Logic here...
  return NextResponse.json({ query });
}
6. Directory Structure & File ConventionsThe AI must strictly adhere to the App Router structure. pages/ directory is FORBIDDEN unless explicitly maintaining a legacy hybrid app (which we assume we are not, unless specified).6.1 Essential Filesapp/layout.tsx: Root layout (Required). Must contain <html> and <body>.app/page.tsx: Home page.proxy.ts: Root level (replaces middleware).app/global-error.tsx: Replaces custom _error.js. Must be a Client Component.6.2 Parallel Routes (@slot)Mandatory Requirement: Every defined slot (e.g., @modal) MUST have a default.js (or default.tsx) file in addition to page.js.Why: If Next.js attempts to render a slot during navigation where the slot matches no route (soft navigation), it falls back to default.js. In v16, omitting this file results in a 404 or build error.File Tree Example:app/├── @auth/│   ├── default.tsx  <-- REQUIRED│   ├── login/│   │   └── page.tsx│   └── page.tsx├── layout.tsx└── page.tsx7. React 19 IntegrationNext.js 16 is built on React 19.useActionState: Replaces useFormState.useFormStatus: Provides status of parent <form>.Refs as Props: You can pass ref as a prop to functional components; forwardRef is deprecated/unnecessary.<Context>: You can render <Context> directly instead of <Context.Provider>.✅ CORRECT (React 19 Form Pattern):TypeScript'use client';

import { useActionState } from 'react';
import { updateProfile } from './actions';

export function ProfileForm() {
  // useActionState(action, initialState)
  const [state, formAction, isPending] = useActionState(updateProfile, null);

  return (
    <form action={formAction}>
      <input name="email" />
      <button disabled={isPending}>Update</button>
      {state?.error && <p>{state.error}</p>}
    </form>
  );
}
8. Summary of DOs and DON'TsFeature⛔ DON'T (Legacy/Hallucination)✅ DO (Next.js 16.0.10)ParamsPage({ params }) (Sync access)Page({ params }: { params: Promise<...> })Headersconst h = headers()const h = await headers()Middlewaremiddleware.tsproxy.tsCachingAssume fetch is cachedUse use cache / cacheLife explicitlyParallel RoutesSkip default.jsCreate default.js for every slotFormsuseFormStateuseActionStateConfigexperimental.pprcacheComponents: true---END FILE------FILE:.kanban2code/_context/skills/skill-caching-data-fetching.md---Next.js 16 Caching & Data Fetching Skills1. The Caching Model ShiftNext.js 16 introduces a radical simplification and explicit definition of caching, moving away from the heuristic-based caching of v13/14.The Golden Rule: Data is UNCACHED by default.fetch requests: Uncached.GET Route Handlers: Uncached.Client Router Cache: Stale time 0 (mostly).To enable caching, you must use the Cache Components architecture invoked via the use cache directive.2. Enabling Cache ComponentsIn next.config.ts, ensure the flag is enabled (it is the default in 16.0.10, but explicit config ensures compatibility).TypeScript// next.config.ts
const nextConfig = {
  cacheComponents: true, // Enables 'use cache' and cacheLife
};
3. The use cache Directive3.1 Function-Level CachingYou can mark any async function (server component, data fetching utility, or action) with 'use cache'. This automatically memoizes the function's return value based on its arguments.✅ CORRECT:TypeScript// app/lib/data.ts
import { cacheLife } from 'next/cache';

export async function getProduct(id: string) {
  'use cache'; // <--- Directive triggers caching
  cacheLife('hours'); // <--- Profile selection
  
  const res = await db.query(`SELECT * FROM products WHERE id = ${id}`);
  return res;
}
3.2 File-Level CachingPlacing 'use cache' at the top of a file caches all exports in that file. Use this for dedicated data-fetching modules.4. cacheLife ProfilesNext.js 16 replaces manual revalidate seconds with semantic "profiles". These profiles dictate the Stale-While-Revalidate (SWR) logic.4.1 Built-in Profilesseconds: High frequency updates.minutes: Short-term cache.hours: Medium-term.days: Long-term (blogs, static content).weeks: Rarely changing.max: Immutable forever (until manual tag invalidation).4.2 Customizing ProfilesYou can define custom profiles in next.config.ts.TypeScript// next.config.ts
const nextConfig = {
  cacheLife: {
    'marketing-pages': {
      stale: 3600, // Serve stale up to 1 hour
      revalidate: 900, // Check for updates every 15 mins
      expire: 86400, // Hard expire after 1 day
    },
  },
};
4.3 UsageTypeScriptimport { cacheLife } from 'next/cache';

export async function getData() {
  'use cache';
  cacheLife('marketing-pages');
  return fetch('...');
}
5. cacheTag and Invalidation5.1 Tagging DataThe cacheTag function replaces the fetch(url, { next: { tags: } }) pattern for non-fetch data (like DB queries), though fetch tags still work.TypeScriptimport { cacheTag } from 'next/cache';

async function getUser(id: string) {
  'use cache';
  cacheTag(`user-${id}`, 'users'); // Add multiple tags
  return db.user.find(id);
}
5.2 Invalidating Data (revalidateTag)Use revalidateTag in Server Actions or Route Handlers to purge cache.TypeScript'use server';
import { revalidateTag } from 'next/cache';

export async function updateUser(formData: FormData) {
  const id = formData.get('id');
  await db.update(id,...);
  
  // Invalidates the specific user cache
  revalidateTag(`user-${id}`);
}
5.3 updateTag (Read-Your-Writes)A new API in v16, updateTag, is designed for Server Actions where you need immediate consistency within the same request lifecycle (e.g., updating a list and immediately returning the new list without waiting for a revalidate loop).6. Fetching in proxy.tsWARNING: proxy.ts does NOT support fetch caching.Any fetch call inside proxy.ts will be executed on every request.Do not perform heavy data fetching here.If you need cached data for redirection logic, consider moving that logic to a Layout or Page.7. Partial Prerendering (PPR)PPR is enabled by default when cacheComponents is active.Mechanism: Routes are static shells by default.Dynamic Holes: Wrapping a component in <Suspense> or accessing dynamic data (cookies, headers) creates a dynamic "hole" in the static shell.Result: The server streams the static shell immediately, then streams the dynamic parts.✅ CORRECT PPR PATTERN:TypeScriptimport { Suspense } from 'react';
import { UserProfile } from './user-profile'; // Dynamic component reading cookies

export default function Page() {
  return (
    <main>
      <h1>Static Title (Instant Load)</h1>
      <Suspense fallback={<p>Loading User...</p>}>
        <UserProfile />
      </Suspense>
    </main>
  );
}
8. Common Mistakes (AI Failure Modes)MistakeCorrectionUsing export const revalidate = 60 with use cacheSTOP. Use cacheLife('minutes') inside the function instead.Using unstable_cacheDEPRECATED. Use 'use cache' directive.Expecting fetch to cache without configWRONG. fetch is uncached. Add 'use cache' wrapper or cache: 'force-cache'.Caching inside proxy.tsIMPOSSIBLE. Move logic to Layout/Page.---END FILE------FILE:.kanban2code/_context/skills/skill-server-actions-mutations.md---Next.js 16 Server Actions & Mutation Skills1. Definition & Security ModelServer Actions are asynchronous functions executed on the server, callable from Client Components (via RPC) or Server Components (direct execution). In Next.js 16, they are the standard for mutations.Security Constraint:Server Actions create a public HTTP endpoint if imported into a Client Component. You MUST treat them as public API endpoints.Authentication: Always check auth status inside the action.Authorization: Always check permissions inside the action.Validation: Always validate FormData or input arguments using Zod.2. Anatomy of a Secure Action2.1 The "Use Server" DirectiveFile Level: 'use server' at the top of actions.ts.Function Level: 'use server' inside an async function in a Server Component.2.2 Validation Pattern (Zod)Never trust FormData structure.TypeScript'use server';

import { z } from 'zod';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

const schema = z.object({
  email: z.string().email(),
  role: z.enum(['user', 'admin']),
});

export async function inviteUser(prevState: any, formData: FormData) {
  // 1. Authentication Check
  const session = await auth();
  if (!session |

| session.role!== 'admin') {
    return { error: 'Unauthorized', success: false };
  }

  // 2. Input Validation
  const validatedFields = schema.safeParse({
    email: formData.get('email'),
    role: formData.get('role'),
  });

  if (!validatedFields.success) {
    return { 
      error: 'Invalid fields', 
      issues: validatedFields.error.flatten().fieldErrors 
    };
  }

  // 3. Mutation
  try {
    await db.invite(validatedFields.data);
  } catch (e) {
    return { error: 'Database error', success: false };
  }

  // 4. Redirect (Must be outside try/catch if using next/navigation redirect which throws)
  redirect('/team');
}
3. Client Consumption: useActionStateReact 19 replaces useFormState with useActionState. Next.js 16 fully adopts this.❌ LEGACY (v14):TypeScriptimport { useFormState } from 'react-dom';
✅ CORRECT (v16):TypeScript'use client';

import { useActionState } from 'react';
import { inviteUser } from './actions';

export function InviteForm() {
  // Signature: [state, dispatch, isPending] = useActionState(fn, initialState, permalink?)
  const [state, dispatch, isPending] = useActionState(inviteUser, null);

  return (
    <form action={dispatch}>
      <input name="email" type="email" required />
      
      {state?.issues?.email && <span className="text-red-500">{state.issues.email}</span>}
      {state?.error && <div className="error">{state.error}</div>}
      
      <button type="submit" disabled={isPending}>
        {isPending? 'Inviting...' : 'Invite'}
      </button>
    </form>
  );
}
4. useFormStatusUsed in child components of the form to access pending state without prop drilling.TypeScript'use client';
import { useFormStatus } from 'react-dom';

export function SubmitButton() {
  const { pending, data, method, action } = useFormStatus();
  // 'data', 'method', 'action' are new in React 19/Next 16
  
  return <button disabled={pending}>Save</button>;
}
5. Dead Code EliminationNext.js 16 is aggressive about removing unused Server Actions.If an action is defined in actions.ts but never imported by a Client Component, Next.js WILL NOT generate a public endpoint for it.This is a security feature (reducing attack surface).Implication: You cannot "scan" for actions dynamically; imports must be static.6. Binding ArgumentsUse .bind() to pass additional data (like IDs) to actions without hidden inputs (which can be tampered with).TypeScript// Server Component
export default function UserRow({ id }: { id: string }) {
  const deleteUserWithId = deleteUser.bind(null, id);
  
  return (
    <form action={deleteUserWithId}>
      <button>Delete</button>
    </form>
  );
}

// actions.ts
export async function deleteUser(id: string, formData: FormData) {
  // id is securely bound on the server; client cannot tamper with it easily 
  // if the closure is encoded correctly by React Server Components
  await db.delete(id);
}
7. Common FailuresIssuePreventionClosures in ActionsDo not rely on variables outside the action scope if they contain sensitive data meant only for the server, unless you understand encryption serialization. Prefer explicitly passing data.Redirect in try/catchredirect() throws an error to handle navigation. Never catch it inside a try/catch block unless you re-throw.Plain onSubmitAvoid onSubmit={handleSubmit} for Server Actions. Use action={dispatch} to allow Progressive Enhancement (form works without JS).---END FILE------FILE:.kanban2code/_context/skills/skill-routing-layouts.md---Next.js 16 Routing, Layouts & Async Params1. Async Params in Depth (The Big Change)As detailed in Core Skills, all params are Promises. This affects:page.tsxlayout.tsxroute.ts (Route Handlers)default.js (Parallel Routes)generateMetadata1.1 Layout ImplementationLayouts often need params to fetch data for sidebars or headers.✅ CORRECT:TypeScript// app/blog/[slug]/layout.tsx
export default async function BlogLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; // Await is MANDATORY
  
  return (
    <div className="blog-layout">
      <aside>Active Post: {slug}</aside>
      {children}
    </div>
  );
}
2. Parallel Routes (@folder) Strictness2.1 The default.js RequirementNext.js 16 is strict. If you have a slot @analytics, you MUST have:app/@analytics/page.tsx (The initial view)app/@analytics/default.tsx (The fallback view)Why? When navigating between sibling routes (e.g., /settings to /profile), if the @analytics slot doesn't have a specific match for /profile, Next.js tries to render default.js. If missing -> 404 Error.The default.js Code:TypeScript// app/@analytics/default.tsx
// Usually returns null to render nothing, or returns the same as page.tsx
export default function Default() {
  return null;
}
2.2 Params in Defaultdefault.js also receives params as a Promise.TypeScriptexport default async function Default({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <div>Fallback for {id}</div>;
}
3. Intercepting Routes ((.)folder)Used for "Modal on top of URL" patterns.Convention: (.) matches same level, (..) matches one level up, (...) matches root.Behavior:Soft Navigation (Link click): Intercepted route renders (the Modal).Hard Navigation (Refresh/Share): The actual target route renders (the full page), not the interception.Common Mistake: Forgetting the "Full Page" fallback. If you intercept /photo/[id], you must also have a real /photo/[id]/page.tsx for the hard refresh scenario.4. loading.js and error.js4.1 Loading UI (Suspense)loading.js automatically wraps the page in a React Suspense boundary.Insight: In Next.js 16 with PPR, loading.js is critical. It defines the "Static Shell" fallback while dynamic content loads.4.2 Error Handling (error.js)Client Component: error.js MUST be 'use client'.Scope: Catches errors in nested children. Does NOT catch errors in the same level layout.js.Global Error: To catch root layout errors, use app/global-error.tsx.✅ CORRECT error.tsx:TypeScript'use client'; // Required

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
5. Linked "Safe" NavigationNext.js 16 supports experimental.typedRoutes (often stable/default in 16.x iterations).Effect: <Link href="/about"> is typed. <Link href="/about"> throws a TS error.Usage: Ensure next.config.ts has typed routes enabled if checking types.---END FILE------FILE:.kanban2code/_context/skills/skill-metadata-seo.md---Next.js 16 Metadata & SEO Skills1. Async Metadata GenerationThe generateMetadata function has changed signature to support the async nature of request data.Legacy (v14): params was a direct object.Next.js 16: params is a Promise.1.1 Correct ImplementationTypeScriptimport type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // 1. Await the params
  const { id } = await params;
  
  // 2. Fetch data (this fetch is deduped with the page's fetch if using 'use cache' or fetch memoization)
  const product = await fetch(`https://api.example.com/products/${id}`).then((res) => res.json());

  // 3. Access parent metadata (e.g. for extending title)
  const previousImages = (await parent).openGraph?.images ||;

  return {
    title: product.title,
    openGraph: {
      images: ['/some-specific-image.jpg',...previousImages],
    },
  };
}
2. Dynamic Image Generation (ImageResponse)Route Handlers for OG images (opengraph-image.tsx) also receive async params.✅ CORRECT:TypeScript// app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Params are explicit props in the exported function, but the type definition 
// for the exported component handles the async resolution internally in Next.js 16 logic
// However, if you are accessing them, treat them as data sources.

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  return new ImageResponse(
    (
      <div style={{ fontSize: 48, background: 'white', width: '100%', height: '100%' }}>
        Post: {slug}
      </div>
    ),
    { width: 1200, height: 600 }
  );
}
3. Robots & Sitemapsitemap.ts and robots.ts are flexible.Sitemap: Can be async and generate multiple URLs.ID Param: If using generateSitemaps (for splitting sitemaps), the id argument is now a Promise in v16.TypeScript// app/sitemap.ts
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();
  return posts.map(post => ({
    url: `https://acme.com/blog/${post.slug}`,
    lastModified: post.updatedAt,
  }));
}
4. next/image Security ChangesNext.js 16 tightens security on the Image component.Local IP Block: images.remotePatterns now forbids loopback/local IPs by default to prevent SSRF (Server Side Request Forgery). You must explicitly enable dangerouslyAllowLocalIP in next.config.ts if needed (dev only).Strict Mode: minimumCacheTTL defaults to 0.Configuration Update:TypeScript// next.config.ts
const config = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.example.com',
        pathname: '/v1/**',
      },
    ],
  },
};
---END FILE------FILE:.kanban2code/_context/skills/skill-typescript-config.md---Next.js 16 TypeScript & Config Skills1. next.config.ts (Typed Config)Next.js 16 officially supports a TypeScript-based configuration file. This provides autocomplete and type safety for configuration options.✅ CORRECT (Project Root):TypeScriptimport type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  cacheComponents: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  experimental: {
    // Typed routes are often standard now, but check experimental flags if types fail
    typedRoutes: true, 
  },
};

export default nextConfig;
2. Common Type Errors & Fixes2.1 "Property 'slug' does not exist on type 'Promise<...>'"Cause: Accessing params.slug without await.Fix:TypeScript// BEFORE
const slug = params.slug; 

// AFTER
const { slug } = await params;
2.2 "Component cannot be used as a JSX component"Cause: An async component is being used in a way React 18 didn't like, or types are outdated. React 19 supports async components natively.Fix: Ensure @types/react and @types/react-dom are upgraded to v19 versions.2.3 PageProps HelperNext.js provides a helper type (though often manual typing is clearer).TypeScript// Manual is preferred for clarity
type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string | undefined }>;
};
3. Module ResolutionNext.js 16 uses strict module resolution.Aliases: Ensure tsconfig.json paths match."Use Client" imports: You cannot import server-only code (like database drivers) into a file marked 'use client'. Next.js 16 build will fail immediately.Solution: Pass data as props, or use Server Actions to bridge the gap.---END FILE------FILE:.kanban2code/_context/skills-index.json---{"skills": [{"name": "Next.js 16 Core & Architecture","file": "nextjs-core-skills.md","description": "Mandatory baseline for Next.js 16. Covers async APIs, proxy.ts, and strict directory structure. Always attach.","triggers": ["nextjs", "next.js", "react", "app router", "route"]},{"name": "Caching & Data Fetching","file": "skill-caching-data-fetching.md","description": "Deep dive into 'use cache', cacheLife, PPR, and the 'uncached by default' paradigm.","triggers": ["cache", "fetch", "data", "revalidate", "ppr", "slow", "performance"]},{"name": "Server Actions & Mutations","file": "skill-server-actions-mutations.md","description": "Security, Zod validation, useActionState, and form handling in v16.","triggers": ["form", "mutation", "action", "server action", "submit", "input", "zod"]},{"name": "Routing & Layouts","file": "skill-routing-layouts.md","description": "Parallel routes, default.js, intercepting routes, and layout params.","triggers": ["route", "layout", "parallel", "intercept", "modal", "navigation", "link"]},{"name": "Metadata & SEO","file": "skill-metadata-seo.md","description": "Async generateMetadata, sitemaps, and OG images.","triggers": ["seo", "metadata", "meta", "og image", "sitemap", "robots"]},{"name": "TypeScript & Config","file": "skill-typescript-config.md","description": "next.config.ts, typed routes, and common TS errors.","triggers": ["typescript", "ts", "type", "config", "error", "build"]}]}---END FILE------FILE:.kanban2code/_context/skills-catalog.md---Next.js 16.0.10 Skill CatalogThis catalog describes the "Skills" (Context Files) available to the AI coding agent. These files are designed to enforce Next.js 16 best practices and prevent regression to Next.js 14/15 patterns.1. Core Skill (Always Active)File: nextjs-core-skills.mdPurpose: Establishes the "Constitution" of the project.Key Rules Enforced:Async APIs: await params, await cookies().Proxy: proxy.ts instead of middleware.ts.Structure: App Router strictness.React 19: useActionState adoption.2. Conditional SkillsCaching & Data FetchingFile: skill-caching-data-fetching.mdWhen to use: User asks about performance, fetching data, database queries, or "why is my page not updating?"Key Concepts: use cache directive, cacheLife profiles, cacheTag, Partial Prerendering (PPR).Server Actions & MutationsFile: skill-server-actions-mutations.mdWhen to use: User is building forms, buttons, or modifying data.Key Concepts: Security validation (Zod), useActionState, dead code elimination, binding arguments.Routing & LayoutsFile: skill-routing-layouts.mdWhen to use: User is creating new pages, modals, sidebars, or complex navigation structures.Key Concepts: Parallel Routes (default.js requirement), Intercepting Routes, Loading/Error states.Metadata & SEOFile: skill-metadata-seo.mdWhen to use: User is working on SEO, social sharing cards, or sitemaps.Key Concepts: Async generateMetadata, ImageResponse with async params.TypeScript & ConfigFile: skill-typescript-config.mdWhen to use: User encounters build errors, type errors, or is setting up the project.Key Concepts: next.config.ts structure, handling Promise types in props.Usage Strategy:For any general Next.js task, attach nextjs-core-skills.md.If the specific task involves a sub-domain (e.g., "Make a form"), attach the relevant conditional skill (e.g., skill-server-actions-mutations.md).---END FILE---

Answer 2: OG # 2
---FILE: .kanban2code/_context/skills/nextjs-core-skills.md---
name: nextjs-core-skills
description: Core Next.js App Router guidelines to avoid common pitfalls and outdated patterns.
tags: [nextjs, app-router, core]
version_scope: "Next.js 16.0.10 App Router"
last_verified: "2025-12-18"
triggers:
keywords: ["Next.js", "App Router", "Next16", "Next 16", "pages/app"]
tags: ["nextjs"]
sources:
https://nextjs.org/docs/app/guides/upgrading/version-16 
nextjs.org
https://vercel.com/blog/common-mistakes-with-the-next-js-app-router-and-how-to-fix-them 
vercel.com
vercel.com
https://nextjs.org/blog/next-16 
nextjs.org
nextjs.org
https://nextjs.org/docs/app/api-reference/functions/use-router 
nextjs.org
Next.js App Router – Core Patterns & Pitfalls
When to attach
Always attach for Next.js App Router tasks. For example:
“Upgrade to Next.js 16 App Router, ensure latest conventions”
“Fix issues with Next.js app directory structure or data fetching”
What models frequently get wrong
Using client-side APIs or DOM (window, document, useEffect) in Server Components (or forgetting the "use client" directive when needed).
Overusing "use client" unnecessarily (e.g. marking many components as client components when they can be server components).
Suggesting outdated Next.js APIs (like getServerSideProps, _app.js, next/router) in an App Router context.
Inventing file/folder conventions instead of following the project’s actual structure (e.g. creating a pages/ directory in a Next 13+ app, or misnaming route.ts files).
Confusion about Node vs Edge runtime – e.g., using Node-only modules in Edge contexts or not considering runtime requirements (Node 20.9+ is required for Next 16
nextjs.org
).
Do / Don’t (golden rules)
DO:
Keep components Server by default. Only add 'use client' at the top of files that need interactivity (state, event handlers, browser APIs). All other components should remain Server Components for better performance.
Fetch data directly in Server Components for initial page load (no need for an intermediate API call)
vercel.com
. Use async/await in server components to fetch and render data on the server.
Verify the project’s Next.js version and structure before coding. Adapt to the repo: if it has an /app directory (App Router), use App Router conventions; if it’s older with /pages, use Pages Router patterns. Don’t mix them.
Use official file conventions (e.g. app/<segment>/page.tsx for pages, layout.tsx for layouts, app/api/route.ts for API handlers, etc.) – follow what the documentation and the existing repo use.
Be mindful of runtime: default environment is Node.js (with full Node APIs). Only use Edge runtime if explicitly required, and avoid Node-specific APIs in Edge (Edge functions have limited APIs).
Plan for data updates: if your code mutates data on the server, ensure you refresh or revalidate so UI updates (e.g. use Next’s revalidatePath, or client router.refresh() as needed).
DON’T:
Don’t fetch data in useEffect for initial page loads. Avoid patterns like fetching on the client in useEffect just to hydrate UI – instead, fetch on the server before rendering (Server Components can fetch and render immediately).
Don’t use old Next.js APIs in App Router:
No getServerSideProps, getStaticProps, or getInitialProps in the app directory.
No _app.js or _document.js (use app/layout.tsx instead for global layout).
Don’t import or use next/router (use next/navigation APIs in client components)
nextjs.org
.
Don’t create custom structures that Next.js doesn’t expect. For example, don’t arbitrarily create new directories for pages or duplicate existing ones. Stick to Next’s conventions (or the project’s established patterns) for routing, middleware, etc.
Don’t mark everything as client component out of habit. This can disable server optimizations. Only use "use client" when necessary (e.g. components with event listeners or state).
Don’t assume Edge runtime unless specified. If you do use an Edge function (like middleware in older versions), avoid Node-only modules (fs, crypto, etc.) there. In Next 16, the new proxy.ts runs on Node by default, simplifying this concern.
Don’t ignore Next 16 breaking changes. For example, accessing cookies, headers, or route params now requires async usage (they return Promises)
nextjs.org
. Verify if any such changes affect your code and adjust accordingly.
Checklist (run before coding)
 Check Next.js version & routing mode: Look at package.json and project structure. Are we on Next 16? Using /app directory (App Router) or /pages (Pages Router)? Use the appropriate conventions
nextjs.org
. Do not mix patterns from the wrong router.
 Server vs Client: Identify which components truly need to be Client Components. Only add 'use client' to those. Ensure components using useState, useEffect, or browser-only APIs are marked as client; leave others as default (server).
 Data fetching plan: Fetch required data on the server side whenever possible. Remove any suggestion to fetch initial data inside a client useEffect. Instead, perform await fetch() or database calls in Server Components or Route Handlers (API routes) before rendering
vercel.com
.
 Follow file conventions: Name and place files correctly. E.g., new pages go in app/<folder>/page.tsx, API endpoints in app/api/.../route.ts, etc. No unsupported file names (avoid creating _app.js, _document.js, etc. in App Router).
 Avoid outdated imports: Purge any usage of next/router (use next/navigation hooks in client code)
nextjs.org
, and remove references to deprecated utilities (Link from next/link is fine, but remove withRouter, etc. not supported in App Router).
 Runtime considerations: If using middleware or special Edge functions, ensure the code is compatible with the runtime. For Node-specific features, rely on Node runtime (which is default in Next 16’s proxy.ts). If writing proxy.ts (middleware), remember it runs in Node (Edge middleware.ts is deprecated)
nextjs.org
nextjs.org
.
 State and side effects: Do not manage loading states for SSR data manually. Instead, use Next.js loading UI patterns (suspense or loading.js files) for slow data, and error boundaries for errors. Remove any manual spinner code in server-rendered components that’s meant for initial load.
 Verify breaking changes: Double-check usage of cookies(), headers(), useSearchParams, route params, etc. against Next 16 docs. For example, ensure you call await cookies() or await headers() in server code (they are async in v16)
nextjs.org
. If uncertain, mark these instances to verify with documentation before relying on old behavior.
 Plan revalidation/refresh after mutations: If the task involves modifying data (forms, actions), include steps to update the UI. Use router.refresh() on the client or Next’s revalidation functions (revalidatePath, revalidateTag) on the server so that cached data is updated and user sees changes immediately.
Minimal examples
// ✅ Server Component fetching data (Next.js App Router)
export default async function Page() {
  // Fetch data on the server (no useEffect needed)
  const res = await fetch('https://api.example.com/posts');
  const posts = await res.json();
  return (
    <ul>
      {posts.map(p => <li key={p.id}>{p.title}</li>)}
    </ul>
  );
}
In the example above, the data is fetched in the Server Component itself, which is the recommended approach. The component is async and uses await fetch on the server, so by the time it renders on the client, the posts data is already populated
vercel.com
.
// ✅ Client Component for interactivity
'use client';
import { useState } from 'react';

export default function CounterButton() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Clicked {count} times
    </button>
  );
}
This second example is a Client Component (indicated by 'use client'). It uses React state and event handling, which require a client-side environment. Only components that truly need this (like this counter or components using useEffect or browser APIs) should be marked as client-side. Avoid (for initial data): Don’t do this in App Router:
// 🚫 Not recommended in App Router
'use client';
import { useState, useEffect } from 'react';

export default function Page() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    // Fetching on the client – unnecessary extra round-trip
    fetch('/api/posts').then(res => res.json()).then(setPosts);
  }, []);
  // ... render posts
}
In App Router, the above pattern is unnecessary. You would instead fetch on the server (as shown in the first example) or call the logic directly. Both Server Components and Route Handlers run on the server, so you can skip the extra network call.
Version notes
Next.js 16 verification: Next 16.0.10 is a stable release
nextjs.org
. Ensure you upgrade to React 19+ and Node.js 20.9 as required (Node 18 is no longer supported)
nextjs.org
.
Middleware renamed: In Next 16, middleware.ts (Edge runtime) is replaced by proxy.ts running in Node (for clearer network boundaries). The old middleware.ts is deprecated
nextjs.org
nextjs.org
.
Async hooks: Functions like cookies(), headers(), and even route params access have changed to async in Next 16. Access them with await (e.g. await cookies())
nextjs.org
. Using them without await will result in errors in Next 16.
Navigation API changes: The App Router uses next/navigation. The old next/router API (e.g. router.push from next/router) should be replaced with the new useRouter from next/navigation
nextjs.org
. Also, router.query and router.pathname are replaced by useSearchParams() and usePathname() respectively
nextjs.org
.
Data fetching defaults: In earlier App Router versions, fetches without special options were cached (static) by default. Next 16 introduces Cache Components which make caching opt-in and explicit. By default, all code runs per request unless you use 'use cache' or similar caching strategies
nextjs.org
. This is a shift from implicit caching to explicit caching.
Removed/Deprecated: Legacy APIs like getServerSideProps and getStaticProps have no effect in /app. Also, publicRuntimeConfig/serverRuntimeConfig are removed – use environment variables instead
nextjs.org
.
Redirects and errors: In App Router, use the redirect() and notFound() functions from 'next/navigation' in server code to handle redirects or 404s. These throw special errors that should not be caught by your code (they are handled by Next). If you wrap them in try/catch, they won’t work
vercel.com
. Instead, let them bubble up to enact the redirect or show the 404 page.
Context7 verification (optional)
“Next.js 16 default server component usage vs client component” (verify how Next treats components by default and when to use 'use client').
“Next.js 16 cookies() headers() changes” (check the official docs on the new async cookies/headers API in v16).
“Next.js 16 App Router vs Pages Router differences” (ensure understanding of features that moved or changed between the two routing systems).
“Next.js 16 caching with use cache and revalidateTag” (if implementing caching, verify the exact usage of new caching APIs in v16).
---END FILE---
---FILE: .kanban2code/_context/skills/nextjs-proxy-middleware.md---
name: nextjs-proxy-middleware
description: Request interception via Next.js 16 Proxy (formerly Middleware) – usage and common mistakes.
tags: [nextjs, routing, middleware, proxy]
version_scope: "Next.js 16.0.10 App Router"
last_verified: "2025-12-18"
triggers:
keywords: ["middleware", "proxy.ts", "NextResponse", "NextRequest", "rewrite", "redirect all requests"]
tags: ["nextjs", "middleware"]
sources:
https://nextjs.org/blog/next-16 
nextjs.org
nextjs.org
https://nextjs.org/docs/app/getting-started/proxy 
nextjs.org
nextjs.org
https://nextjs.org/docs/app/getting-started/proxy 
nextjs.org
nextjs.org
Next.js 16 Proxy (Middleware) – Request Handling
When to attach
Use for tasks involving global request handling or rewriting, e.g.:
“Implement middleware to check auth tokens on all requests”
“Add a redirect for legacy URLs using Next.js middleware/proxy”
“Modify headers for all responses in Next.js App Router”
What models frequently get wrong
Using middleware.ts instead of proxy.ts: In Next 16, the middleware file has been renamed to proxy.ts (running on Node.js by default)
nextjs.org
. LLMs often continue using middleware.ts or create multiple middleware files.
Placing the file incorrectly: The proxy.ts should live at the project root (or in src/ root) – at the same level as pages or app
nextjs.org
. Models sometimes nest it incorrectly or create it per folder (only one proxy file is allowed).
Heavy computations or data fetching in middleware: Middleware (Proxy) runs on every request and should be fast. LLMs may attempt to do database calls or large fetches here, which can slow down all requests (and caching via fetch options won’t work in Proxy
nextjs.org
).
Not using NextResponse properly: For example, forgetting to return a NextResponse (or to call NextResponse.next() when letting request through), or trying to use Express-like res/req objects (not available).
Missing matcher configuration: Not limiting the middleware to relevant paths, or using outdated config.matcher patterns. This can lead to Proxy running on unintended routes (including static files).
Mixing up Edge vs Node runtime: Prior to Next 16, middleware.ts ran on Edge by default (no Node APIs). Next 16’s proxy.ts runs on Node by default
nextjs.org
. LLMs might not realize this change or might still avoid Node APIs unnecessarily (or conversely, attempt Node operations in Edge middleware without proper runtime configuration).
Do / Don’t (golden rules)
DO:
Use a single proxy.ts file at the root (or src/) of your project
nextjs.org
. Consolidate all middleware logic there. If you need to organize logic, import helper functions, but there is only one entry point.
Rename and update from middleware: When upgrading to Next 16, rename middleware.ts to proxy.ts and change the default export to proxy (or use a named export)
nextjs.org
. The functionality remains the same, but the naming clarifies that it’s your app’s proxy layer.
Keep proxy logic lean: Only perform lightweight tasks – e.g. check auth tokens, rewrite URLs, add headers. Avoid long-running or slow network calls. If you need to fetch data for each request, consider if it can be done in a different way (or ensure it’s very fast). Do not attempt caching in Proxy – fetch cache and revalidate options are ignored in this context
nextjs.org
.
Use NextResponse utilities: e.g. NextResponse.redirect(url), NextResponse.rewrite(url), NextResponse.next() as needed. Modify request or response headers via the NextResponse as documented. Always return a NextResponse from your proxy function (or call NextResponse.next() for pass-through).
Configure matchers if needed: Use export const config = { matcher: '/path(pattern)' } to limit which routes the proxy runs on
nextjs.org
. This improves performance by not running on every route if not necessary (and avoids interfering with static assets or Next internals).
Edge vs Node: By default, proxy.ts runs in Node (so you can use Node APIs). If you specifically need Edge runtime (for ultra-low latency or to run in regions globally), you can still use middleware.ts (Edge) in Next 16, but it’s deprecated
nextjs.org
. Prefer proxy.ts unless an Edge runtime is explicitly required.
DON’T:
Don’t use multiple middleware/proxy files: Next.js will only pick up one global proxy.ts. Do not create e.g. one per folder. Instead, funnel all needs through conditional logic or route-specific matching.
Don’t keep using middleware.ts without reason: In Next 16, continue using middleware.ts only if you need Edge runtime. Otherwise, switch to proxy.ts (Node). The old file is slated for removal, and using it might mean missing out on Node features or facing deprecation warnings
nextjs.org
.
Don’t do blocking auth sessions or data processing here: For example, avoid reading large JSON bodies or querying a database in Proxy. This will slow every request. Instead, do minimal checks (like presence of a token) and let the page or an API route handle the heavy logic.
Don’t forget to handle all paths or use matchers: If your Proxy logic should only apply to certain routes (e.g. /app/* or /api/*), set a matcher. Conversely, if it should apply to all routes, ensure you’re not unintentionally excluding something. Missing a needed matcher or misconfiguring it can cause security logic to skip some routes.
Don’t try to bypass Proxy’s limitations: E.g., streaming responses or very large payload manipulations are not ideal in Proxy. It’s meant for quick routing decisions or header tweaks, not full request handling (use route handlers for that).
Don’t use outdated Next 12 middleware approaches: (like manually parsing URL without NextRequest/NextResponse, or using middlewares in pages/_middleware.js – those are obsolete in App Router context).
Checklist (run before coding)
 Single entry point: Ensure there is exactly one proxy.ts (or middleware.ts for Edge) in the repository root (or in src/). Remove or consolidate multiple middleware files if an LLM proposed them.
 File naming and export: If upgrading from older Next.js, rename middleware.ts to proxy.ts, and ensure the function exported is named proxy (or use a default export named function)
nextjs.org
. Update any references accordingly. Confirm Next.js recognizes the file by checking that it runs on dev startup.
 Logic scope: Clearly outline what the Proxy should do (e.g., “If no auth cookie, redirect to /login”). Write concise logic for those checks. Do not include any slow network calls or heavy computation in this layer.
 Use NextRequest/NextResponse: Import { NextRequest, NextResponse } from next/server. Use NextRequest to read request details (URL, headers, cookies) and NextResponse to shape the response (setting headers, cookies, redirect, rewrite, etc.). Do not attempt to use Node’s http module or Express-like middleware patterns.
 Return a response or call NextResponse.next(): After your logic, make sure to return something. If request passes through, return NextResponse.next(). If redirecting or rewriting, return that response. Avoid falling through without returning (this can cause requests to hang).
 Set up matcher if needed: Decide if your proxy should run on all routes or only some. Add export const config = { matcher: ... } accordingly
nextjs.org
. Use path patterns like /((?!api|_next/static|favicon.ico).*) for generic “all pages” except static assets, or specific paths like '/dashboard/:path*'. Verify pattern correctness.
 Consider Edge if necessary: If ultra low latency global checks are required (and logic is simple and Edge-compatible), you might opt for Edge runtime. In that case, either continue using middleware.ts (with its constraints) or specify export const runtime = 'edge' in proxy.ts. Confirm that any APIs you use (Crypto, etc.) are Web-standard (Edge has no Node APIs).
 Test behavior: Simulate requests that meet your conditions and ensure the Proxy does what’s expected (e.g., try accessing a protected page without auth and see if you get redirected). Also test routes that should be unaffected to ensure they still work normally.
 No sensitive data leaks: If modifying headers or cookies, be cautious not to expose secure info. E.g., don’t accidentally log auth tokens. Keep proxy free of verbose logging in production (for performance and security).
Minimal examples
Basic proxy.ts example – redirect all /old/* URLs to /new/*:
// app or project root: proxy.ts
import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/old/')) {
    // Rewrite /old/abc to /new/abc
    const newPath = pathname.replace(/^\/old\//, '/new/');
    return NextResponse.redirect(new URL(newPath, request.url));
  }
  // Continue handling other requests
  return NextResponse.next();
}

// Apply only to /old/* routes (could omit config to run on all routes)
export const config = {
  matcher: '/old/:path*',
};
In this example, the proxy function runs for any path under /old/. It uses request.nextUrl.pathname to check the path, and if it matches, returns a redirect to the new path. Otherwise, it calls NextResponse.next() to let the request continue. Note that we placed proxy.ts at the root and exported a named proxy function (alternatively could default-export it)
nextjs.org
. The config’s matcher ensures it only runs for the intended paths
nextjs.org
. Auth check example – block access if no session cookie:
import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  // Skip public assets and API (adjust as needed)
  if (url.pathname.startsWith('/_next/') || url.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }
  const hasSession = request.cookies.get('session_token');
  if (!hasSession) {
    // Redirect to login page
    url.pathname = '/login';
    url.search = '';  // drop query if any
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

// (Optional) config to exclude static files can be done with matcher regex as well
This example checks for a session_token cookie on incoming requests (excluding Next.js static assets and API routes from the check). If the cookie is missing, it redirects the user to /login. Otherwise, the request proceeds. This kind of simple, fast check is appropriate in Proxy. Avoid doing something like verifying the token against the database here – that should be done in a route handler or during the login process itself, not on every request.
Version notes
Next.js 16 change: Middleware functionality is now referred to as Proxy and runs on Node.js by default. You should rename your file to proxy.ts (Next 16 still supports middleware.ts for Edge, but it’s deprecated)
nextjs.org
nextjs.org
. The logic inside remains similar, but now you can use Node APIs if needed (e.g. certain npm packages) without the Edge restrictions.
Deprecated APIs removed: In older Next versions, you might have used request.nextUrl.pathname (still valid) and response.rewrite or response.next(). In Next 16, use NextResponse.redirect or NextResponse.rewrite to modify the response. NextResponse.next() remains for pass-through. Also note: the custom middleware API in next.config.js (experimental before) is not used in App Router – just rely on proxy.ts.
No caching in Proxy: The Next.js 16 docs explicitly state that using fetch with caching options (cache, revalidate, tags) in Proxy has no effect
nextjs.org
. The Proxy layer is intended for immediate response manipulation. Plan caching strategies elsewhere (e.g., in route handlers or server components).
Matcher behavior: If you use config.matcher, be aware of slight syntax differences from older Next.js versions. For example, older middleware used arrays of matchers or regex; Next 16 uses the same patterns (strings, arrays). Ensure your patterns are updated if needed. Also, Next 16 automatically excludes static files from middleware unless you override the matcher.
Edge runtime still optional: If you need to run code at the Edge network, you can add export const runtime = 'edge' to your proxy.ts. That will make it behave like the old middleware (Edge environment). Keep in mind Edge has limits on package size and available APIs. In most cases, Node (default in Next 16) is preferred for consistency and capabilities.
Future deprecation: Since middleware.ts is deprecated, expect a future major version to drop it completely. Start using proxy.ts to be forward-compatible.
Context7 verification (optional)
“Next.js 16 proxy.ts vs middleware.ts differences” (to confirm understanding of new Proxy file behavior and runtime).
“Next.js 16 NextResponse cookies headers in middleware” (if setting cookies or headers in Proxy, check official examples).
“Next.js middleware matcher config Next 16” (for correct usage of matcher patterns in config).
“Next.js 16 edge runtime limitations” (if considering edge, verify what’s supported to avoid runtime errors).
---END FILE---
---FILE: .kanban2code/_context/skills/nextjs-cookies-headers.md---
name: nextjs-cookies-headers
description: Managing cookies and headers in Next.js App Router (server vs client, new async APIs, setting values).
tags: [nextjs, cookies, headers, authentication]
version_scope: "Next.js 16.0.10 App Router"
last_verified: "2025-12-18"
triggers:
keywords: ["cookies()", "headers()", "Set-Cookie", "NextResponse.cookies", "authorization header", "session cookie"]
tags: ["nextjs", "auth", "cookies"]
sources:
https://nextjs.org/blog/next-16 
nextjs.org
nextjs.org
https://nextjs.org/docs/app/api-reference/functions/cookies 
nextjs.org
nextjs.org
https://nextjs.org/docs/app/api-reference/functions/headers 
nextjs.org
nextjs.org
https://vercel.com/blog/common-mistakes-with-the-next-js-app-router-and-how-to-fix-them 
vercel.com
Next.js App Router – Cookies & Headers Management
When to attach
Use for tasks dealing with cookies or HTTP headers, especially in server-side context. Examples:
“Implement login, set auth cookie on server”
“Read a cookie or header (like user token) in Next.js App Router”
“Add a custom header to all responses or forward request headers to backend”
What models frequently get wrong
Accessing cookies/headers in the wrong context: Models may try to read cookies or headers directly in Client Components (where they are not available) or via document.cookie on the server side, which is incorrect. In Next App Router, cookies and headers should be accessed through Next’s server functions.
Not using the new async APIs: In Next.js 16, cookies() and headers() are async functions that return a Promise (to accommodate Edge runtime)
nextjs.org
. LLMs often assume they are synchronous (as in Next 13) and omit await, leading to undefined values.
Using outdated patterns: Such as relying on context.req.cookies or getServerSideProps to get cookies – these don’t exist in the App Router. Or using next/head for meta tags when setting headers (not applicable; for headers like HTTP headers, must use NextResponse).
Setting cookies incorrectly: For example, not using cookies().set() or NextResponse correctly. LLMs might attempt to set cookies on the client via document.cookie (not secure for HttpOnly tokens), or forget to set path/expiry flags. Another common error is trying to set multiple cookies incorrectly (overwriting each other by returning only one header).
Forgetting secure flags: Not marking auth cookies as HttpOnly, Secure, SameSite etc., or exposing sensitive info via headers by accident.
Confusing client vs server: The model might try to use fetch on the client to get headers or cookies, rather than doing so on the server where they are accessible.
Do / Don’t (golden rules)
DO:
Use Next.js server utilities to read cookies/headers: In a Server Component or Route Handler, call const cookiesStore = await cookies() to get a cookie store, then use cookiesStore.get(name)
nextjs.org
. Similarly, use const headersList = await headers() to get a headers list, then headersList.get('header-name')
nextjs.org
. These work in server contexts (including Server Components, server actions, and route handlers).
Set cookies on the server side: In a Route Handler or Server Action, you can set cookies by obtaining the cookie store: (await cookies()).set(name, value, options)
nextjs.org
. In route handlers, alternatively use NextResponse: e.g. const res = NextResponse.json(data); res.cookies.set('token', token, { httpOnly: true, path: '/' }); return res;. Ensure to specify appropriate cookie options (Secure, HttpOnly, SameSite) for security.
Forward or modify headers server-side: To pass a header from incoming request to an outgoing fetch, you might do: const authorization = (await headers()).get('authorization') and then include it in the fetch request headers
nextjs.org
. To set response headers, use NextResponse (e.g. NextResponse.next({ headers: { 'X-Custom': 'value' } }) or in route handler return new Response(body, { status, headers: { ... } })).
Keep sensitive logic on server: Authentication tokens, user identifiers, etc., should be read and handled in server code (not exposed to client JS). Use HttpOnly cookies for auth tokens so they are not accessible via document.cookie on the client.
Be aware of cookie scope: By default, Next’s cookies() refers to the incoming request’s cookies (for reading) and sets cookies on the response (when used in route handlers or server actions). If you set a cookie in a server action, the updated cookie will be present on subsequent requests from the browser.
Use appropriate scope and lifetime for cookies: Set path=/ for site-wide cookies (most auth cookies) and a reasonable maxAge or use expires. Use SameSite=Lax or Strict for security (Lax is default in Next for cookies unless changed). Use Secure (ensures cookie only over HTTPS in production) and HttpOnly for any sensitive cookie so it’s not accessible via JS on client.
DON’T:
Don’t attempt to use document.cookie in Server Components or to manage critical cookies on the client. In App Router, anything related to auth/session should typically be handled in server actions or route handlers. document.cookie can only read cookies on the client (and cannot read HttpOnly cookies at all). Use cookies() on the server for reliable access.
Don’t forget await: Calling cookies() or headers() without await in Next 16 will return a Promise object instead of the actual data
nextjs.org
. Always use await cookies() and await headers() in async server contexts.
Don’t use deprecated Next APIs for headers/cookies: For example, NextResponse.next().cookies (older API) or req.cookies from Page Router context are not to be used in App Router. Rely on the cookies() / headers() functions or NextRequest/NextResponse if in middleware/edge (but with App Router, stick to the high-level functions in server code).
Don’t set cookies in client-side code for authentication: This can expose tokens to XSS. Instead, set auth cookies via server actions or API route responses (HttpOnly). The model should avoid suggesting storing JWTs in localStorage if a secure cookie is more appropriate.
Don’t assume cookies/headers exist: Always check (cookiesStore.get('name') may return undefined if cookie not set). Similarly, headersList.get('Name') could be null if header missing. Handle these cases (e.g., redirect to login if auth cookie missing).
Don’t oversize cookies or send sensitive data in headers: Keep cookies small (browser limits ~4KB each). Don’t send secrets or PII in URLs or headers needlessly. Use cookies or request body for sensitive info transmission.
Checklist (run before coding)
 Server context: Identify where you are accessing cookies or headers. Ensure it’s in a server environment (Server Component, API Route/Route Handler, or server Action). If the LLM put cookie logic in a Client Component, plan to move it to server side.
 Use Next functions: Replace any direct access (req.headers or req.cookies) with Next’s headers() and cookies() functions. Import them from 'next/headers'. Ensure to await them (e.g. const cookieStore = await cookies()).
 Reading cookies: Use cookieStore.get('cookieName') which returns an object { name, value, ... } or undefined if not present
nextjs.org
. If only value needed, use .get(...)?.value. For all cookies, cookieStore.getAll() is available
nextjs.org
.
 Setting cookies: If in a server action or route handler, use the cookie store’s set: (await cookies()).set(name, value, options)
nextjs.org
. Ensure to include attributes like:
path: '/' (so it’s not limited to current route),
httpOnly: true for auth/session cookies,
secure: process.env.NODE_ENV !== 'development' (Secure in prod),
sameSite: 'lax' (or as needed).
If setting cookies in a NextResponse (like middleware or route handler response), use response.cookies.set(...) similarly.
 Reading headers: Use headersList = await headers(). Remember header names are case-insensitive. Use the exact header name or all-lowercase. E.g., headersList.get('authorization')
nextjs.org
. Check for undefined if not present.
 Forwarding headers: When making a server-side fetch and needing to pass along client headers (auth, cookies, etc.), explicitly set them in the fetch request. For example, gather what’s needed from headers() or cookies() and include in fetch options.
 No client exposure for sensitive cookies: Confirm that the logic does not try to read an HttpOnly cookie on the client side (impossible) or leak its value. All auth verification should be server-side. If client needs to know “user is logged in”, derive that from server response instead of exposing token.
 Check new vs old behavior: If upgrading from Next 13/15 to 16, audit places where cookies/headers are used. Add await where missing. Remove any use of the now-removed synchronous access (Next 13 allowed cookies() without await in some contexts; Next 16 does not).
 Test cookie behavior: After setting a cookie on server (e.g., logging in), simulate a follow-up request to ensure the cookie is present (in dev, might need to actually run and check, but logically ensure the flow sets the cookie, and subsequent requests check it).
 Secure flags and domain: Ensure cookie options are appropriate (e.g., if cross-domain needed, set domain). Generally for same-site apps, no need to set domain. Make sure SameSite is not None unless you need cross-site cookies (and if so, Secure must be true).
 Headers manipulation caution: If setting custom headers (like CORS or caching headers), ensure they don't conflict with Next defaults unless intentionally overriding. Use route handler or middleware to set those consistently.
Minimal examples
Reading a cookie value in a Server Component:
// app/theme/layout.tsx (Server Component)
import { cookies } from 'next/headers';

export default async function ThemeLayout({ children }) {
  const cookieStore = await cookies();
  const theme = cookieStore.get('theme')?.value || 'light';
  // Use the theme value (from cookie or default)
  return <div data-theme={theme}>{children}</div>;
}
Here, we use await cookies() to get the cookie store and then retrieve the 'theme' cookie
nextjs.org
. If not set, we default to 'light'. This code runs on the server (layout is a Server Component), so it has access to incoming cookies. Setting a cookie in a Route Handler (API endpoint):
// app/api/login/route.ts (Route Handler for logging in)
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { username, password } = await request.json();
  const token = await authenticate(username, password);
  if (!token) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  const response = NextResponse.json({ success: true });
  // Set auth token cookie, HttpOnly, 7-day expiry
  response.cookies.set('auth_token', token, {
    httpOnly: true,
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // 1 week
  });
  return response;
}
In this route handler, after a successful login, we create a NextResponse and use response.cookies.set() to attach an auth_token cookie to it before returning
reddit.com
. The cookie is HttpOnly (not accessible via JS on client), Secure (only sent over HTTPS), and lasts one week. Subsequent requests from the client will include this cookie, which we can check via cookies() in other server code. Forwarding a header to an external API in a Server Action:
// app/actions.ts
'use server';
import { headers } from 'next/headers';

export async function fetchUserData() {
  const headersList = await headers();
  const authHeader = headersList.get('authorization');
  const res = await fetch('https://api.example.com/data', {
    headers: { 'Authorization': authHeader || '' }
  });
  return res.json();
}
This server action fetches data from an external API. It reads the Authorization header from the incoming request (if present)
nextjs.org
 and passes it along. This way, if the client made the request with a Bearer token, our server action can forward that token to another service. We had to use await headers() to get the headers.
Version notes
Next 16 async requirement: In Next.js 16, cookies() and headers() must be awaited and used in async contexts
nextjs.org
. In Next 13-15, these were sometimes used directly (returning a non-Promise interface). After upgrading, any direct use needs updating. For example, if a component was export default function Page({ params }) { cookies().get('x') }, this is no longer valid – the component likely needs to be async and call await cookies().
Draft Mode and headers(): Next 16 introduced draftMode() for preview/draft content which is accessed similarly (and is also async)
nextjs.org
. If using preview (draft) mode, note that draftMode().enable() returns a response you might merge or so, but that’s an edge case.
NextResponse changes: In earlier Next, one could use NextResponse.cookie(name, value) to set cookies. Now the API is consolidated under response.cookies.set. Also, NextResponse.next() provides access to a cookies getter for reading in middleware (less relevant in route handlers). For App Router route handlers, using the cookie store or NextResponse as shown is the way.
Removal of req.headers.cookie: In Pages Router, one might parse cookies from context.req.headers.cookie. In App Router, use the cookies() function instead. The old approach isn’t available since there is no getServerSideProps context. Similarly, req.headers is not directly accessible in Server Components; you must use headers().
Case sensitivity: The headers() function returns a Headers object with case-insensitive keys (per spec). But when using .get(), provide the header name exactly as expected (e.g. 'authorization' in lower-case, as shown, to avoid issues – though .get() is case-insensitive, it's good practice to match case).
Cookie serialization: Next.js takes care of serializing and sending Set-Cookie headers for you when using response.cookies.set or the cookies() interface. You do not need (and should not) manually set the Set-Cookie header string. Rely on the provided API to avoid formatting mistakes.
Edge runtime differences: If code runs in Edge (middleware), you’d use request.cookies (a Headers-like interface) or request.headers on the NextRequest. But since App Router uses Node by default for most, and since cookies()/headers() support both, you can usually just use those. Just note if writing Edge-specific code, the same await cookies() applies – it’ll still work (Edge returns a response asynchronously as well).
Context7 verification (optional)
“Next.js 16 cookies() usage example” (verify from docs for any nuances in setting multiple cookies or large cookies).
“Next.js 16 headers forwarding in route handlers” (check if any special cases).
“Next.js 16 NextResponse cookies API” (to ensure usage is correct when using NextResponse).
“Next.js App Router secure cookie HttpOnly best practices” (for security recommendations on cookies).
---END FILE---
---FILE: .kanban2code/_context/skills/nextjs-route-handlers.md---
name: nextjs-route-handlers
description: Creating API endpoints in the Next.js App Router (app/api/**/route.ts), correct patterns and pitfalls.
tags: [nextjs, api, route-handler]
version_scope: "Next.js 16.0.10 App Router"
last_verified: "2025-12-18"
triggers:
keywords: ["app/api", "route.ts", "NextResponse.json", "NextRequest", "Response.json", "API route"]
tags: ["nextjs", "api"]
sources:
https://nextjs.org/docs/app/getting-started/route-handlers 
nextjs.org
nextjs.org
https://nextjs.org/docs/app/getting-started/route-handlers 
nextjs.org
nextjs.org
https://nextjs.org/docs/app/getting-started/route-handlers 
nextjs.org
nextjs.org
https://vercel.com/blog/common-mistakes-with-the-next-js-app-router-and-how-to-fix-them 
vercel.com
Next.js App Router – Route Handlers (API Routes)
When to attach
Use for tasks involving creating or editing API endpoints in an App Router project. For example:
“Create an endpoint under /api/data to fetch some data”
“Handle form submission via a POST API route in app directory”
“Migrate a pages/api route to the app directory route handler”
What models frequently get wrong
Using Pages Router patterns: LLMs might produce code like export default function handler(req, res) { ... } (Node-style) or refer to NextApiRequest/NextApiResponse. In the App Router, those are obsolete. Instead, we define Route Handlers with export async function GET/POST/etc in a route.ts file
nextjs.org
nextjs.org
.
Forgetting Response usage: A common error is not returning a proper response. For example, doing some logic but not returning anything (causing a 500), or trying to use res.send() which doesn’t exist. In App Router, you should return either a Response object or a NextResponse from route handlers.
Mixing page and route: Placing a route.ts in the same folder as a page.tsx, expecting both to co-exist. In Next.js, you cannot have a page and a route handler at the same segment – that’s a conflict
nextjs.org
. LLMs sometimes attempt to put API route files next to pages inadvertently.
Not handling methods properly: Route Handlers support specific HTTP methods (GET, POST, etc.). If an unsupported method hits the route, Next auto-returns 405. The model might not implement needed methods or may try to catch all methods with one handler (should define each or use Request object to switch on method if necessary).
Not leveraging streaming or caching when relevant: Some models might not realize that a GET route with no dynamic data is auto-static. Conversely, they might forget to mark dynamic routes as dynamic if needed. Also, not using dynamic = "force-dynamic" or force-static when appropriate, leading to unintended caching or lack thereof
nextjs.org
nextjs.org
.
Trying to use context.params or similar in route handlers: In App Router, the dynamic path parameters are accessible via the file system (e.g. app/[id]/route.ts can use request URL to parse the ID, or use the params from a second argument if using the draft RouteContext). The model might mistakenly expect params to be passed like in Page components.
Using route handlers from client incorrectly: For example, calling internal API routes from a Server Component (which is unnecessary as per best practice)
vercel.com
. Or conversely, using fetch on the client for something that could be a server action.
Do / Don’t (golden rules)
DO:
Use the correct file and function signature: For an API endpoint in the App Router, create a route.ts (or .js) file under the app directory (e.g. app/api/<route>/route.ts)
nextjs.org
. Export an async function for each HTTP method you want to handle: GET, POST, PUT, PATCH, DELETE, etc.
nextjs.org
. For example:
export async function GET(request: Request) { ... }
export async function POST(request: Request) { ... }
Within these, you can use the Web Fetch API (Request and return Response).
Return a Response object: This can be the Web Response (e.g. return Response.json(data) to send JSON with 200) or Next’s NextResponse (which extends Response with cookies, etc.). For JSON, return Response.json(someObject) is convenient
nextjs.org
. If you need to set cookies/headers, use NextResponse.
Read request data appropriately: Use await request.json() for JSON body in a POST/PUT, or request.formData() for form submissions, etc. For query parameters, use request.nextUrl.searchParams (since request.url includes them, parse via URL) or consider using the params from the context if strongly typed via RouteContext (advanced). Often, new URL(request.url).searchParams is enough.
Handle dynamic segments: If your route is dynamic (e.g. app/api/posts/[id]/route.ts), you can get the id from the URL. For instance:
export async function GET(request: Request) {
  const { searchParams, pathname } = request.nextUrl;
  // parse out id from pathname if needed or use URLPattern
}
Alternatively, Next provides a params via context if you define the function signature as GET(request: Request, { params }: { params: { id: string } }) – this is supported as of Next 13.4+ for route handlers.
Use route-specific caching if needed: By default, GET route handlers that produce static data (no dynamic calls) might be prerendered (cached) at build
vercel.com
. If you want to ensure a route is always dynamic (not cached), export export const dynamic = "force-dynamic" in the file. If you want to explicitly cache it, use export const dynamic = "force-static" or specify revalidate as needed
nextjs.org
.
Consider using Server Actions for simple form submissions: If the only purpose of an API route is to handle a form, you might instead use a Server Action directly from a client component (via <form action={actionFn}>)
vercel.com
. But if an API endpoint is needed (for external clients or complex logic), route handlers are correct.
DON’T:
Don’t use Express/Node style in App Router: No module.exports, no req, res from NextApi. The App Router uses the Web standard Request and Response. So avoid res.status(200).json(...) – instead, return a Response with the appropriate status. Example bad pattern:
// ❌ Wrong for App Router
export default function handler(req, res) {
  res.json({ msg: 'Hello' });
}
This will not work in route.ts. Use the correct approach shown above.
Don’t have a page and route at same level: If you have app/dashboard/page.tsx, you cannot have app/dashboard/route.ts – Next.js wouldn’t know whether to treat requests to /dashboard as page render or API. Decide one or the other
nextjs.org
. If you intended to have an API under a path that also has pages, nest it differently (for instance, app/dashboard/api/route.ts with a route group to avoid URL conflict).
Don’t perform long blocking tasks without considering streaming: If your GET route returns a lot of data or takes time, consider streaming the response (Next 13+ allows you to stream using the native Response streams). At least be aware that holding up the route will hold up responses. For large payloads, ensure proper response headers (maybe chunk transfer by default).
Don’t ignore HTTP status codes: Always return appropriate status. If using Response.json(), by default it’s 200. Use return NextResponse.json(data, { status: 201 }) for creation, 400/500 for errors, etc., as fits your scenario.
Don’t call route handlers from Server Components unless absolutely necessary. If you find yourself writing await fetch('http://localhost:3000/api/xyz') inside a Server Component to get data from your own API, that’s usually a mistake
vercel.com
. Instead, directly call the logic (you can refactor the code into a function and use it in both the route handler and the Server Component, or just fetch the data directly in the Server Component). This avoids an unnecessary network hop.
Don’t forget to export all needed methods: If you expect to handle GET and POST, export both GET and POST. If a method isn’t exported, requests with that method will get a 405 automatically. Also, if you want to catch-all or custom methods (like OPTIONS for CORS), you can export those too.
Don’t use middlewares like in pages/: There is no need for cors() or similar as a separate middleware in most cases – you can set headers in the response. If you had connect or other middleware in pages API, port that logic into the route handler or use libraries that work with the standard Request/Response (e.g., you can manually handle CORS by returning appropriate headers in a preflight OPTIONS response).
Checklist (run before coding)
 File placement: Confirm the path for the new API route. It should be in app/[...]/route.ts. Ensure it’s not colliding with an existing page route. If needed, adjust by nesting under an api directory or similar. For example, to add an API under a path that also has pages, use a different segment or a route group.
 Function exports: Write export async function <METHOD>(request: Request, context?: { params?: any }). Use the HTTP method names (GET, POST, etc.) in all-caps as function names. If you need access to dynamic route params easily, include the second parameter and type it (Next provides Params via the context).
 Implement request parsing: If method is POST/PUT/PATCH, use await request.json() (for JSON payload) or request.formData() (for form MIME). If expecting query parameters, get them via request.nextUrl.searchParams. For route params (like /api/users/[id]), either parse from URL or use context params if available.
 Perform logic or call services: Inside the handler, execute the necessary logic (DB queries, business logic, etc.). Keep in mind this runs on the server side, so you can directly access databases, etc., just like any backend code.
 Create Response: Decide on the correct response:
For JSON output, you can do return Response.json(data) which automatically sets Content-Type: application/json and stringifies the object.
Or use NextResponse.json(data) similarly (with ability to set cookies/headers via options).
If returning other content (text, etc.), use new Response('text', { status: 200, headers: {...} }).
 Set status codes & headers: Ensure error cases return appropriate non-200 status codes (404 if resource not found, 400 for bad input, 500 for server error, etc.). You can pass status to Response.json or use NextResponse as mentioned. Add any headers needed (e.g. CORS, caching headers) in the Response init.
 Test multiple methods: If applicable, test that unsupported methods yield a 405. Next will do this automatically if you only export certain methods. (You can customize by exporting an OPTIONS handler if you need CORS preflight responses).
 No res/req usage: Remove any code that tries to use Node’s response (no res.setHeader, no res.status, etc.). Replace with the Web Response API.
 No side-effects on build: If your GET route fetches dynamic data, ensure it’s not accidentally considered static. For instance, if you do a fetch to an external API without any dynamic condition, Next might prerender it at build (treating as static). If that data should be fresh per request, consider marking export const dynamic = "force-dynamic" or include some runtime info (like checking headers() or cookies() which forces dynamic). Conversely, if static is fine, leave it or use force-static. This is important for Next 16 caching behavior.
 Reuse logic if needed: If you have the same logic being used in a server component and the route handler, factor it out to avoid duplication. But note that route handlers have full backend capability and might run in different contexts than server components (which might be pre-rendered). Still, share what you can (e.g., a function to query the DB).
 Documentation and types: Document what your API expects (body shape, etc.) and returns, so others (or the front-end calling it) know. If this API is used by external clients, ensure to handle CORS and authentication inside the handler as needed.
Minimal examples
Basic GET route returning JSON:
// app/api/hello/route.ts
export async function GET() {
  return Response.json({ message: "Hello, Next.js" });
}
This defines a GET route at /api/hello that simply returns JSON. We didn’t need access to the request or params, so we omitted the parameters. Next.js will automatically return a 200 OK with {"message":"Hello, Next.js"} as JSON. GET route with dynamic param and query handling:
// app/api/users/[id]/route.ts
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const userId = params.id;
  const url = request.nextUrl;
  const includePosts = url.searchParams.get('includePosts') === 'true';
  
  const user = await fetchUserFromDB(userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  if (includePosts) {
    user.posts = await fetchPostsForUser(userId);
  }
  return NextResponse.json(user);
}
In this example, the route /api/users/[id] can be called as /api/users/123?includePosts=true. The params.id gives us the user ID from the URL path. We also read a query string includePosts from the request’s URL
nextjs.org
. We fetch the user data (e.g., from a database) and optionally include posts if requested. The response uses NextResponse.json to return the user object, or returns a 404 with a JSON error if the user isn’t found. POST route handling JSON body:
// app/api/todos/route.ts (single handler file handling multiple methods)
import { NextResponse } from 'next/server';

export async function GET() {
  const todos = await listTodos();
  return NextResponse.json(todos);
}

export async function POST(request: Request) {
  const data = await request.json(); // parse JSON body
  const newTodo = await createTodo(data);
  return NextResponse.json(newTodo, { status: 201 });
}
This shows both GET and POST in one route.ts. GET returns a list of todos, POST expects a JSON body to create a new todo. Note how we use await request.json() to get the body content in the POST handler. The POST returns a 201 Created status with the new todo item in JSON.
Version notes
Introduced in Next 13.2+: Route Handlers are the App Router equivalent of pages/api. Ensure your Next version supports it (Next 16 certainly does). They are only available under /app, not under /pages.
No default export: Unlike Pages Router API (which required a default export handler), App Router uses named exports for each method. A default export in route.ts will be ignored or cause an error.
Params context: Next 13.4 introduced an optional context parameter for route handlers that includes { params, request, ... }. We used it in examples above for convenience. This is not strictly required – you can always parse request.nextUrl for params as needed. The context also can include locals for middleware-proxy to route communication, but that’s advanced usage.
Static vs dynamic routes: By default, a GET route handler with no dynamic content is treated similarly to getStaticProps (prerendered at build)
vercel.com
. If you fetch external data within it, Next might prerender that during build unless it detects it as dynamic (e.g. using cookies() or headers() inside will flag as dynamic
nextjs.org
). Next 16’s introduction of Cache Tags and Partial Prerendering means you can opt in/out of caching. Use export const dynamic config flags when needed to override defaults.
Edge runtime option: If for some reason you want an API route to run on the Edge runtime, you can add export const runtime = 'edge' in the file. This will limit what you can do (no Node.js libs), but could be useful for ultra-low latency read-only endpoints. By default, route handlers run on Node (Node 20 in Next 16).
File naming and extensions: The file must be named route.ts or route.js. You can co-locate a test file or other files, but they won’t be automatically picked up as routes. Also note that Next.js treats route.tsx the same as route.ts (you typically wouldn’t have JSX in an API route, but it’s allowed if generating something like SVG or using JSX for some templating).
Special route handlers: Some file names like sitemap.xml/route.ts or robots.txt/route.ts can be used for specific outputs (and Next has some special handling for those). Also, image generation routes (opengraph-image) use RouteSegment config differently. Those are advanced cases; the general behavior remains the same.
Upgrading from pages/api: If you’re migrating code, note that req.query becomes request.nextUrl.searchParams, req.body becomes await request.json(), req.cookies becomes cookies() function, and sending response via res becomes returning a Response. Next provides codemods to help, but understanding these one-to-one changes helps avoid mistakes.
Context7 verification (optional)
“Next.js 16 route handler dynamic vs static” (verify how Next decides to cache route handlers and how to force dynamic).
“Next.js route handler context params” (check if the context usage is fully supported and any quirks).
“Next.js route handlers vs server actions guidance” (to confirm when to prefer one over the other, if needed).
“NextResponse vs Response in route handlers” (to see any differences or gotchas in using one versus the other for certain scenarios, e.g., streaming).
---END FILE---
---FILE: .kanban2code/_context/skills/nextjs-server-actions.md---
name: nextjs-server-actions
description: Using Next.js Server Actions (App Router’s server-side form and event handlers) correctly.
tags: [nextjs, server-actions, form, mutation]
version_scope: "Next.js 16.0.10 App Router"
last_verified: "2025-12-18"
triggers:
keywords: ["use server", "form action", "server action", "startTransition", "router.refresh", "FormData"]
tags: ["nextjs", "forms", "mutation"]
sources:
https://nextjs.org/docs/app/getting-started/updating-data 
nextjs.org
nextjs.org
https://nextjs.org/docs/app/getting-started/updating-data 
nextjs.org
nextjs.org
https://vercel.com/blog/common-mistakes-with-the-next-js-app-router-and-how-to-fix-them 
vercel.com
vercel.com
https://nextjs.org/blog/next-16 
nextjs.org
nextjs.org
Next.js Server Actions – Server-Side Form & Event Handlers
When to attach
Use for tasks that involve form submissions or server-side mutations in App Router, e.g.:
“Handle form submission without a separate API route (Next.js 13+ App Router)”
“Implement a like button that updates a counter server-side”
“Use a Next.js Server Action to create a new record and then refresh the page”
What models frequently get wrong
Defining actions incorrectly: LLMs may forget the 'use server' directive or place server action code inside a Client Component without proper usage. Server Actions must be defined in files marked with 'use server' (or inline in a server file)
nextjs.org
.
Trying to call server actions like regular functions in wrong context: For instance, attempting to call a Server Action from another Server Component during rendering (which won’t execute as an action, since actions are triggered by client interactions). Models might not distinguish that server actions are meant to be invoked via forms or client-side events.
Using outdated or experimental patterns: Early versions required an experimental flag. LLMs might produce outdated syntax or not know that as of Next 16, Server Actions are stable (ensure no need for experimental config in 16).
Not handling post-action UI update: After a Server Action mutates data, the UI might need refreshing. Models often omit calling router.refresh() on the client or using the returned value. This leads to UI not updating with the new data. Similarly, forgetting to use redirect() on server when needed (e.g., after form submission, staying on same page vs redirecting).
Wrapping actions in try/catch incorrectly: A redirect or notFound in a Server Action works by throwing a special exception; if an LLM wraps the action body in try/catch and catches that, it will prevent the redirect. Models might do that, misunderstanding how to handle errors in actions.
Using Server Actions for things not allowed: E.g., trying to use them in Client Components directly (they must be imported from a server file)
nextjs.org
nextjs.org
, or expecting parallel execution (currently, actions are handled serially by React, so you can’t have two actions run truly concurrently from one user event; models might not realize that).
Confusing server actions with getServerSideProps or API routes: Some answers might implement a separate API route for a form, not realizing the simpler action pattern can be used. Or they might mix patterns, like attempting to use useRouter().refresh() inside a server action (not possible; useRouter is client-side).
Neglecting validation/feedback: The model might not consider how to validate form data or inform the user of success/failure. While not strictly about Server Action syntax, it’s part of proper use (e.g., using try/catch inside the action to catch errors and maybe returning an error state, or using useActionState on the client to get pending/error states).
Do / Don’t (golden rules)
DO:
Define server functions with 'use server': Either:
Inline inside a Server Component:
async function saveData(formData: FormData) {
  'use server';
  // ... server logic
}
or
In a separate file (e.g., app/actions.ts) with 'use server' at the top of the file
nextjs.org
nextjs.org
, and export your functions.
Use forms or client events to invoke actions: The simplest is using a <form> element’s action attribute to link to a server action function
vercel.com
. Example:
<form action={saveData}>
  <input name="title" />
  <button type="submit">Save</button>
</form>
This will serialize the form and call saveData(formData) on the server upon submit
vercel.com
vercel.com
. Alternatively, use an event handler in a Client Component and call the action, e.g., await actionFn(data) inside an onClick or similar (often wrapping in startTransition to avoid blocking UI)
vercel.com
vercel.com
.
Make server actions async and receive FormData if from a form: By default, a form action will pass a FormData object. In TypeScript, define your action param as formData: FormData to use it. Extract fields with formData.get('fieldName'). If you need JSON, you could do JSON.parse(formData.get('something') as string) if you encoded JSON, but typically simple fields are fine.
Perform server-side mutations inside the action: e.g., write to a database, send an email, etc. You can also use server-only secrets (like environment variables) here safely. Do all necessary work, then optionally:
Return a value (could be used by client if action is invoked via await in an event handler).
Or call redirect(url) from 'next/navigation' to redirect after completion (this will end the action and redirect the user)
nextjs.org
nextjs.org
.
Or call revalidatePath('/page') or revalidateTag('tag') to update cached data after mutation (especially if you stay on the same page and want fresh data)
nextjs.org
.
On the client, handle post-action state: If using form action= attribute, Next will automatically refresh the route (if Server Components involved) once the action completes. If using an imperative call (like button onClick), wrap the action call in startTransition(() => { actionFn(); }) and then let Next refresh the UI. Or manually call router.refresh() after await actionFn(...) to re-fetch server component data that might have changed.
Use useActionState or UI cues for pending states (if needed): Next 16/React 19 provides useActionState(actionFn) to track pending status. You can also use your own loading state or disable the button while waiting. Provide user feedback for slow actions.
Validate and error-handle on the server: You can throw errors in the server action or return an error result that the client can interpret. For example, throw new Error("Invalid input") which will be caught by Next and could be displayed via an Error Boundary on the client if not caught. Alternatively, return a structured result (like { error: "message" }) and check it on client after await.
DON’T:
Don’t use server actions in Client Components without import: You cannot define a server action in a file that is marked 'use client'. The action must live in a server file and be imported into the client file
nextjs.org
nextjs.org
. So don’t put 'use server' inside a 'use client' file – that’s invalid. Instead, define the action in a separate module or above the 'use client' line.
Don’t call a server action like a normal function during rendering: For example, in a Server Component, do not do await saveData(formData) during render – that wouldn’t go through the action mechanism and likely does nothing useful (or executes immediately without a user event). Server Actions are meant to be triggered by user interactions (post-render).
Don’t forget to handle UI update: If your action modifies data that is displayed on the current page, ensure that the UI is updated. For instance, if you add an item to a list, the list should refresh. This could mean using router.refresh() in a client component after the action or relying on Next’s automatic refresh when using <form action=...>.
Don’t catch redirect() or notFound(): These functions (from next/navigation) when called in a server action throw a special exception that Next uses to redirect or show 404. If you wrap your action code in try/catch and catch that, you will prevent the redirect. Usually, you don’t need a try/catch around the entire action unless you intend to handle errors. Let redirect() and notFound() bubble out.
Don’t assume parallel execution: If two different server actions are triggered at roughly the same time (like two form submissions), React will queue them (the current behavior) – one will execute after the other. So, don’t design your logic assuming they run truly concurrently. If you need parallel, combine into one action or use other methods.
Don’t overuse server actions for data fetching: They are primarily for mutations. For reading data on initial render, use Server Components (or route handlers). For example, don’t make a server action just to fetch data on page load – that’s what fetch in a Server Component is for. Use actions for handling user-triggered events that change data.
Don’t rely on client-side navigation for form actions: If you use <form action={action}>, do not also attach an onSubmit that calls router.push or refresh – let Next handle it. Combining might double-submit or override behavior. Similarly, no need for preventDefault in forms using the action attribute – Next handles that and sends via fetch (unless JavaScript is disabled, then it gracefully degrades to normal form post which the server action can also handle).
Checklist (run before coding)
 Locate or create server action definitions: Decide where to define your server action. If the project has a central app/actions.ts or similar, add there with 'use server'. Otherwise, define it in the same file as a Server Component (above the component code) and include 'use server' at the top of the function body.
 Mark as 'use server': Ensure the server action function has the 'use server' directive immediately at the top of its body (or file)
nextjs.org
. Without this, it won’t be treated as an action.
 Parameter handling: If triggered by a form, function should accept a FormData parameter. If triggered with specific values (from client event), define parameters accordingly. Remember that actions can only accept serializable values or FormData. (You cannot pass a complex non-serializable object or a function as argument from client to server).
 Implement action logic: Write the server-side logic (DB updates, etc.). This code can use try/catch to handle expected errors (like validation) and either throw or return an error state.
 Use navigation helpers if needed: If the action should redirect the user, call redirect('/target') from next/navigation at the appropriate point. If it should simply update data on the same page, consider calling revalidatePath or revalidateTag to update caches
nextjs.org
 (especially if using Cache Tags or have static data). Decide if after action you want to stay or navigate.
 Set up client trigger: If using a form:
Ensure the form is within a Client Component (or a Server Component that doesn’t need client JS, though often you’ll want the form in a Client Component to manage UI state).
Add action={yourServerAction} on the form tag.
Ensure the input names match what your action expects (formData.get('name')).
Possibly add use client at top of component file if using client-side hooks (but a form with action can also be in a Server Component and still work as an progressively enhanced form).
 Or, if using a client event handler: Import the action into a Client Component (e.g., import { saveData } from '../actions';). Call it inside an event callback, e.g.:
const router = useRouter();
const handleClick = async () => {
  await saveData(someValue);
  router.refresh();
};
Wrap in startTransition if the action’s result doesn’t need immediate use, to avoid blocking the UI.
 UI feedback: Optionally, implement loading and error states. If using form actions, consider a <Suspense> boundary above part of UI if needed (though Next will automatically disable the form during the action and re-enable after). For custom event, manage a state like isLoading or use useTransition to track if the action is in flight.
 Error display: If the server action can produce an error message, decide how to surface it. One approach: have the action return a structured result (e.g., { error: "msg" } or on success maybe { result: data }). The client can check the returned value and display an error message accordingly. Alternatively, throw an Error in the action; that will trigger an error boundary on the client side (the UI within the segment will replace with the nearest error.js if unhandled). It might be better to catch in action and return an error object instead, to avoid full page errors.
 Test with and without JS: One cool aspect: if JavaScript is disabled or the JS hasn’t loaded, the form will still submit with a full page reload, and Next will handle it (server action runs and then does redirect or render). Ensure that still gives a reasonable outcome (maybe not focus here, but worth a quick thought: e.g., if you rely on router.refresh(), in no-JS scenario the page would reload anyway).
 Clean up any redundant API routes: If you implement a Server Action for something that an API route was previously handling, ensure you’re not leaving duplicate logic. You likely don’t need a route handler and a server action for the same purpose (unless external access is needed). Simplify where possible.
Minimal examples
Server Action in a separate file (to handle form submit):
// app/lib/actions.ts
'use server';

import { redirect } from 'next/navigation';
import { db } from '@/lib/db'; // hypothetical database import

export async function createPost(formData: FormData) {
  const title = formData.get('title')?.toString();
  const content = formData.get('content')?.toString();
  if (!title || !content) {
    throw new Error('Title and content are required');
  }
  // Save to database:
  await db.post.create({ data: { title, content } });
  redirect('/posts'); // redirect to posts list after creation
}
This defines a server action createPost that takes FormData
nextjs.org
, validates it, creates a new post in the database, and then redirects the user to /posts. The 'use server' directive at top ensures this function is treated as a Server Action. The redirect('/posts') will immediately end the action and send a redirect response to the client
nextjs.org
. Usage in a component:
// app/posts/new/page.tsx (Server Component)
import { createPost } from '@/app/lib/actions';

export default function NewPostPage() {
  return (
    <form action={createPost}>
      <h1>Create Post</h1>
      <input type="text" name="title" placeholder="Title" />
      <br />
      <textarea name="content" placeholder="Content"></textarea>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
}
This page shows a form for a new post. The form’s action is the imported createPost server action
vercel.com
. When the user submits, Next will call createPost(formData) on the server. If the action succeeds, it redirects to /posts, so the user ends up on the posts list. If createPost throws an error (e.g., missing fields), that error would cause this page to crash to the nearest error boundary; we could improve by catching and returning a message instead, but this demonstrates the mechanism. Server Action via client event (with refresh):
// app/components/LikeButton.tsx
'use client';

import { useState, useTransition } from 'react';
import { incrementLike } from '@/app/lib/actions';
import { useRouter } from 'next/navigation';

export function LikeButton({ postId, initialLikes }) {
  const router = useRouter();
  const [likes, setLikes] = useState(initialLikes);
  const [isPending, startTransition] = useTransition();

  async function handleClick() {
    // Optimistically update UI:
    setLikes(likes + 1);
    // Call server action to increment like in database
    startTransition(async () => {
      try {
        await incrementLike(postId);
        router.refresh(); // refresh data (server will send updated likes count)
      } catch (e) {
        console.error(e);
        // Optionally revert optimistic update or show error
        setLikes(likes);
      }
    });
  }

  return (
    <button onClick={handleClick} disabled={isPending}>
      👍 {likes}
    </button>
  );
}
Here, incrementLike is a server action (imported from a server file) that takes a post ID and updates a like count in the database. We use a Client Component for the button because it handles a click. On click, we optimistically increment the local state to give instant feedback, then call the server action inside a startTransition
vercel.com
. The router.refresh() will cause Next to re-fetch any Server Component data on the current page, which could include the authoritative likes count from the database, ensuring the UI is correct. We also disable the button while the transition is pending. If an error occurs, we log it and could handle accordingly (maybe revert the optimistic increment).
Version notes
Stability: Server Actions (also called Server Functions) are stable in Next 16. You no longer need to enable experimental.serverActions. If encountering older patterns where an env flag or special form attributes were needed, know that those are resolved now. Use them out of the box.
"use server" scope: You can put 'use server' at the top of a file to mark all exports as actions (as shown in actions.ts)
nextjs.org
, or before an individual function. Just ensure no client code sneaks into those files, as it won’t run on client.
Forms vs JavaScript: Next’s server actions allow forms to work even without JS (they’ll do a full page reload in that case). If JS is enabled, it intercepts and does a fetch under the hood. This means progressive enhancement is built-in. As a developer, just ensure your action handles multiple calls (idempotency or proper handling of double submissions, etc. might be considered).
Refreshing and new refresh() API: Next 16 introduced a new server-side refresh() function in next/cache for server actions
nextjs.org
nextjs.org
. This is used inside a server action to refresh only uncached data on the page. In practice, you might still use router.refresh() on the client. But know that if you have parts of the UI using Cache Components or similar, refresh() inside the action can be used to update specific parts without a full refetch of everything. This is an advanced optimization; the common approach is simply router.refresh() on the client or targeted revalidation on the server.
Concurrency and order: As mentioned, actions are currently queued. In React 19 / Next 16, this means if two actions fire at nearly same time (e.g., two different forms), they’ll be executed sequentially. This is an implementation detail that may change in the future. It's usually not an issue, but it’s good to avoid assumptions of parallelism.
Using returned values: If a server action returns a value and you call it via await in a client event, you can use that value in your client code. But if you use form action={...}, you can’t directly get the return value (the form submission is not directly giving you a value in client code). In that case, any needed response should be handled via redirected page or by updating state via refresh.
Migration tip: Instead of writing a separate API route for a form submission, you can often just use a server action. This reduces boilerplate (no separate fetch call on client, no separate route file). Keep this in mind if you see the model creating an unnecessary API route where a server action could suffice (provided SEO or external API access isn’t required).
Context7 verification (optional)
“Next.js 16 server actions usage example FormData” (verify usage of FormData in actions from docs).
“Next.js server action redirect vs router.refresh” (when to use which; confirm best practices).
“React useTransition and server actions Next.js” (to ensure our useTransition usage is up to date).
“Next 16 refresh() vs revalidateTag in server actions” (for understanding partial refresh mechanisms if needed).
---END FILE---
---FILE: .kanban2code/_context/skills/nextjs-routing-conventions.md---
name: nextjs-routing-conventions
description: App Router routing structure (pages, layouts, route groups, dynamic segments) and common mistakes.
tags: [nextjs, routing, app-structure]
version_scope: "Next.js 16.0.10 App Router"
last_verified: "2025-12-18"
triggers:
keywords: ["app directory", "layout.tsx", "page.tsx", "route groups", "default.js", "dynamic route", "[...]", "parallel routes"]
tags: ["nextjs", "routing"]
sources:
https://nextjs.org/docs/app/getting-started/project-structure 
nextjs.org
nextjs.org
https://nextjs.org/docs/app/getting-started/layouts-and-pages 
nextjs.org
nextjs.org
https://nextjs.org/docs/app/getting-started/route-handlers 
nextjs.org
nextjs.org
https://nextjs.org/blog/next-16 
nextjs.org
Next.js App Router – Routing & File Structure Conventions
When to attach
Use for tasks about organizing pages or routes in a Next.js App Router project, e.g.:
“Add a new page or section to the Next.js app”
“Fix routing issues – page not found or incorrect path in Next 13+ project”
“Implement nested layouts or dynamic routes in App Router”
What models frequently get wrong
Misplacing files or misnaming them: For example, putting a component in the app directory but naming it Component.jsx instead of page.jsx for a page, or forgetting to include a layout.tsx when needed. The App Router relies on specific filenames (page, layout, loading, error, etc.). Models might also try to use obsolete patterns like _app.js or _document.js which don’t apply in /app.
Confusion between Pages Router and App Router: The assistant might mix concepts. For instance, using pages/ directory conventions (like [id].js or _app.js) in an App Router context. Or using next/router instead of next/navigation for navigation. It might also not use the new nested layouts properly.
Dynamic routes mistakes: Not wrapping dynamic segment names in square brackets or using them incorrectly. For example, naming a folder id instead of [id] for a dynamic route. Or not understanding how [...slug] catch-alls work in App Router (similar to Pages but file naming matters).
Route groups misuse: App Router allows grouping routes without affecting URL using (group) folders. LLMs might not utilize this when needed or might leave the parentheses in path (which wouldn’t happen if used correctly).
Nested layouts misunderstanding: Possibly not creating a layout.tsx where needed to wrap child pages, or conversely creating too many unnecessary layout files. Also, forgetting that each folder can have at most one layout which applies to its subtree.
Parallel routes/default.js issues: Next 16 introduced that parallel route slots require a default.js file
nextjs.org
. A model likely won’t spontaneously use parallel routes unless asked, but might forget the requirement if it does.
Mixing pages and app directories: For projects that still have both (some might during migration), the assistant could incorrectly put new pages in the wrong place. Usually, we stick to one or the other. Models might not detect which one to use.
Not using public directory for assets or special routes: e.g., manually creating app/favicon.ico/page.tsx (which is wrong; should just have a static file in public or use metadata files).
Navigation and linking mistakes: Using <a> tags for internal navigation without Link, or using Link incorrectly. Or failing to handle trailing slashes or basePath in routes if present.
File casing or extension issues: Next expects specific casing (all lowercase file names for these conventions). An LLM might produce Page.tsx capitalized which Next would treat as a separate route or possibly ignore (since convention is lowercase).
Ignoring src/ prefix if project uses it: If the project has src/app/ rather than app/ at root, the model might not notice and put things in the wrong location.
Do / Don’t (golden rules)
DO:
Follow the App Router file conventions strictly:
Pages are page.js/tsx files. Each folder under app/ (other than special ones) typically contains a page to become a route (unless it has subroutes).
Layouts are layout.js/tsx files and wrap pages in the same folder and below. They must render {children}.
Use loading.js for loading states and error.js for error boundaries at segment level as needed.
If you need to group routes without affecting URL, use parentheses in folder name (this folder name won’t appear in route)
nextjs.org
.
One page per segment: Don’t put multiple page.tsx in one folder. If you need multiple pages in same section, that indicates subfolders.
Use nested folders for nested routes: E.g., for a route /dashboard/settings, structure it as:
app/dashboard/layout.tsx    (layout for dashboard section)
app/dashboard/page.tsx      (dashboard index page)
app/dashboard/settings/page.tsx   (settings page)
The dashboard/layout.tsx can wrap both the index and the settings page, providing common UI.
Dynamic route folders: Wrap dynamic segment names in []. For example, app/products/[productId]/page.tsx for /products/123. Inside that page, you get the params.productId prop. Use nested dynamic routes for multiple params.
Catch-all routes: Use [...slug] for catch-all segments. E.g., app/docs/[...segments]/page.tsx could catch /docs/a/b/c under one page. Use params.segments which will be an array of the segments.
Route groups (advanced): If you want to attach a layout to a set of routes without affecting URL structure, use route groups. For example, app/(dashboard)/settings/page.tsx and app/(dashboard)/layout.tsx. The URL doesn’t include (dashboard), but the layout applies to that segment group.
Public assets & special routes: For static files like images or favicon.ico, use the public/ directory (or the Metadata Files convention for icons/manifest etc.). Don’t try to create a page for favicon.ico – Next will serve public/favicon.ico automatically. For SEO files like sitemap.xml or robots.txt, you can use route handlers or static files as needed (Next also supports special files via Metadata Route Handlers).
Use <Link> from 'next/link' for internal navigation in components: It ensures client-side transitions. Use href prop for destination. For programmatic navigation in a client component, use useRouter() from 'next/navigation'.
Check for a root app/layout.tsx: There should be one at the top-level of app/ to define the HTML <head> and <body>. If one doesn’t exist and the model suggests changes to global structure, consider adding or modifying it accordingly rather than trying to use _app.
Parallel routes (rare case): If using parallel routing (multiple concurrent layouts rendering different content in regions), ensure to include a default.js in each parallel route key folder as fallback
nextjs.org
. This is advanced and usually only done if needed.
DON’T:
Don’t introduce Pages Router files (pages/_app.js, etc.) in App Router context: Those are ignored when using app/. For global configuration in App Router, use layout.tsx at root and next.config.js if needed. No _app.js, _document.js, or _error.js (use error.js within app).
Don’t mix pages/ and app/ logic for the same route: Next.js will prefer App Router if a route is defined in both. It can be confusing; better to keep a route in one system. If migrating gradually, ensure the new route is only in one place.
Don’t name components arbitrarily in the app hierarchy: Filenames have meaning. For example, if you create a file app/about/AboutPage.tsx that is not page.tsx, Next will not treat it as a page (it might be considered a default export unused). Instead, name it page.tsx. Non-page components (helpers, etc.) should live outside the app pages structure (e.g., in a components/ directory or as sibling files that aren’t named page/layout).
Don’t forget to include {children} in layouts: Without it, none of the child pages will render inside the layout, likely causing an empty output or error.
Don’t have multiple layouts at the same level: Only one layout.tsx per folder. If you create a layout in a folder that already has one via ancestor route group, etc., structure might be wrong. Typically, each segment has at most one layout wrapping its children segments.
Don’t misuse dynamic routes for optional segments: If a segment is optional, you can use [[slug]] in Pages Router. In App Router, optional catch-all can be [...slug] which can be empty. But an optional single segment (like /foo/[optional]/page.tsx where optional could be missing) isn’t directly supported; handle that with catch-all or separate routes. Models might confuse that.
Don’t manually create not-found handling via conditional rendering in pages: Use Next’s notFound() function or a not-found.js file for 404 UI in a segment. Similarly, don’t manually do redirect in page render for missing data; use redirect() or notFound() from 'next/navigation'.
Don’t put confidential logic in the wrong place: Keep in mind, components in app/ can be Server or Client. By default, they are Server (which is good for secure data). If you put something in a Client Component (marked 'use client'), it all runs in the browser. So for example, if doing an auth check to decide layout, better done in a Server Component (layout or page) rather than a client-only check which can be bypassed.
Checklist (run before coding)
 Identify the routing structure: Determine if the project uses the App Router (app/ directory). If yes, plan to place new pages under app/. If it’s using Pages (pages/ directory) instead, then this skill might not apply (use pages conventions in that case).
 Follow naming conventions: For any new route:
Create a folder matching the route path segment (for nested routes).
Inside it, create page.tsx for the actual page component. If a common layout is needed for subroutes, also create layout.tsx.
Use [param] for dynamic folders, [...] for catch-alls.
Use lowercase filenames for these special files (page, layout, etc.).
 Implement layout if needed: If this new section should share UI (navbars, etc.) with its subpages, add a layout.tsx. Ensure it renders {children} and possibly defines metadata (title) or wrappers. If not, confirm that an upper-level layout will wrap it (the root layout or a parent segment’s layout).
 Insert into navigation properly: If applicable, when adding a new page, also use <Link href="/newpage"> in some navigation component or update menus. Avoid using raw <a> for internal links (to preserve SPA navigation).
 Dynamic route data usage: In a dynamic page (e.g. [id]/page.tsx), prepare to use the params prop (the page component can be export default function Page({ params }) { ... }). In Next 16, note that params may be async if a parent layout is generating static params. Usually, just treat it as an object of strings. If you need type conversion (like an id to number), convert inside the component.
 Route groups if needed: If the user story suggests certain routes share layout but not URL path segment, utilize route groups. E.g., grouping admin routes under (admin) folder to share an admin layout while keeping URL clean. Ensure to include layout.tsx in the group folder and place pages in subfolders outside the group name.
 Parallel or conditional routes: (Advanced, seldom needed). If implementing something like a side-by-side parallel routes (e.g., two independent pieces of UI on one page from different segments), set up parallel route keys and a default.js. Only do this if explicitly required; it’s a complex feature.
 Special files: If implementing a favicon or metadata images, use the app/ico.ico or app/manifest.json or app/opengraph-image.tsx as per Next’s Metadata Files guidelines, or just place static files in public/. Don’t create pages for those.
 Testing route: After setting up, run the dev server and navigate to the new route to ensure it’s reachable and renders. Check nested routes too. If you see a 404, verify folder names and that you didn’t accidentally miss a page.tsx or have a typo in dynamic folder name.
 Remove legacy references: If the model wrote something about _app or withRouter, remove those in App Router context. Similarly, ensure no lingering pages/ references if we fully moved to app/.
Minimal examples
Project structure example:
app/
 ├─ layout.tsx          // Root layout (HTML, <body>)
 ├─ page.tsx            // Homepage
 ├─ about/
 │   └─ page.tsx        // /about page
 ├─ dashboard/
 │   ├─ layout.tsx      // Dashboard layout (e.g., sidebar for all dashboard pages)
 │   ├─ page.tsx        // /dashboard main page
 │   └─ settings/
 │        └─ page.tsx   // /dashboard/settings page, uses dashboard layout
 ├─ products/
 │   ├─ [id]/
 │   │    └─ page.tsx   // /products/{id} dynamic product page
 │   └─ page.tsx        // /products listing page
 ├─ (marketing)/
 │   ├─ layout.tsx      // Layout for marketing pages (route group, not in URL)
 │   └─ pricing/
 │        └─ page.tsx   // /pricing page, uses marketing layout
 ├─ api/
 │   └─ hello/route.ts  // /api/hello API route (route handler)
 └─ error.tsx           // Root error boundary for unhandled errors
This structure shows various features: static routes (about, pricing), dynamic routes (product [id]), nested routes with layouts (dashboard section), and a route group (marketing) that groups pages like pricing under a common layout without affecting the URL. It also includes an API route example. This is just to visualize how files map to URLs. Linking between pages:
// app/components/Navbar.tsx (Client Component for navigation)
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();
  return (
    <nav>
      <Link href="/" className={pathname == '/' ? 'active': ''}>Home</Link>
      <Link href="/about" className={pathname == '/about' ? 'active': ''}>About</Link>
      <Link href="/dashboard" className={pathname?.startsWith('/dashboard') ? 'active': ''}>Dashboard</Link>
      <Link href="/pricing" className={pathname == '/pricing' ? 'active': ''}>Pricing</Link>
    </nav>
  );
}
This example shows a simple navigation component using <Link> for internal routes and usePathname to highlight the active link. It’s important to use Link for internal links. The paths correspond to the pages structured in app/. The Navbar can be included in the root layout or specific layouts. Dynamic page example:
// app/products/[id]/page.tsx
import { notFound } from 'next/navigation';

type ProductPageProps = { params: { id: string } };

export default async function ProductPage({ params }: ProductPageProps) {
  const productId = params.id;
  const product = await getProductById(productId);
  if (!product) {
    notFound(); // triggers app/not-found.js or default 404
  }
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
    </div>
  );
}
This dynamic page uses params.id to fetch a product. If no product is found for that ID, it calls notFound(), which will render the nearest not-found.js page (or the Next.js default 404 if none provided). Ensure the folder name is [id] exactly to match the dynamic segment. Because we’re using await and potentially fetching data, the component is marked async and we can fetch on the server before rendering.
Version notes
Next 16 requirement for default.js in parallel routes: If you are using parallel routes (multiple slots in a layout), note that Next 16 requires a default.js file for any parallel route that doesn’t have a specific route. If not using parallel routes (most common scenarios don’t), you can ignore this. Parallel routes appear in very advanced use-cases (like multiple independent layouts side by side).
src/ directory usage: Next.js allows putting app inside a src/ folder (e.g., src/app/). The conventions remain the same. Just be aware of where the app directory is. If something isn’t working, verify the path.
Upgrading to 16 layout changes: Next 16 enforced that all parallel route slots have a default.js (as mentioned)
nextjs.org
 and also removed some deprecated config options. Route conventions themselves remained stable from Next 13.4 through 16.
File-based 404 and error handling: You can add a app/not-found.js to globally handle 404s (rendered when notFound() is called). Similarly, root app/error.js catches unhandled errors. In Next 15/16, this is the way to customize those; the old _error.js from Pages router is not used.
Metadata API: App Router supports exporting metadata or generateMetadata in pages and layouts, or using special files (favicon.ico, icon.png, etc.). This influences SEO and head tags. If a model suggests using <Head> component in App Router, that’s outdated – instead one uses the metadata fields or layout for head elements.
Trailing slash and basePath: If the project has trailingSlash: true or a basePath in next.config.js, it affects URLs. Typically, we assume default (no trailing slash). LLM might not consider this unless context given.
Case sensitivity: The file system routing in Next is case-sensitive on most systems. Ensure consistency. E.g., about/page.tsx vs About/page.tsx – the latter could cause issues. Always use lowercase for folder names and special files. Components inside can be uppercase named exports, that’s fine.
Symlinks or special OS issues: Rarely, if you develop on Windows, paths are case-insensitive, which could hide an issue until deployed on Linux. So it’s a good practice to always stick to the convention to avoid surprises.
Context7 verification (optional)
“Next.js 16 app directory routing conventions” (to confirm any nuance introduced in v16).
“Next.js route groups and layouts usage” (if using route groups, double-check from official docs).
“Next.js dynamic routes App Router params” (for the usage of params in Next 16, as it mentions sync vs async).
“Next.js upgrading from pages to app router pitfalls” (ensuring no leftover usage of old patterns like Head or next/router).
---END FILE---
---FILE: .kanban2code/_context/skills/nextjs-caching.md---
name: nextjs-caching
description: Data fetching cache and revalidation in Next.js App Router (fetch caching, ISR, revalidateTag, etc.).
tags: [nextjs, data-fetching, caching]
version_scope: "Next.js 16.0.10 App Router"
last_verified: "2025-12-18"
triggers:
keywords: ["fetch cache", "revalidate", "stale-while-revalidate", "ISR", "updateTag", "revalidateTag", "force-static", "force-dynamic"]
tags: ["nextjs", "caching"]
sources:
https://nextjs.org/blog/next-16 
nextjs.org
nextjs.org
https://nextjs.org/blog/next-16 
nextjs.org
nextjs.org
https://nextjs.org/docs/app/getting-started/caching-and-revalidating 
nextjs.org
nextjs.org
https://vercel.com/blog/common-mistakes-with-the-next-js-app-router-and-how-to-fix-them 
vercel.com
vercel.com
Next.js App Router – Data Caching & Revalidation
When to attach
Use for tasks involving data fetching strategy or ensuring fresh/stale data in Next.js 13+ App Router, e.g.:
“Use revalidation so that data updates every X seconds”
“Ensure updated content is shown after posting new data (Next.js caching issues)”
“Implement ISR (Incremental Static Regeneration) or SWR in App Router”
What models frequently get wrong
Assuming old defaults: In Next 13 App Router, fetch was cached by default (static) unless otherwise specified. Next 16 changed this – now all code runs dynamically unless explicitly cached
nextjs.org
. Models might not realize that the default caching behavior shifted, or they might incorrectly use getStaticProps which doesn’t exist in App Router.
Misusing revalidate options: For example, using export const revalidate = 60 in a page and expecting it to always work. (In App Router, export const revalidate is still supported on a page or route handler to set a default revalidation period for that route, but model might not place it correctly or confuse it with older NextJS.)
Not using the new tag-based or path-based revalidation: Next 16 introduced revalidateTag() and updateTag() for fine-grained control
nextjs.org
. Models might not use these at all, or still suggest res.revalidate() (which was a Next 12-13 function for ISR in API routes).
Forgetting to refresh data after mutations: After a server action or API call that changes data, the model might not trigger any revalidation or refresh, causing the UI to show stale data. Should use router.refresh() on client or revalidatePath/revalidateTag on server.
Confusing noStore and dynamic: The model might not differentiate between data that should never be cached (use { cache: 'no-store' } or unstable_noStore directive) vs data that can be cached but needs periodic revalidation (SWR). Or they might overuse no-store where revalidate: n would suffice, losing performance benefits.
Using SWR/react-query in scenarios where Next can handle it: While those libraries are still fine for client state, for SSR data Next’s built-in caching can cover many use-cases. The model might default to recommending SWR for everything, even when a simple Next fetch with revalidate would do.
Neglecting partial rendering / suspense considerations: If using cache: 'force-cache' or similar, parts of the page might become static. If a model suggests mixing static and dynamic without proper Suspense boundaries, it might not consider that Next will statically generate until hitting a dynamic piece.
Overcomplicating caching logic: Possibly recommending manual filesystem cache or very custom logic when Next’s primitives suffice. E.g., using unstable_cache() manually when not needed, or server-side memory cache, etc.
Not understanding use cache directive (Next 16): Next 16’s Partial Pre-rendering allows 'use cache' inside a function to cache its result across requests
nextjs.org
nextjs.org
. The model might not know this new pattern, or might still mention the removed experimental.ppr.
Ignoring draft mode / preview: If in context, preview mode (now called draftMode) bypasses caching. Models might not mention that if relevant.
Do / Don’t (golden rules)
DO:
Decide static vs dynamic per data fetch:
If data can be considered static (changes rarely or you want build-time generation), let Next cache it. In Next 16, by default all fetches are treated as dynamic (no-store) unless explicitly told. To opt into caching, you can use fetch(url, { next: { revalidate: N } }) to cache and revalidate after N seconds (like ISR), or fetch(url, { cache: 'force-cache' }) to cache indefinitely (like getStaticProps without revalidate).
If data must always be fresh (e.g., user-specific or rapidly changing), use cache: 'no-store' (or simply rely on default dynamic behavior in Next 16) to fetch every request.
Use export const revalidate = N in a Page or Layout component to set a default revalidation time (in seconds) for that route. For example, export const revalidate = 60; in a page will cache the page's fetches for 60 seconds. This is an easy way to enable ISR at the page level.
Use tag-based revalidation for granular updates: Next 16 introduced Cache Tags. If you label your fetches with tags and want to invalidate those caches after a certain mutation, use revalidateTag('tagName') in server actions or route handlers to trigger SWR on next request
nextjs.org
. Also, you can call updateTag('tagName') in an action to flush cache immediately for read-after-write consistency
nextjs.org
 (similar to ensuring a mutation is immediately reflected).
When fetching, include tags: e.g., fetch(url, { next: { tags: ['posts'] } }). After adding a new post via an action, call revalidateTag('posts') to mark that cache as stale
nextjs.org
.
Use router.refresh() on client after mutations: If using Server Actions or client-side mutations that change data displayed on the page, call router.refresh() (from next/navigation) to re-fetch and update Server Component data.
Leverage draftMode for preview content: If implementing a preview mode (non-cached), use Next 13.4’s draftMode().enable() in an API route or action, which sets cookies to bypass caching. In draft mode, all fetches act like no-store. Remember to call draftMode().disable() to resume normal caching. This replaces Preview Mode.
Mark long-persistent data as static explicitly if needed: You can use the 'use cache' directive and cacheLife() API in Next 16 to persist data across requests and even across builds for certain pieces of data (advanced Partial Prerendering usage)
nextjs.org
nextjs.org
. If not using these, simply know that static data should be fetched with force-cache or a large revalidate interval.
Consider stale-while-revalidate durations: Next caches with revalidate let you serve cached data while fetching the new data in background. Understand that if you set revalidate: 60, data might be up to 60 seconds stale. Set appropriate times or provide user a refresh UI if needed.
Purge caches on deployment if needed: Typically, Next will treat a new build as a cache invalidation for static data. But tag-based caching can persist beyond builds if using persistent cache (like on Vercel). Use tags to manage that, or know that revalidate intervals start fresh on new deploy.
DON’T:
Don’t use getStaticProps/getServerSideProps: They do not exist in App Router (those are for Pages Router). Instead, use the mechanisms above in your components or route handlers. For example, don’t create a separate fetchData() function to simulate getServerSideProps – just fetch in the component or use a route handler if appropriate.
Don’t fetch internal APIs from Server Components by default: If you have an internal API route (e.g., app/api/data), calling await fetch('http://.../api/data') in a Server Component adds overhead and caching complexity
vercel.com
. Instead, move that logic directly into the Server Component or use a shared function. (Exceptions: if using middleware or need to unify logic, but generally avoid self-fetching).
Don’t forget to revalidate after mutations: If you insert/update something via an API or Action and do not revalidate or refresh, users may see stale data indefinitely. Always pair mutations with a cache invalidation (tag or path) or a client refresh.
Don’t over-cache user-specific data: For example, data that differs per user (like their notifications) should not be globally cached. Use cache: 'no-store' for those fetches, or incorporate a unique segment (like userId in path or cookies) which effectively makes Next treat it separately. Also be mindful that if you do tag caching for user-specific data, tag by user (like tag notifications_user_123).
Don’t try to manually cache via global variables: Next’s hot reload and serverless functions can break such caches. Use Next’s provided caching or edge caches. If absolutely needed, use the unstable_cache function (which wraps fetch caching logic) but usually stick to fetch options.
Don’t assume default caching is static in Next 16: It’s opposite – by default, data is not cached (unless it’s static at build). So if you want old behavior (like automatically caching fetches), you must opt in. Conversely, if reading older advice that “fetch is cached by default”, that applied to older versions; adjust for Next 16.
Don’t ignore errors in fetch with caching: If using ISR and a revalidate fetch fails, Next will continue serving stale content. This is fine (SWR), but log or handle errors so you know if data is outdated because of failures.
Checklist (run before coding)
 Determine data volatility: For each data source, ask: Does it change often? Does it need to be real-time? Can it be slightly stale?
 Set caching strategy per fetch:
Use cache: 'no-store' or { next: { revalidate: 0 } } for data that must always be fresh (or just allow default Next 16 behavior for dynamic bits).
Use { next: { revalidate: N } } for data that can be cached and updated every N seconds (ISR).
Use 'force-cache' (or a long revalidate, or static generation) for content that essentially never changes (or only on deployment).
If using use cache in Next 16, place it in functions around expensive calculations to memoize them.
 Implement revalidation after mutations:
If using route handlers for mutations, call revalidatePath('/some/page') if the page data is cached but needs updating
nextjs.org
. For example, after adding a blog post via /api/posts, do revalidatePath('/blog').
Or better, use revalidateTag('posts') if you tagged the fetches. Determine a tagging scheme (like 'posts' for list, 'post-123' for item) and use accordingly.
In server actions, similarly call revalidateTag or revalidatePath at end of the action.
On the client side, ensure to call router.refresh() if the component relies on cached data that changed.
 Use export const revalidate on pages if you want a simple approach for ISR for the whole page. E.g., set revalidate = 300 to make Next regenerate the page at most every 5 minutes.
 Check for accidental static rendering: If you find that a page is not updating even without explicit caching, maybe Next thought it was static. This can happen if no dynamic triggers are present. Solutions: add export const dynamic = 'force-dynamic' to ensure it’s always server-rendered at request (not cached), or ensure some dynamic element like a cookie/header access is used (which marks it dynamic).
 Draft/Preview mode if needed: If working with a CMS where preview is needed, incorporate draftMode (previously preview). For example, in an API route, call draftMode().enable(). When draft mode is on, Next will bypass all caching and revalidation, giving you freshest data (useful for preview). Ensure to disable it when exiting preview.
 Consider user experience for stale data: If using ISR, the first request after stale will trigger revalidate in background. This means one user might get stale data while it's refreshing. Usually acceptable, but if not, consider shorter intervals or manual refresh triggers. Also, you can use the onInvalidate callback with router.prefetch if needed to know when data became stale.
 Logging and monitoring: Add logs or debug info in dev to confirm when data is fetched vs coming from cache. Next dev mode might refetch every time (not caching), so test in production mode if possible.
 Edge caching (CDN-level): Next automatically caches static pages on the Edge. For dynamic with revalidate, it also caches on the Vercel Edge for that duration. Know that revalidateTag invalidation will propagate through the system (supported on Vercel). If self-hosting, ensure the cache invalidation mechanism (like fallback to on-demand revalidation via API route) is set up if needed.
Minimal examples
Enabling ISR on a page (simplest):
// app/blog/page.tsx
export const revalidate = 60;  // cache this page for 60 seconds

export default async function BlogPage() {
  const res = await fetch('https://example.com/api/posts');
  const posts = await res.json();
  // ... render posts list
}
This will statically generate the blog page and then revalidate the data every 60 seconds. So at most 1 minute of staleness. Next will serve cached HTML for requests within that window, and refresh in background after it expires. Tag-based caching and revalidation:
// app/blog/page.tsx
export default async function BlogPage() {
  const postsRes = await fetch('https://example.com/api/posts', { 
    next: { tags: ['posts'] } 
  });
  const posts = await postsRes.json();
  // ...render list
}
On this page, we tag the fetch with 'posts'. It will be cached indefinitely until invalidated. Suppose we have a Server Action that adds a new post:
// app/blog/actions.ts
'use server';
import { revalidateTag } from 'next/cache';

export async function addPost(data: FormData) {
  const title = data.get('title');
  // ... create post in DB or external API
  revalidateTag('posts');  // mark the 'posts' cache as stale:contentReference[oaicite:161]{index=161}
}
After calling addPost (via a form or onClick), Next will know the 'posts' cache is invalid. The next request to /blog will trigger a re-fetch of posts. If the user is still on the page, you’d likely call router.refresh() so they see the new post immediately. Using cache options in fetch:
// app/stats/page.tsx
export const dynamic = 'force-dynamic'; // ensure dynamic (if needed)

export default async function StatsPage() {
  const dataRes = await fetch('https://example.com/stats', { cache: 'no-store' });
  const stats = await dataRes.json();
  // ... render stats that must be up-to-date each request
}
Here we explicitly disable caching for this fetch. Every request to /stats will fetch fresh data (no caching). We mark dynamic just to be explicit (though cache: 'no-store' implies dynamic anyway). Partial revalidation with revalidatePath (path-based): If we update some data that affects a specific route, you can call:
import { revalidatePath } from 'next/cache';

revalidatePath('/blog');  // will cause /blog page to refresh next time (similar to getStaticProps revalidate on-demand)
This is useful if you don't have tags but know which pages need updating.
Version notes
Default behavior changes in Next 13.4+: Initially, App Router’s fetch default was cache: 'force-cache' (like static) unless you used cache: 'no-store' or certain conditions. Around Next 13.4, this changed to cache: 'no-store' by default for dynamic contexts, and Next 16 completed the shift to opt-in caching
nextjs.org
. So older content might say “fetch is cached by default” – not true in Next 16; now it’s dynamic unless specified.
unstable_ functions stabilized: unstable_revalidatePath, unstable_revalidateTag etc., are now just revalidatePath, revalidateTag (as of Next 13.4+). The model might mention unstable variants, but use stable ones in Next 16.
use cache directive: Introduced in Next 16 for partial rendering and advanced caching inside functions
nextjs.org
. Still a new feature; essentially, it lets you memoize function results similarly to React’s RSC cache. Use it for expensive computations or fetches that don’t need to run every request. It requires careful use of cacheLife to set SWR durations.
No more getStaticProps fallback in App Router: In Pages Router, if page had no data fetching method, Next did static generation by default (Automatic Static Optimization). In App Router, a page is static only if all data it uses can be determined at build (no dynamic calls, no draft mode). Many pages will be dynamic by default now, which is fine.
On-demand revalidation (older Next 12 feature): In Next 12, one could call a secret API route to revalidate paths (for ISR). In App Router, we use revalidatePath and revalidateTag instead of hitting an API route manually. On Vercel, these calls propagate to the edge automatically.
Cache invalidation timing: revalidateTag marks stale immediately, so next request triggers refresh. updateTag can be used in an Action to synchronously update cached data if you have it (rarely used)
nextjs.org
. If you need immediate UI update after an action, often easier to just router.refresh() which refetches everything unaffected by caching rules.
Prefetching and staleness: Next’s <Link> prefetch will pre-render pages and cache them. If you have revalidate set, the prefetched data might be stale by the time user clicks. Next addresses this by an onInvalidate callback on router.prefetch (you can provide to refetch if stale)
nextjs.org
nextjs.org
. This is advanced; just note that prefetch uses the same cache, and stale-while-revalidate helps keep it from serving very old data.
Context7 verification (optional)
“Next.js 16 fetch caching default behavior” (verify documentation on how fetch is treated in App Router).
“Next.js revalidateTag and updateTag usage example” (to ensure correct understanding of tag usage).
“Next.js use cache directive Partial Prerendering” (for info on that new model if needed).
“Draft Mode Next.js 13.4” (for ensuring preview mode usage if relevant).
---END FILE---
---FILE: .kanban2code/_context/skills-index.json---
{
"rules": {
"max_total": 3,
"max_core": 1,
"max_conditional": 2
},
"core": [
{
"id": "nextjs-core-skills",
"file": ".kanban2code/_context/skills/nextjs-core-skills.md",
"priority": 5,
"triggers": {
"keywords": ["Next.js", "App Router", "Next16", "Next 16", "pages/app"],
"tags": ["nextjs"]
},
"notes": "Always include core Next.js App Router best practices."
}
],
"conditional": [
{
"id": "nextjs-proxy-middleware",
"file": ".kanban2code/_context/skills/nextjs-proxy-middleware.md",
"priority": 4,
"triggers": {
"keywords": ["middleware", "proxy.ts", "NextResponse", "NextRequest", "rewrite", "redirect"],
"tags": ["middleware", "routing", "nextjs"]
},
"notes": "Attach when user asks about middleware, proxy, or request interception in Next.js 16."
},
{
"id": "nextjs-cookies-headers",
"file": ".kanban2code/_context/skills/nextjs-cookies-headers.md",
"priority": 5,
"triggers": {
"keywords": ["cookies()", "headers()", "Set-Cookie", "NextResponse.cookies", "authorization header", "session"],
"tags": ["auth", "cookies", "headers", "nextjs"]
},
"notes": "Attach for tasks managing cookies, headers, or authentication data in Next App Router."
},
{
"id": "nextjs-route-handlers",
"file": ".kanban2code/_context/skills/nextjs-route-handlers.md",
"priority": 5,
"triggers": {
"keywords": ["app/api", "route.ts", "NextResponse.json", "NextRequest", "API route", "Response.json"],
"tags": ["api", "nextjs"]
},
"notes": "Attach when working with API routes in the App Router (app/api route handlers)."
},
{
"id": "nextjs-server-actions",
"file": ".kanban2code/_context/skills/nextjs-server-actions.md",
"priority": 4,
"triggers": {
"keywords": ["use server", "form action", "server action", "router.refresh", "FormData", "onSubmit"],
"tags": ["forms", "mutation", "nextjs"]
},
"notes": "Attach for tasks about Next.js 13+ Server Actions (server-side form handling or mutations)."
},
{
"id": "nextjs-routing-conventions",
"file": ".kanban2code/_context/skills/nextjs-routing-conventions.md",
"priority": 5,
"triggers": {
"keywords": ["app directory", "layout.tsx", "page.tsx", "route groups", "dynamic route", "parallel routes", "_app.js"],
"tags": ["routing", "nextjs"]
},
"notes": "Attach for questions about file structure, route creation, layouts, and navigation in App Router."
},
{
"id": "nextjs-caching",
"file": ".kanban2code/_context/skills/nextjs-caching.md",
"priority": 3,
"triggers": {
"keywords": ["fetch cache", "revalidate", "ISR", "updateTag", "revalidateTag", "force-static", "no-store"],
"tags": ["data-fetching", "caching", "nextjs"]
},
"notes": "Attach when user asks about data fetching strategies, ISR, revalidation, or caching in Next App Router."
},
{
"id": "nextjs-loading-error-boundaries",
"file": ".kanban2code/_context/skills/nextjs-loading-error-boundaries.md",
"priority": 3,
"triggers": {
"keywords": ["loading.js", "error.js", "error boundary", "Suspense", "notFound()", "fallback UI"],
"tags": ["nextjs", "error-handling", "loading"]
},
"notes": "Attach for tasks about loading spinners or error handling in Next.js App Router (loading.js, error.js, Suspense boundaries)."
},
{
"id": "nextjs-metadata",
"file": ".kanban2code/_context/skills/nextjs-metadata.md",
"priority": 2,
"triggers": {
"keywords": ["metadata", "head tags", "SEO", "generateMetadata", "openGraph", "next/head"],
"tags": ["nextjs", "seo", "metadata"]
},
"notes": "Attach when the question involves setting page metadata, title/description, or using head tags in App Router."
}
]
}
---END FILE--- ---FILE: .kanban2code/_context/skills-catalog.md---
Next.js App Router Skills Catalog
Below is a list of skill files for Next.js App Router, with a brief description of each and when to use them:
nextjs-core-skills – Core Next.js App Router Best Practices.
When to use: Always include for any Next.js App Router-related task. Covers fundamental conventions: server vs client components, data fetching defaults, verifying project structure, and awareness of Node/Edge runtime specifics
nextjs.org
nextjs.org
.
nextjs-proxy-middleware – Request Interception (Proxy/Middleware) in Next 16.
When to use: If the task involves global request handling, URL rewrites/redirects, or mentions "middleware" or NextResponse. Provides rules for using the new proxy.ts (Node.js middleware replacement)
nextjs.org
 and common pitfalls like runtime constraints and matcher configuration.
nextjs-cookies-headers – Managing Cookies & Headers (Server vs Client).
When to use: If the question deals with authentication tokens, reading/writing cookies, or forwarding headers. Explains Next.js 16’s async cookies() and headers() APIs
nextjs.org
, secure cookie setting via NextResponse, and avoiding client-side cookie misusage.
nextjs-route-handlers – API Routes in App Router (Route Handlers).
When to use: For tasks about building API endpoints under app/api. Covers how to use route.ts files with GET/POST exports
nextjs.org
, returning NextResponse/Response, and differences from legacy pages/api. Use this when user asks about creating or fixing API routes in Next 13+.
nextjs-server-actions – Server Actions for Forms & Mutations.
When to use: When the task is about form submissions, onClick handlers that run server code, or mentions the 'use server' directive. This skill covers using Next.js Server Actions (no separate API route needed)
nextjs.org
, ensuring 'use server' is declared, and how to refresh UI or redirect after an action.
nextjs-routing-conventions – App Router File Structure & Navigation.
When to use: For questions on adding pages, nesting routes, dynamic paths, route groups, or layout files. Provides guidelines on file naming (page.tsx, layout.tsx, [param] folders)
nextjs.org
 and common mistakes like mixing old _app.js or misplacing files.
nextjs-caching – Data Fetching Caching & Revalidation.
When to use: If user asks about stale data, revalidate, ISR (Incremental Static Regeneration) or SWR (stale-while-revalidate) in App Router. Explains Next 16’s default dynamic fetching
nextjs.org
, usage of revalidate options, revalidateTag() for tag-based cache invalidation
nextjs.org
, and router.refresh() after mutations.
nextjs-loading-error-boundaries – Loading & Error UI Patterns.
When to use: When the task involves showing loading spinners during data fetch or handling errors. Discusses using app/(segment)/loading.js for suspenseful loading states and error.js for error boundaries, plus using notFound() and redirect() in server components appropriately.
nextjs-metadata – Managing Metadata (SEO) in App Router.
When to use: If the question is about setting page titles, meta tags, <head> content, or Open Graph images in Next.js 13+. Covers the metadata export, generateMetadata function
nextjs.org
, and replacing old next/head usage with the new App Router metadata API.
Each skill file provides targeted guidance with DOs/DON’Ts, checklists, examples, and relevant Next.js 16 changes. Include the ones relevant to the user’s question for optimal answers.



