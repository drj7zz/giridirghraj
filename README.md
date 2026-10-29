# Dirghraj Giri — Portfolio & Writing

The portfolio, journal, research notes, and admin content manager are one Next.js
application. The public writing pages and the admin CMS use the same `/api/blogs`
endpoint and MongoDB `blogs` collection.

**Site:** <https://giridirghraj.vercel.app>

**Contact:** [giridirghraj@gmail.com](mailto:giridirghraj@gmail.com)

## Local development

Use Node.js 24.x (the latest major currently supported by Vercel). Install and
start the single app from the repository root:

```powershell
npm install --prefix app
Copy-Item app/.env.example app/.env.local
npm run dev
```

The site runs at `http://localhost:3000`; the journal is at `/blogs`. Set real
local values in `app/.env.local` and keep secrets out of Git.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB database for projects, site data, and blog content |
| `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `JWT_SECRET` | Admin CMS and chat authentication |
| `GITHUB_TOKEN` | Optional GitHub API rate-limit increase |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` | Optional Google sign-in; callback path is `/api/user/auth/google/callback` |

If MongoDB is not configured or unavailable, the APIs use the bundled seed data
where available. Configure production secrets in the Vercel project settings,
not in committed files.

## Build

```sh
npm run build
npm run start
```

## Deploy to Vercel

Deploy one Vercel project from this repository and set its **Root Directory** to
`app`. Vercel detects Next.js and uses the app's lockfile and `npm run build`.
Use Node.js **24.x**, the newest major currently offered by Vercel. Security
headers are configured in `app/next.config.mjs`; a separate Vercel config file
is not required.

Configure the environment variables above in Vercel. For Google sign-in, register
the production callback URL in Google Cloud Console and set the matching
`GOOGLE_REDIRECT_URI`. MongoDB Atlas must allow connections from your deployment.

## License

See [LICENSE](./LICENSE) for the project's license.
