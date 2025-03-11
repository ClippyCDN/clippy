FROM oven/bun:1.2.4-slim AS base

# Build stage
FROM base AS builder
WORKDIR /app
COPY package.json* bun.lock* ./
RUN bun install --frozen-lockfile --quiet

# Copy source and build the app
COPY . .
RUN bun run build && rm -rf .git .github .next/cache/*

# Production dependencies stage
FROM base AS prod-deps
WORKDIR /app
COPY package.json* bun.lock* ./
RUN bun install --frozen-lockfile --production --quiet

# Final smaller image with Alpine
FROM oven/bun:1.2.4-alpine AS runner
WORKDIR /app

# Install dependencies
RUN apk add --no-cache curl wget ca-certificates

# Copy only the ffmpeg binary
COPY --from=mwader/static-ffmpeg:7.1 /ffmpeg /usr/local/bin/

# Copy only the production dependencies
COPY --from=prod-deps /app/node_modules ./node_modules

# Copy only necessary build artifacts
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/cli ./cli
COPY --from=builder /app/src ./src
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./

ENV NEXT_PUBLIC_APP_ENV=production
ENV HOSTNAME="0.0.0.0"
EXPOSE 3000
ENV PORT=3000
", "run", "start"]