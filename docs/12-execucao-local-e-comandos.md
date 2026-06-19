# Execucao Local e Comandos

## Subir banco e Redis

Na raiz do projeto:

```powershell
cd C:\trabalho\astera-solis-laravel-case
docker compose up -d
```

## Backend Laravel

```powershell
cd C:\trabalho\astera-solis-laravel-case\astera-solis-api
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed --class=DemoSeeder
php artisan serve
```

API local:

```text
http://localhost:8000
```

## Frontend Next.js

```powershell
cd C:\trabalho\astera-solis-laravel-case\astera-solis-web
npm install
npm run dev
```

Frontend local:

```text
http://localhost:3000
```

## Variavel local do frontend

Criar `.env.local` no frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Variaveis locais importantes da API

Exemplo para PostgreSQL local via Docker:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=astera_solis
DB_USERNAME=astera
DB_PASSWORD=astera

SESSION_DRIVER=database
SESSION_DOMAIN=null
SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000
FRONTEND_URL=http://localhost:3000
```

## Recriar banco local

Apaga as tabelas e roda tudo de novo:

```powershell
php artisan migrate:fresh --seed
```

Para rodar o seed inicial especifico:

```powershell
php artisan db:seed --class=DemoSeeder
```

## Validacoes

```powershell
php artisan test
vendor\bin\pint --test
php artisan route:list
```

```powershell
npm run lint
npm run build
```

## Logins iniciais

```text
admin@astera.test   / password
editor@astera.test  / password
teacher@astera.test / password
student@astera.test / password
```
