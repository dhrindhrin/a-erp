# a-erp

Next.js 16 (App Router, TypeScript, Tailwind) skeleton with username & password authentication.

## Getting started

Use a local folder, **not** a Google Drive / OneDrive synced folder: `npm install` there is very slow.

```bash
npm install
cp .env.example .env.local   # Windows: copy .env.example .env.local
```

Open `.env.local` and set `SESSION_SECRET` to a random string. You can generate one with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Then:

```bash
npm run dev
```

Open http://localhost:3000. Create an account at `/signup`, and you'll land on `/dashboard`.

## How auth works

| Piece | File |
| --- | --- |
| User table (SQLite, `data/app.db`, created automatically) | `src/lib/db.ts` |
| Password hashing (bcrypt, cost 12) + sign up / log in / log out Server Actions | `src/app/actions/auth.ts` |
| Input validation (zod) | `src/lib/definitions.ts` |
| Session: signed JWT (HS256) in an httpOnly, SameSite=Lax cookie, 7 days | `src/lib/session.ts`, `src/lib/session-token.ts` |
| `getCurrentUser()` / `requireUser()` for pages & actions | `src/lib/dal.ts` |
| Fast redirects (logged out → `/login`, logged in → `/dashboard`) | `src/proxy.ts` |

To protect a new page, call `await requireUser()` in a server component (behind `<Suspense>`) and add its path to `protectedPrefixes` in `src/proxy.ts`.

Usernames are case-insensitive. Login errors don't reveal whether a username exists.
