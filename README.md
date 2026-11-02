# EdMira Web

The EdMira website (marketing pages) and the student web app (`/app`), built to
match **EdMira-MobileApp**: same backend, API contract, data layer, theme
colours, password rules, progress maths, session timeouts and en / ha / yo
strings.

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · axios.

```sh
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Checks: `npm run typecheck` · `npm run lint` · `npm run build`

## Backend

Like the mobile app, the web app talks to the deployed backend
(`https://edmira-backend.onrender.com`) by default — sign-up, email
verification, login, password reset, profile, courses, topics, quizzes,
progress, feedback and news are all live. To use a backend on this computer,
copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_API_TARGET=local`.

The API contract is the mobile repo's `docs/BACKEND_INTEGRATION.md`; endpoint
paths are in `src/api/endpoints.ts`. The backend only accepts browser requests
from origins in its `ALLOWED_ORIGINS` env var (currently includes
`http://localhost:3000` and `https://edmira.org`) — add any new domain there.

## Layout

```
src/
├── app/
│   ├── (marketing)/   home, about, contact, terms, privacy, disclaimer
│   ├── (auth)/        login, signup (+ /student), verify-email, forgot-password
│   └── app/           the student app: home, courses, topics, quiz, attempts,
│                      progress, news, profile, feedback
├── api/ data/         copied from the mobile app (client, endpoints, DTO mappers,
│                      repositories, services) — keep the two in sync
├── config/            backend.ts (switchboard) · site.ts (public facts, links)
├── storage/           localStorage versions of the mobile storage modules
├── session/           current user, idle warning (5 min), 8-hour limit
├── localization/      en / ha / yo from mobile + web.ts (web-only strings, English)
├── theme/             light / dark / system (colours live in app/globals.css)
└── components/        ui kit, auth, app and marketing components
```

Rules from the mobile `docs/ARCHITECTURE.md` apply: pages import a *service*
(`authService`, `learningService`, `newsService`, `referenceService`), never
`apiClient` or storage directly; every app string goes through `t.*`.

## Before launch

- Confirm `SITE.contactEmail` in `src/config/site.ts`.
- Have the Terms and Privacy pages reviewed (they are plain-language drafts).
- Translate `src/localization/web.ts` into Hausa and Yorùbá.
