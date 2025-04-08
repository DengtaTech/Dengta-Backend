FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
    && npm ci

COPY --chown=appuser:appgroup --chmod=544 . .

USER appuser

ENTRYPOINT ["npm", "start"]

