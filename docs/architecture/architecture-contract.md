# Architecture Contract

This document explains the architecture documentation system for QueCargan, intended for the Architect agent and AI tools.

## Why This System Exists

The monolithic architecture file grew to 1,900+ lines (144KB). AIs were forced to consume the entire file to answer narrow questions, wasting context. This system replaces that with a **scannable index + focused domain files**.

## How It Works

1. **Read `architecture-index.json` first** — it is the single entry point. It lists every domain, its purpose, key files, and triggers.
2. **Identify which domains are relevant** to the task based on keywords and key_files.
3. **Read only the relevant domain `.md` files** — each is focused and short.
4. **Do not read everything** — the index is designed to make full-file reading unnecessary for most tasks.

## File Map

```
docs/architecture/
├── architecture-index.json     ← START HERE (machine-readable index)
├── architecture-contract.md    ← This file (how to use the system)
├── overview.md                 ← Tech stack, conventions, env vars
├── routing.md                  ← Localization, routes, discovery filters
├── database.md                 ← Schema, migrations, storage, Drizzle
├── auth.md                     ← Supabase auth, sessions, RLS
├── reviews.md                  ← Full review system (wizard, DB, AI, API)
├── compare.md                  ← Compare feature (state, AI verdict, UI)
├── testing.md                  ← Test stack, conventions, mocking patterns
└── deployment.md               ← Coolify, security headers, env vars
```

## Canonical Source of Truth

`docs/architecture/` is the **single canonical architecture reference**. Do not maintain parallel architecture documentation in other locations (e.g., `.kanban2code/_context/architecture.md` should delegate here).

## Keeping It Up To Date

When implementing a task:
- If you add new files to a domain → update the relevant `key_files` in `architecture-index.json` and the domain `.md`
- If you add a new domain (e.g., notifications, payments) → create a new `domain.md` + add an entry to `architecture-index.json`
- If a section grows beyond ~150 lines → split into a sub-document

## For the Architect Agent

When designing a new feature:
1. Check `architecture-index.json` for affected domains
2. Read only the relevant domain files
3. Note any new files that will be created so they can be added to the index after implementation
4. Specify which domain's `key_files` list will need updating in your task's **Files** section
