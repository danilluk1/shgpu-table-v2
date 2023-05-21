#!/usr/bin/env sh

cd /app

if [ -z "$DOCKER_DEBUG" ]
then
  pnpm prestart
  pnpm seed
  pnpm start
else
  echo 'Starting bot with inspector exposed at 0.0.0.0:9229'
  pnpm run debug
fi