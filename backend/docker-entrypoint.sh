#!/bin/bash

echo "==> Sincronizando variables de entorno en .env..."
for VAR in GROQ_API_KEY APP_KEY; do
    VAL=$(printenv "$VAR" || true)
    if [ -n "$VAL" ]; then
        if grep -q "^${VAR}=" /var/www/.env 2>/dev/null; then
            sed -i "s|^${VAR}=.*|${VAR}=${VAL}|" /var/www/.env
        else
            echo "${VAR}=${VAL}" >> /var/www/.env
        fi
    fi
done

echo "==> Limpiando caché de configuración..."
php /var/www/artisan config:clear 2>/dev/null || true
php /var/www/artisan cache:clear 2>/dev/null || true

echo "==> Intentando ejecutar migraciones..."
php /var/www/artisan migrate --force --no-interaction 2>&1 || echo "   (No se pudieron ejecutar las migraciones - continuando)"

echo "==> Arrancando servidor Laravel en 0.0.0.0:8000..."
exec "$@"
