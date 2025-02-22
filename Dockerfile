FROM oven/bun:1.2.2-debian AS base

# Install dependencies
FROM base AS depends
WORKDIR /usr/src/app
COPY package.json* bun.lock* ./
RUN bun install --frozen-lockfile --quiet

# Build the app
FROM base AS builder
WORKDIR /usr/src/app
COPY --from=depends /usr/src/app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1

RUN bun run build

# Run the app
FROM base AS runner
WORKDIR /usr/src/app

# Install Depends
RUN apt-get update && \
    apt-get install -y python3 make && \
    apt-get clean

RUN addgroup --system --gid 1007 nextjs
RUN adduser --system --uid 1007 nextjs

RUN mkdir .next
RUN chown nextjs:nextjs .next

COPY --from=builder --chown=nextjs:nextjs /usr/src/app/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /usr/src/app/.next ./.next
COPY --from=builder --chown=nextjs:nextjs /usr/src/app/public ./public
COPY --from=builder --chown=nextjs:nextjs /usr/src/app/next.config.ts ./next.config.ts
COPY --from=builder --chown=nextjs:nextjs /usr/src/app/package.json ./package.json

ENV NODE_ENV=production

ENV HOSTNAME="0.0.0.0"
EXPOSE 3000
ENV PORT=3000

USER nextjs
CMD ["node", "server.js"]
