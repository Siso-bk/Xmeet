# meetx-ai-services

Node.js + TypeScript AI services for MEETX.

## Run

```
npm install
npm run dev
```

## Health

- `GET /health`
- `GET /ready`

## Deployment

### Render
Use the root `render.yaml` blueprint in `` and set `CORS_ORIGIN` and any AI credentials.

### GCP Cloud Run
Build from the repo root:

```
docker build -f meetx-ai-services/Dockerfile .
```

Deploy with `gcloud run deploy` or the sample Cloud Run service YAML in `deploy/cloudrun/`.
