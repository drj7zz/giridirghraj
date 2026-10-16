# Dirghraj Giri — Portfolio & Writing

A personal portfolio for Dirghraj Giri (DRJ), with an independently deployable
writing site. The portfolio is the content-management app; the writing site is
read-only and uses the same MongoDB `blogs` collection.

**Portfolio:** [Add the deployed portfolio URL]

**Writing:** [Add the deployed writing-site URL]

**Contact:** [Add your preferred contact method]

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

For separate deployments, set the portfolio service's project root to `app` and
the writing service's project root to `blog`. Configure each service with its
own environment variables and production start command.

## License

See [LICENSE](./LICENSE) for the project's license.
