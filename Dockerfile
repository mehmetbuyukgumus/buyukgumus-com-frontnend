# ── Stage 1: Dependencies ──────────────────────────────────────────────────────
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install

# ── Stage 2: Builder ───────────────────────────────────────────────────────────
FROM node:18-alpine AS builder
WORKDIR /app

# We removed explicit ARGs here so Next.js build process 
# automatically picks up values from the '.env.production' file
# that is copied into the context with the source code.
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# ── Stage 3: Runner ────────────────────────────────────────────────────────────
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Next.js standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 1905
ENV PORT=1905

CMD ["node", "server.js"]
