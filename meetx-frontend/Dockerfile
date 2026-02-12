FROM node:20-alpine AS builder
WORKDIR /app

COPY meetx-shared ./meetx-shared
COPY meetx-frontend ./meetx-frontend

WORKDIR /app/meetx-shared
RUN npm install
RUN npm run build

WORKDIR /app/meetx-frontend
RUN npm install
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/meetx-frontend/package*.json ./
COPY --from=builder /app/meetx-frontend/node_modules ./node_modules
COPY --from=builder /app/meetx-frontend/.next ./.next
COPY --from=builder /app/meetx-frontend/public ./public
COPY --from=builder /app/meetx-frontend/next.config.js ./next.config.js
COPY --from=builder /app/meetx-frontend/.env.example ./

RUN npm prune --omit=dev

EXPOSE 3000
CMD ["npm", "start"]
