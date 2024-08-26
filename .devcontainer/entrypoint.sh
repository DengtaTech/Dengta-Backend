#!/bin/bash

stopService() {
  echo "Received termination signal, stopping socat service..."
  service socat stop
  sleep 1
  exit 0
}

trap 'stopService' EXIT SIGTERM TERM INT

service socat start

if [ $# -eq 0 ]; then
  while :
  do
    sleep 65535
  done
else
  exec "$@"
fi