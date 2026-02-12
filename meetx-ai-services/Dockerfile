FROM node:20-alpine AS builder
WORKDIR /app

COPY meetx-ai-services ./meetx-ai-services

WORKDIR /app/meetx-ai-services
RUN npm install
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/meetx-ai-services/package*.json ./
COPY --from=builder /app/meetx-ai-services/node_modules ./node_modules
COPY --from=builder /app/meetx-ai-services/dist ./dist
COPY --from=builder /app/meetx-ai-services/.env.example ./

RUN npm prune --omit=dev

EXPOSE 4100
CMD ["node", "dist/index.js"]
