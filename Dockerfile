FROM node:20.4-alpine

WORKDIR /app

COPY . .

# RUN apk add --no-cache bash curl && curl -1sLf \
# 'https://dl.cloudsmith.io/public/infisical/infisical-cli/setup.alpine.sh' | bash \
# && apk add infisical

# -sLf --> Without the -1 option, curl is free to negotiate HTTP/2 if it's available, which can provide performance benefits such as reduced latency and header compression
RUN apk add --no-cache bash curl \
    && curl -sLf --proto =https 'https://dl.cloudsmith.io/public/infisical/infisical-cli/setup.alpine.sh' | bash \
    && apk add infisical \
    && apk del bash curl \
    && rm -rf /var/cache/apk/* /tmp/*

ENV CUSTOM_ENV=prod

RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
    && npm ci --legacy-peer-deps \
    && npx tsc \
    && cp src/utils/rateLimit.lua dist/src/utils/rateLimit.lua \
    && cp src/Config/stopwords.txt dist/src/Config/stopwords.txt \
    && npm ci --omit=dev --omit=optional --legacy-peer-deps \
    && npm cache clean --force

COPY --chown=appuser:appgroup . .

USER appuser

EXPOSE 3001

CMD infisical run --env="$INFISICAL_ENVIRONMENT" --path=/share -- node dist/src/app.js