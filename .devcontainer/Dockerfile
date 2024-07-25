FROM node:20-bookworm

ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=Asia/Taipei

RUN apt-get update && apt-get upgrade -y \
    && apt-get install -y bash curl sudo \
    # -sLf --> Without the -1 option, curl is free to negotiate HTTP/2 if it's available, which can provide performance benefits such as reduced latency and header compression
    && curl -sLf 'https://dl.cloudsmith.io/public/infisical/infisical-cli/setup.deb.sh' \
       | bash \
    && apt-get update \
    && apt-get install -y infisical \
    && rm -rf /var/lib/apt/lists/*

# RUN useradd -ms /bin/bash --user-group vscode
# Allow password-less sudo
RUN mkdir -p /etc/sudoers.d \
    && echo "node ALL=(ALL:ALL) NOPASSWD: ALL" | tee /etc/sudoers.d/node

USER node

EXPOSE 3000