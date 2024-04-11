FROM node:20.4-alpine

WORKDIR /app

COPY . .
RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
    && npm install -g pm2 \
    && npm install --production
# RUN npm install -g pm2 && npm install --production

COPY --chown=appuser:appgroup . .

USER appuser

EXPOSE 3000

# 上server時要改成 mysql-production
CMD ["sh", "-c", "while ! nc -z mysql-development 3306; do sleep 1; done && pm2-runtime app.js"]
