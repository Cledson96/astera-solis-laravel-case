#!/usr/bin/env sh
set -e

mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views bootstrap/cache

if [ "${RUN_LARAVEL_BOOTSTRAP:-true}" = "true" ]; then
  php artisan config:clear --no-interaction

  if [ "${RUN_MIGRATIONS_ON_DEPLOY:-true}" = "true" ]; then
    php artisan migrate --force --no-interaction
  fi

  if [ "${RUN_SEED_ON_DEPLOY:-true}" = "true" ]; then
    php artisan app:seed-once --no-interaction
  fi

  php artisan optimize --no-interaction
fi

exec "$@"
