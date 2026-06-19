# Autenticacao com Laravel Sanctum

## Escolha tecnica

O projeto usa Laravel Sanctum no modo SPA stateful, com cookie de sessao,
cookie CSRF e `credentials: "include"` no frontend.

Essa escolha combina com o Astera Solis porque o frontend Next.js e a API
Laravel pertencem ao mesmo produto, mesmo rodando em subdominios diferentes.

## Por que nao JWT com refresh token

JWT com access token e refresh token e comum em APIs publicas, apps mobile e
integracoes entre sistemas independentes. Para uma SPA first-party, Sanctum com
cookie costuma ser mais simples e seguro:

- o token de sessao fica em cookie HttpOnly;
- o JavaScript nao precisa guardar access token;
- Laravel protege escritas com CSRF;
- logout invalida a sessao;
- o fluxo fica mais proximo do uso comum em aplicacoes Laravel.

## Fluxo tecnico

1. Frontend chama `GET /sanctum/csrf-cookie`.
2. Laravel envia o cookie `XSRF-TOKEN`.
3. Frontend envia `POST /api/auth/login` com `credentials: "include"`.
4. Laravel valida email e senha.
5. Laravel cria sessao.
6. Browser guarda cookie de sessao HttpOnly.
7. Frontend chama rotas protegidas com o cookie.

## Variaveis importantes

No ambiente de producao:

```env
APP_URL=https://api.seudominio.com
FRONTEND_URL=https://app.seudominio.com
SESSION_DOMAIN=.seudominio.com
SESSION_SECURE_COOKIE=true
SESSION_SAME_SITE=lax
SANCTUM_STATEFUL_DOMAINS=app.seudominio.com
```

## Onde isso aparece no codigo

Backend:

```text
routes/api.php
app/Http/Controllers/Api/AuthController.php
app/Http/Controllers/Api/MeController.php
config/sanctum.php
config/session.php
config/cors.php
```

Frontend:

```text
astera-solis-web/src/lib/api.ts
astera-solis-web/src/components/LoginForm.tsx
```

## Resumo tecnico

Sanctum foi usado no modo SPA porque o frontend e a API fazem parte do mesmo
produto. O browser guarda a sessao em cookie HttpOnly, o Laravel protege
requisicoes de escrita com CSRF, e o frontend usa `credentials: "include"` para
enviar os cookies. Nesta arquitetura, isso evita armazenar JWT no JavaScript e
mantem o fluxo bem alinhado ao ecossistema Laravel.
