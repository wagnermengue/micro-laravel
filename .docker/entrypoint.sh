#!/bin/bash

#On error no such file entrypoint.sh, execute in terminal - dos2unix .docker\entrypoint.sh

### front-end
npm config set cache /var/www/.npm-cache --global
cd /var/www/frontend && npm install && cd ..

### back-end
# deixei comentado os ifs pois estao com problema
cd backend
#if [ ! -f ".env"]; then
cp .env.example .env
#fi
#if [ ! -f ".env.testing"]; then
cp .env.testing.example .env.testing
#fi
composer install
php artisan key:generate
php artisan key:generate --env=testing
php artisan migrate

php-fpm
