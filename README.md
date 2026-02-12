# MEETX

This repository contains the MEETX platform as four separate repositories inside one parent folder.

## Prerequisites
- Node.js 18+
- Docker + Docker Compose
- MongoDB Atlas optional (local Mongo supported via compose)

## Local Mongo
Start Mongo via docker-compose from the root:

```
docker compose up -d mongo
```

Optional Mongo Express (disabled by default):

```
docker compose --profile tools up -d mongo-express
```

## Repos
- meetx-shared: Shared types, validators, and API contracts
- meetx-backend: NestJS API
- meetx-ai-services: Node.js AI services
- meetx-frontend: Next.js web app

## Environment Variables
Each repo has its own `.env.example` with required variables. Copy to `.env` and adjust.

## Typical Dev Workflow
1. Start Mongo using docker compose.
2. Install dependencies in `meetx-shared` and build it.
3. Install and run `meetx-backend`.
4. Install and run `meetx-ai-services`.
5. Install and run `meetx-frontend`.

## Run Each Repo

### meetx-shared
```
cd meetx-shared
npm install
npm run build
```

### meetx-backend
```
cd meetx-backend
npm install
npm run start:dev
```

### meetx-ai-services
```
cd meetx-ai-services
npm install
npm run dev
```

### meetx-frontend
```
cd meetx-frontend
npm install
npm run dev
```

## CI/CD (GitHub Actions)
A CI workflow is provided at `.github/workflows/ci.yml` and builds all services on push and PR.

## Deployment

### Vercel (Frontend)
- Set the project root to `meetx-frontend`.
- Configure `NEXT_PUBLIC_API_URL` to the backend URL.

### Render (Backend + AI)
- Use `render.yaml` as a blueprint.
- Fill in required env vars (MongoDB URI, JWT secrets, CORS).

### GCP Cloud Run (Backend + AI)
Build from the repo root:

```
docker build -f meetx-backend/Dockerfile .
docker build -f meetx-ai-services/Dockerfile .
```

Sample Cloud Run service templates are in `deploy/cloudrun/`.

## Docker Build Note
`@meetx/shared` is a local file dependency, so Docker builds should use the repo root as context.
