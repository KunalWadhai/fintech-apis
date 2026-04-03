FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

FROM base AS runner
ENV NODE_ENV=production
ENV PORT=2026

COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY src ./src

# Run as non-root user for better container security.
USER node

EXPOSE 2026

CMD ["node", "src/index.js"]

