FROM node:20-alpine AS builder
WORKDIR /app

COPY meetx-shared ./meetx-shared
COPY meetx-backend ./meetx-backend

WORKDIR /app/meetx-shared
RUN npm install
RUN npm run build

WORKDIR /app/meetx-backend
RUN npm install
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/meetx-shared ./meetx-shared
COPY --from=builder /app/meetx-backend ./meetx-backend

WORKDIR /app/meetx-backend
RUN npm prune --omit=dev

EXPOSE 4000
CMD ["node", "dist/main.js"]
