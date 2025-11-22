# Task Time Tracker App

> ⚠️ **Work in Progress:** This project is actively being developed. Features and structure may change at any time.

A modern time tracking application built with Nuxt, TypeScript, and Prisma ORM.

## Configuration

### Database Setup

1. **Create the database:**
   - Make sure your `DATABASE_URL` is set in the `.env` file.
2. **Run Prisma migrations:**
   - Apply all migrations to set up the database schema:
     ```sh
     npx prisma migrate deploy
     ```
3. **Generate Prisma Client:**
   - Generate the Prisma Client based on your schema:
     ```sh
     npx prisma generate
     ```
4. **Seed the database:**
   - Run the seeder script defined in `package.json`:
     ```sh
     npx prisma db seed
     ```
   - The seed creates two default users:
     - **Admin User**
       - Email: admin@admin.com
       - Password: admin123
       - Role: ADMIN
     - **Regular User**
       - Email: test@test.com
       - Password: password
       - Role: USER

### Environment Variables

Before running the project, copy `.env.example` to `.env` and fill in your own values.

- **DATABASE_URL**: Connection string for Prisma/SQLite.
  - In production, the SQLite database file should be stored **outside** the public directory for security reasons.
- **NUXT_SESSION_PASSWORD**: Session secret for Nuxt Auth Utils.
  - Must be at least 32 characters long for security.
- **NUXT_PUBLIC_TINYMCE_API_KEY**: API key for TinyMCE rich text editor.
  - Get your free API key from [TinyMCE Cloud](https://www.tiny.cloud/).

See the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) for more information.

## Running Tests

### E2E Tests with Playwright

End-to-end tests use Playwright with a dedicated test database (`time_tracker_test.db`).

#### Test Database Setup

Before running tests, you must create the directory for the test database:

```sh
mkdir -p prisma/db
```

#### Running the Tests

To run the tests:

1. **Start the test server** (in one terminal):

   ```sh
   npm run test:server:start
   ```

   This will:
   - Reset and seed the test database (`time_tracker_test.db`)
   - Set up the necessary environment variables
   - Start the Nuxt server on port 3030

2. **Run the tests** (in another terminal):
   ```sh
   npm run test:e2e:run
   ```

### Unit Tests

This project uses Vitest for unit testing Vue components, composables, and utility functions.

To run all unit tests:

```bash
npm run test
```

#### First Time Setup

If this is your first time running Playwright tests, you may need to install the browser binaries:

```bash
npx playwright install
```

## Setup

Make sure to install dependencies:

```bash
npm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
