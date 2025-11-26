# barnemax

Personal portfolio website built with a headless WordPress backend and a Nuxt 4 frontend.

**Stack:** Nuxt 4 + Tailwind CSS 4 + WordPress (Bedrock) + WPGraphQL

## Project structure

```
barnemax/
├── frontend/       # Nuxt 4 app (SSR)
├── backend/        # WordPress (Bedrock) — headless CMS
└── package.json    # Root scripts
```

## Prerequisites

- **Node.js** >= 18 & **pnpm**
- **PHP** >= 8.1 & **Composer**
- **MySQL** / MariaDB
- A local domain pointed to `backend/web` (e.g. `backend.barnemax.test`)
- **ACF Pro license** — this project uses [Advanced Custom Fields PRO](https://www.advancedcustomfields.com/pro/), which requires a paid license. You'll need to create a `backend/auth.json` with your license key:
  ```json
  {
    "http-basic": {
      "connect.advancedcustomfields.com": {
        "username": "your-license-key",
        "password": "https://your-site.com"
      }
    }
  }
  ```

## Setup

### Backend (WordPress)

```bash
cd backend
composer install
cp .env.example .env
```

Edit `backend/.env` with your database credentials and local URL:

```env
DB_NAME='your_database'
DB_USER='root'
DB_PASSWORD=''
WP_ENV='development'
WP_HOME='https://backend.your-site.test'
WP_SITEURL="${WP_HOME}/wp"
```

Generate salts at [roots.io/salts](https://roots.io/salts.html) and paste them into `.env`.

Point your local server (Laragon, Valet, etc.) to `backend/web` and run the WordPress install at your local URL.

**Required plugins** (installed via Composer):
- WPGraphQL
- WPGraphQL for ACF
- WPGraphQL Polylang
- WPGraphQL Rank Math SEO
- WPGraphQL Smart Cache
- Advanced Custom Fields PRO
- Polylang
- Rank Math SEO

### Frontend (Nuxt)

```bash
cd frontend
pnpm install
```

Create `frontend/.env`:

```env
NUXT_PUBLIC_WP_GRAPHQL_URL=http://backend.barnemax.test/wp/graphql
NUXT_PUBLIC_SITE_URL=http://localhost:3000
NUXT_TURNSTILE_SITE_KEY=your_turnstile_site_key
NUXT_TURNSTILE_SECRET_KEY=your_turnstile_secret_key
NUXT_BREVO_API_KEY=your_brevo_api_key
NUXT_MAIL_RECEIVER=your@email.com
```

## Development

```bash
# From root — starts the Nuxt dev server
pnpm dev

# Or from the frontend directory
cd frontend
pnpm dev
```

The frontend runs at `http://localhost:3000`.

## Build & Preview

```bash
cd frontend
pnpm build       # Build for production (SSR)
pnpm preview     # Preview the production build locally
```

## Linting

```bash
# Frontend (ESLint)
cd frontend
pnpm lint        # Check
pnpm lint:fix    # Auto-fix

# Backend (Laravel Pint)
cd backend
composer lint      # Check
composer lint:fix  # Auto-fix
```

## Key features

- **Headless CMS** — WordPress serves content via GraphQL, Nuxt renders the frontend
- **ISR caching** — Pages are cached server-side and revalidated automatically
- **i18n** — English and French with Polylang (backend) and @nuxtjs/i18n (frontend)
- **SEO** — Rank Math on backend, nuxt-schema-org + dynamic meta on frontend
- **Contact form** — Cloudflare Turnstile captcha + Brevo email API
- **Security** — CSP headers, DOMPurify for HTML sanitization, nuxt-security module

## License

MIT — see [LICENSE](LICENSE).
