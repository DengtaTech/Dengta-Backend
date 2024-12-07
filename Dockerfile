FROM node:20.4-alpine AS builder

WORKDIR /app

COPY . .


RUN npm ci --legacy-peer-deps \
    && npx tsc \
    && cp src/utils/rateLimit.lua dist/src/utils/rateLimit.lua \
    && cp src/Config/stopwords.txt dist/src/Config/stopwords.txt \
    && npm cache clean --force


FROM node:20.4-alpine

WORKDIR /app

# -sLf --> Without the -1 option, curl is free to negotiate HTTP/2 if it's available, which can provide performance benefits such as reduced latency and header compression
RUN apk add --no-cache bash curl \
    && curl -sLf --proto =https 'https://dl.cloudsmith.io/public/infisical/infisical-cli/setup.alpine.sh' | bash \
    && apk add infisical \
    && apk del bash curl \
    && rm -rf /var/cache/apk/* /tmp/*

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

ARG CUSTOM_ENV
ENV CUSTOM_ENV=${CUSTOM_ENV}

RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
    && npm ci --omit=dev --omit=optional --legacy-peer-deps \
    && npm cache clean --force \
    && chown -R appuser:appgroup /app

USER appuser

EXPOSE 3001

CMD infisical run --env="$INFISICAL_ENVIRONMENT" --path=/share -- node dist/src/app.js