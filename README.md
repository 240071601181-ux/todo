# Fastodo — Premium Productivity App

A full-stack task management application built with React, Express, PostgreSQL, and Prisma.

## Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, Vite, React Router
- **Backend:** Express 5, TypeScript, Prisma, PostgreSQL
- **Infrastructure:** Docker, Docker Compose, Nginx

## Getting Started

### Prerequisites

- Node.js 22+
- PostgreSQL 16+
- Docker & Docker Compose (optional)

### Environment Variables

Copy the example env files and adjust as needed:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

| Variable | Description | Default |
|---|---|---|
| `PORT` | Backend server port | `3001` |
| `HOST` | Backend host | `0.0.0.0` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://fastodo:fastodo_secret@localhost:5432/fastodo` |
| `JWT_SECRET` | Access token signing secret | (required) |
| `JWT_REFRESH_SECRET` | Refresh token signing secret | (required) |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:5173` |
| `NODE_ENV` | Environment | `development` |

### Local Development

```bash
# Install dependencies
npm install

# Set up database and generate Prisma client
npm run db:generate
npm run db:migrate

# Start both frontend and backend
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- Health check: http://localhost:3001/api/health

### Docker (Production)

```bash
# Build and start all services
docker compose up -d

# Run migrations
docker compose exec backend npx prisma migrate deploy

# View logs
docker compose logs -f
```

- App: http://localhost
- Backend API: http://localhost/api
- Health check: http://localhost/api/health

### Standalone Backend

```bash
cd backend
npm install
npx prisma migrate deploy
npm run build
npm start
```

### Standalone Frontend

```bash
cd frontend
npm install
npm run build
npm run preview
```

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/health` | No | Health check |
| `POST` | `/api/auth/register` | No | Register |
| `POST` | `/api/auth/login` | No | Login |
| `POST` | `/api/auth/refresh` | No | Refresh token |
| `POST` | `/api/auth/logout` | No | Logout |
| `GET` | `/api/auth/me` | Yes | Current user |
| `GET` | `/api/tasks` | Yes | List tasks |
| `GET` | `/api/tasks/:id` | Yes | Get task |
| `POST` | `/api/tasks` | Yes | Create task |
| `PUT` | `/api/tasks/:id` | Yes | Update task |
| `PATCH` | `/api/tasks/:id/complete` | Yes | Toggle complete |
| `DELETE` | `/api/tasks/:id` | Yes | Delete task |
| `GET` | `/api/lists` | Yes | List lists |
| `POST` | `/api/lists` | Yes | Create list |
| `PUT` | `/api/lists/:id` | Yes | Update list |
| `DELETE` | `/api/lists/:id` | Yes | Delete list |
| `GET` | `/api/analytics` | Yes | Get analytics |

## Production Features

- **Helmet** — Security headers
- **CORS** — Configured origin restriction
- **Compression** — Gzip response compression
- **Rate Limiting** — Global (100 req/15min) and auth-specific (20 req/15min) rate limits
- **Request Logging** — Morgan with error-level logging
- **Input Validation** — Zod schema validation middleware
- **Error Handling** — Centralized error middleware with AppError class
- **Response Caching** — In-memory cache for analytics endpoint (2min TTL)
- **Graceful Shutdown** — SIGTERM/SIGINT handling
- **Database Migrations** — Prisma with version-controlled migration files

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start both frontend and backend in dev mode |
| `npm run build` | Build both frontend and backend |
| `npm run lint` | Lint frontend |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:push` | Push schema without migrations |
| `npm run db:studio` | Open Prisma Studio |
