# syntax=docker/dockerfile:1

FROM oven/bun:latest AS base
WORKDIR /app

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

ENV NODE_ENV=production

# Copy package.json and lockfile
COPY package.json bun.lockb ./

# Install dependencies with frozen lockfile
RUN bun install --frozen-lockfile

# Build the app
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

# Build the Next.js app
RUN bun run build

# Production image, copy necessary files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy public directory
COPY --from=builder /app/src/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the app directly with server.js
CMD ["bun", "server.js"]