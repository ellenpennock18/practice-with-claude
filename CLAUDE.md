# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Next.js + Turbopack)
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Run Vitest tests
npm run setup        # Install deps + generate Prisma client + run migrations
npm run db:reset     # Reset SQLite database
```

## Environment

Copy `.env` and set:
- `ANTHROPIC_API_KEY` — if unset, falls back to a mock provider that returns static example components
- `JWT_SECRET` — defaults to `"development-secret-key"` in dev

## Architecture

UIGen is an AI-powered React component generator with live preview. Users describe components in a chat interface; Claude generates code into a virtual file system; a sandboxed iframe renders the result in real time.

### Request flow

1. User sends message in `ChatInterface` → `ChatContext` calls `/api/chat`
2. `/api/chat/route.ts` streams a `streamText` response using two tools: `str_replace_editor` and `file_manager`
3. Both tools operate on the **virtual file system** (in-memory tree, `src/lib/file-system.ts`)
4. Tool call results stream back to the client; `FileSystemContext` applies them
5. `PreviewFrame` watches `refreshTrigger`, converts virtual files to an import-map + Babel-transformed HTML, and reloads the sandboxed iframe
6. For authenticated users, project state (messages + FS) is persisted to SQLite via Prisma

### Key layers

| Layer | Location | Notes |
|---|---|---|
| AI tools | `src/lib/tools/` | `str-replace.ts`, `file-manager.ts` — operate on virtual FS |
| System prompt | `src/lib/prompts/generation.tsx` | Instructs Claude: entry point is `/App.jsx`, use Tailwind, `@/` alias |
| AI provider | `src/lib/provider.ts` | Returns Claude (`claude-haiku-4-5`) or `MockLanguageModel` |
| Virtual FS | `src/lib/file-system.ts` | In-memory tree; serialized to JSON for DB storage |
| JSX transform | `src/lib/transform/jsx-transformer.ts` | Babel + esm.sh import map for iframe rendering |
| Auth | `src/lib/auth.ts`, `src/middleware.ts` | HS256 JWT in HTTP-only cookie, 7-day expiry, bcrypt passwords |
| DB | `prisma/schema.prisma` | SQLite; models: `User`, `Project` (messages + data stored as JSON strings) |
| State | `src/lib/contexts/` | `FileSystemContext` (FS + refresh), `ChatContext` (messages + AI chat hook) |

### Path alias

`@/*` maps to `src/*`.

### AI configuration

- Model: `claude-haiku-4-5` (or mock)
- Max steps: 40 (4 for mock)
- Streaming with ephemeral cache; 120s API route timeout
- Anonymous users can use the app without auth; projects tied to `userId: null`

### Testing

Tests live in `__tests__` folders alongside their modules. Run a single test file:

```bash
npm run test -- src/lib/__tests__/file-system.test.ts
```
