FROM php:8.4-fpm

# 1. Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libsqlite3-dev \
    libmariadb-dev \
    libzip-dev \
    libicu-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# 2. Instalar extensiones de PHP necesarias para Laravel
RUN docker-php-ext-install pdo_mysql pdo_sqlite mbstring exif pcntl bcmath gd zip intl

# 3. Obtener la última versión de Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 4. Establecer directorio de trabajo
WORKDIR /var/www

# 5. Copiar los archivos del proyecto al contenedor
COPY . .

# 6. Crear un archivo .env si no existe (no sobreescribir si ya existe con credenciales reales)
RUN [ ! -f .env ] && cp .env.example .env || true

# 7. INSTALACIÓN DE COMPOSER
# Borrar vendor del repo y caché de paquetes para instalar limpio
RUN rm -rf vendor bootstrap/cache/*.php
RUN composer install --no-interaction --optimize-autoloader --no-dev --ignore-platform-reqs --no-scripts

# Regenerar autoloader y descubrir paquetes correctamente (sin paquetes dev)
RUN composer dump-autoload --optimize --no-scripts
RUN php artisan package:discover --ansi

# 8. Ajustar permisos de las carpetas de Laravel
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# 9. Asegurar que PHP-FPM pasa las variables de entorno de Docker al proceso PHP
RUN echo "clear_env = no" >> /usr/local/etc/php-fpm.d/www.conf

# 10. Script de arranque: ejecuta migraciones y lanza php-fpm
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# 11. Exponer el puerto del servidor Laravel
EXPOSE 8000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["php", "/var/www/artisan", "serve", "--host=0.0.0.0", "--port=8000"]
