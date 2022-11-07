# Install dependencies only when needed
FROM node:14-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY . .
RUN npm install

# Rebuild the source code only when needed
FROM node:14-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

FROM node:14-alpine AS runner
WORKDIR /app

FROM testcafe/testcafe:latest
WORKDIR /app

# We need root privileages to install new deps:
USER root