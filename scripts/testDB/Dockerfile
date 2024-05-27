FROM mysql:8.0

ARG MYSQL_ROOT_PASSWORD

ENV MYSQL_DATABASE=dengta
ENV MYSQL_ROOT_PASSWORD $MYSQL_ROOT_PASSWORD
ENV MYSQL_USER dengta
ENV MYSQL_PASSWORD $MYSQL_ROOT_PASSWORD

ADD backup.sql /docker-entrypoint-initdb.d

EXPOSE 3306

LABEL org.opencontainers.image.source https://github.com/DengtaTech/Dengta-Backend