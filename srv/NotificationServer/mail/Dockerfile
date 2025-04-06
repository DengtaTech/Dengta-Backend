FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
    && npm ci

COPY --chown=appuser:appgroup . .

# 這邊若你確定容器裡不會需要寫檔案，可以直接移除 /app 的寫入權限
RUN chmod -R a-w /app

USER appuser

ENTRYPOINT ["npm", "start"]

