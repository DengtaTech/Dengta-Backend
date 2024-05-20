FROM node:20.4-alpine
# FROM node:latest

WORKDIR /app

COPY . .

RUN apk add --no-cache bash curl && curl -1sLf \
'https://dl.cloudsmith.io/public/infisical/infisical-cli/setup.alpine.sh' | bash \
&& apk add infisical

# RUN apk add --no-cache bash curl && curl -1sLf \
#     'https://dl.cloudsmith.io/public/infisical/infisical-cli/setup.alpine.sh' | bash \
#     && apk add infisical

# RUN apk add --no-cache bash && \
#     curl -1sLf 'https://dl.cloudsmith.io/public/infisical/infisical-cli/setup.alpine.sh' | bash \
#     && apk add infisical


# # # 更新 apk 的儲存庫索引
# RUN sudo apk add infisical


# RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
#     && npm install --production
RUN addgroup -S appgroup && adduser -S appuser -G appgroup \ 
    && npm ci \
    && npx tsc \
    && npm ci --omit=dev --omit=optional \
    && npm cache clean --force

COPY --chown=appuser:appgroup . .

USER appuser

EXPOSE 3000

CMD infisical run --env=$INFISICAL_ENVIRONMENT --path=/share -- node dist/app.js