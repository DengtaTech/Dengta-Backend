FROM node:20.4-alpine

WORKDIR /app

COPY . .

RUN apk add --no-cache bash curl && curl -1sLf \
'https://dl.cloudsmith.io/public/infisical/infisical-cli/setup.alpine.sh' | bash \
&& apk add infisical

RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
    && npm install --production

COPY --chown=appuser:appgroup . .

USER appuser

EXPOSE 3000

# ARG INFISICAL_ENVIRONMENT
# ENV ENVIRONMENT=${INFISICAL_ENVIRONMENT}

CMD infisical run --env=$INFISICAL_ENVIRONMENT --path=/share -- node src/app.js