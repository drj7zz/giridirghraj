# Dirghraj Giri — Portfolio & Writing

A personal portfolio for Dirghraj Giri (DRJ), with an independently deployable
writing site. The portfolio is the content-management app; the writing site is
read-only and uses the same MongoDB `blogs` collection.

**Portfolio:** <https://giridirghraj.vercel.app>

**Writing:** Set `NEXT_PUBLIC_BLOG_URL` to the writing site's deployed URL.

**Contact:** [giridirghraj@gmail.com](mailto:giridirghraj@gmail.com)

## Applications

| App | Directory | Purpose |
| --- | --- | --- |
| Portfolio | `app/` | Home, Work, About, Connect, résumé, and admin content management |
| Writing | `blog/` | Standalone journal, research, and blog pages |

The two apps can be deployed separately. Configure their public origins through
environment variables rather than embedding deployment URLs in the app.

## Run locally

Use a supported Node.js release and install each app's dependencies:

```sh
npm install --prefix app
npm install --prefix blog
```

Copy `app/.env.example` to `app/.env.local` and `blog/.env.example` to
`blog/.env.local`. Set the required values in those local files; do not commit
credentials or production secrets.

Start the portfolio and writing apps in separate terminals:

```sh
npm run dev
npm run dev:blog
```

By default, the portfolio is available at `http://localhost:3000` and the
writing site at `http://localhost:3001`.

## Environment configuration

Configure these values in the appropriate app's local environment file or
deployment settings:

| Variable | App | Purpose |
| --- | --- | --- |
| `MONGODB_URI` | Both | MongoDB connection; use the same database for both apps |
| `NEXT_PUBLIC_BLOG_URL` | Portfolio and writing | Public origin of the independent writing site |
| `NEXT_PUBLIC_PORTFOLIO_URL` | Writing | Public origin used for links back to the portfolio |
| `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `JWT_SECRET` | Portfolio | Admin authentication settings |

Use the example files as a guide. Keep secrets private, and use the deployed
HTTPS origins in production. The portfolio's admin is where writing content is
managed; the standalone writing app only displays it.

## Build and run for production

From the project root:

```sh
npm run build
npm run build:blog
npm run start
npm run start:blog
```

## Deploy to Vercel

The two apps deploy as **two separate Vercel projects** from the same repository.
Each app already contains its own `vercel.json` (framework, region, cache headers)
and `.vercelignore`, so the only thing left to configure is the project root and
environment variables.

### 1. Create the projects

| Vercel project | Root Directory | Framework |
| --- | --- | --- |
| Portfolio | `app` | Next.js |
| Writing | `blog` | Next.js |

When importing the repo, set **Root Directory** to `app` for the first project and
to `blog` for the second. Vercel detects Next.js automatically; leave the build
and output settings at their defaults (`next build`).

### 2. Set environment variables

Add these under **Project Settings → Environment Variables** for the matching
project. Use the deployed HTTPS origins — not `localhost`.

| Variable | Project | Notes |
| --- | --- | --- |
| `MONGODB_URI` | Both | Same database for both apps; allow Vercel egress IPs in Atlas |
| `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `JWT_SECRET` | Portfolio | Required for admin/CMS and chat auth |
| `GITHUB_TOKEN` | Portfolio | Optional; raises the GitHub API rate limit |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` | Portfolio | Optional Google sign-in |
| `NEXT_PUBLIC_BLOG_URL` | Portfolio | `https://<your-blog>.vercel.app` |
| `NEXT_PUBLIC_PORTFOLIO_URL` | Writing | `https://<your-portfolio>.vercel.app` |
| `NEXT_PUBLIC_BLOG_URL` | Writing | `https://<your-blog>.vercel.app` |

`NEXT_PUBLIC_*` values are inlined at build time — redeploy after changing them.

### 3. Finish external setup

- **MongoDB Atlas:** add `0.0.0.0/0` (or Vercel's egress ranges) to the Network
  Access allowlist. Serverless functions cannot use static IPs on the free plan.
- **Google OAuth:** register the production callback
  `https://<your-portfolio>.vercel.app/api/user/auth/google/callback` in the
  Google Cloud Console and set the matching `GOOGLE_REDIRECT_URI`.

If `MONGODB_URI` is missing or Atlas is unreachable, both apps fall back to the
bundled seed data instead of erroring — so the first deploy renders even before
the database is wired up.

## Deployment notes

- Both apps run on the Node.js runtime. The portfolio targets Node 18.18+ and the
  writing app targets Node 20.9+ (declared via the `engines` field).
- MongoDB connections are cached on `globalThis` so a warm serverless instance
  reuses one pooled client instead of opening a connection per request.
- The portfolio's `render.yaml` remains for other hosts; it is ignored by Vercel.

## License

See [LICENSE](./LICENSE) for the project's license.
