FROM redis:alpine

ARG REDIS_PASSWORD

ENV REDIS_PASSWORD $REDIS_PASSWORD

COPY redis.conf /usr/local/etc/redis/redis.conf

EXPOSE 6379

CMD redis-server /usr/local/etc/redis/redis.conf --requirepass ${REDIS_PASSWORD}