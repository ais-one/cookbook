ARG NODE_VERSION=22

# -----------------------------
# Base build stage
# -----------------------------
FROM node:${NODE_VERSION}-alpine AS build

# Install build deps
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    bash \
    wget \
    git

WORKDIR /app

# 2️⃣ Copy root package.json next
COPY package.json ./
RUN npm install --omit=dev

# 3️⃣ Now copy the rest of the source (this breaks cache only when code changes)
COPY . .

# -----------------------------
# Production stage
# -----------------------------
FROM node:${NODE_VERSION}-alpine AS production

# Doppler build args
ARG ARG_DOPPLER_TOKEN
ARG ARG_DOPPLER_PROJECT
ARG ARG_DOPPLER_CONFIG
ARG ARG_NODE_ENV=production

ENV NODE_ENV=$ARG_NODE_ENV
ENV DOPPLER_TOKEN=$ARG_DOPPLER_TOKEN
ENV DOPPLER_PROJECT=$ARG_DOPPLER_PROJECT
ENV DOPPLER_CONFIG=$ARG_DOPPLER_CONFIG

WORKDIR /app

# Copy built app from previous stage
COPY --from=build /app .

# Install Doppler CLI (can be cached unless CLI version changes)
RUN wget -q -t3 'https://packages.doppler.com/public/cli/rsa.8004D9FF50437357.key' -O /etc/apk/keys/cli@doppler-8004D9FF50437357.rsa.pub && \
    echo 'https://packages.doppler.com/public/cli/alpine/any-version/main' | tee -a /etc/apk/repositories && \
    apk add --no-cache doppler

# Entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
