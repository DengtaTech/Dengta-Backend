FROM node:20-bookworm

ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=Asia/Taipei

SHELL [ "/bin/bash", "-c" ]

RUN apt-get update && apt-get upgrade -y \
    # infisical
    && apt-get install -y bash curl \
    # -sLf --> Without the -1 option, curl is free to negotiate HTTP/2 if it's available, which can provide performance benefits such as reduced latency and header compression
    && curl -sLf 'https://dl.cloudsmith.io/public/infisical/infisical-cli/setup.deb.sh' \
    | bash \
    && apt-get update \
    && apt-get install -y infisical \
    # port forwarding
    && apt-get install -y socat ncat \
    # useful tools
    && apt-get install -y bash curl git vim \
    && rm -rf /var/lib/apt/lists/*

COPY socat /etc/init.d/socat

USER root

ENTRYPOINT ["/bin/bash", "-c", "echo \"Container started\"; trap \"service socat stop ; echo Container stopped; exit 0\" 15; exec \"$@\"; service socat start; while sleep 1 & wait $!; do :; done"]

EXPOSE 3001