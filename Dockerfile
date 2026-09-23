# ─────────────────────────────────────────────
# DriveIt — production image (Next.js + Payload standalone)
# ─────────────────────────────────────────────
FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# ── dependencies ──
FROM base AS deps
COPY package.json package-lock.json* ./
# The lockfile is the source of truth; --legacy-peer-deps is no longer required
# now that graphql is pinned to the version Payload expects.
RUN npm ci

# ── build ──
FROM base AS builder
ENV NEXT_TELEMETRY_DISABLED=1
# Emits .next/standalone (see next.config.mjs). Secrets are injected at runtime,
# never baked into the image.
ENV NEXT_OUTPUT_STANDALONE=true
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ── runtime ──
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs \
  && mkdir -p /app/data /app/public/media \
  && chown -R nextjs:nodejs /app/data /app/public/media

# The standalone build emits a minimal server + only the dependencies it needs.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# This image is intentionally slim: it has no TypeScript toolchain, so run
# `npm run migrate` from CI (or a checkout pointed at the same DATABASE_URI)
# before swapping containers, and run `npm run seed` from anywhere — it talks to
# the running app over HTTP.

USER nextjs
EXPOSE 3000

# Mount volumes at /app/data (SQLite) and /app/public/media (uploads).
# Set DATABASE_URI=file:/app/data/driveit.db
CMD ["node", "server.js"]
