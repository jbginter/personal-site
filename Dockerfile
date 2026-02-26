# Stage 1: Dependencies
FROM node:18-alpine AS deps
WORKDIR /app
RUN apk add --no-cache openssl

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Stage 2: Builder
FROM node:18-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma

# Copy all source files
COPY . .

# Generate Prisma Client again (just to be safe)
RUN npx prisma generate

# Build the application
RUN npm run build

# Stage 3: Runner
FROM node:18-alpine AS runner
WORKDIR /app
RUN apk add --no-cache openssl

# Set environment to production
ENV NODE_ENV production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Change ownership to nextjs user
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port 3000
EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Start the application (with database migration)
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
