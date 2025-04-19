# Time Tracker App

> ⚠️ **Work in Progress:** This project is actively being developed. Features and structure may change at any time.

A modern time tracking application built with Nuxt, TypeScript, and Prisma ORM.

## Configuration

Before running the project, copy `.env.example` to `.env` and fill in your own values.

### Environment Variables

- **DATABASE_URL**: Connection string for Prisma/SQLite.
  - In production, the SQLite database file should be stored **outside** the public directory for security reasons.
- **NUXT_SESSION_PASSWORD**: Session secret for Nuxt Auth Utils.
  - Must be at least 32 characters long for security.

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
