# syntax=docker/dockerfile:1

FROM dunglas/frankenphp:1-php8.4-alpine AS runtime

WORKDIR /app

RUN install-php-extensions \
    opcache \
    pcntl \
    pdo_pgsql \
    redis

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-progress \
    --no-scripts \
    --optimize-autoloader \
    --prefer-dist

COPY . .
COPY docker/Caddyfile /etc/caddy/Caddyfile
COPY docker/entrypoint.sh /usr/local/bin/astera-entrypoint.sh

RUN composer dump-autoload --optimize \
    && php artisan package:discover --ansi \
    && mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views bootstrap/cache \
    && chmod +x /usr/local/bin/astera-entrypoint.sh \
    && chown -R www-data:www-data storage bootstrap/cache

ENV APP_ENV=production \
    FRANKENPHP_CONFIG="worker ./public/index.php" \
    SERVER_NAME=:8000

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=5 \
    CMD wget -qO- http://127.0.0.1:8000/up >/dev/null || exit 1

ENTRYPOINT ["sh", "/usr/local/bin/astera-entrypoint.sh"]
CMD ["frankenphp", "run", "--config", "/etc/caddy/Caddyfile"]
