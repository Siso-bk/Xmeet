# meetx-backend

NestJS API for MEETX.

## Setup

```
npm install
```

Copy `.env.example` to `.env` and update values.

## Run

```
npm run start:dev
```

## Health

- `GET /health`
- `GET /ready`

## Notes
- Uses MongoDB via Mongoose
- JWT access tokens + refresh token rotation
- Zod validation via shared contracts
- Global rate limiting via Throttler

## Deployment

### Render
Use the root `render.yaml` blueprint in `` and set environment variables for MongoDB, JWT secrets, and CORS.

### GCP Cloud Run
Build from the repo root:

```
docker build -f meetx-backend/Dockerfile .
```

Deploy with `gcloud run deploy` or the sample Cloud Run service YAML in `deploy/cloudrun/`.
