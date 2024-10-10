FROM redis:alpine

COPY redis.conf /usr/local/etc/redis/redis.conf

RUN addgroup -S appgroup && adduser -S appuser -G appgroup && \
    chown appuser:appgroup /usr/local/etc/redis/redis.conf && \
    chmod 755 /usr/local/etc/redis/redis.conf

USER appuser

EXPOSE 6380

CMD redis-server /usr/local/etc/redis/redis.conf --requirepass ${REDIS_PASSWORD}