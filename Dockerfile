FROM node:20.4-alpine

WORKDIR /app

COPY . .

RUN apk add --no-cache bash curl && curl -1sLf \
'https://dl.cloudsmith.io/public/infisical/infisical-cli/setup.alpine.sh' | bash \
&& apk add infisical

RUN addgroup -S appgroup && adduser -S appuser -G appgroup \ 
    && npm ci \
    && npx tsc \
    && npm ci --omit=dev --omit=optional \
    && npm cache clean --force

# 
COPY --chown=appuser:appgroup . .

USER appuser

EXPOSE 3000

CMD infisical run --env=$INFISICAL_ENVIRONMENT --path=/share -- node dist/src/app.js