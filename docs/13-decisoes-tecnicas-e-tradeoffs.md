# Decisoes Tecnicas e Tradeoffs

## Monorepo

O projeto usa monorepo para manter API, frontend, deploy e documentacao juntos.

Vantagens:

- facilita avaliacao;
- simplifica o deploy da aplicacao;
- centraliza documentacao;
- permite pipeline unico.

Tradeoff:

- jobs do CI precisam separar backend e frontend por pasta.

## Laravel como API

Laravel foi usado como API JSON. Blade nao e a camada principal de interface.

Vantagens:

- ecossistema robusto;
- Sanctum integrado;
- Eloquent e migrations;
- Form Requests;
- Policies;
- testes feature produtivos.

Tradeoff:

- exige configurar CORS, Sanctum e cookies corretamente para SPA.

## Sanctum cookie

Sanctum cookie foi escolhido em vez de JWT.

Vantagens:

- bom para SPA first-party;
- cookie HttpOnly reduz exposicao no JavaScript;
- CSRF ja se integra ao Laravel;
- fluxo simples para login/logout.

Tradeoff:

- exige cuidado com dominio, subdominio, SameSite e CORS.

## Next.js

Next.js foi escolhido para o frontend por combinar TypeScript, roteamento,
componentizacao e build de producao.

Vantagens:

- stack valorizada no mercado;
- App Router;
- bom suporte a TypeScript;
- deploy standalone com Docker.

Tradeoff:

- para Sanctum, e preciso tratar cookies e `credentials: "include"` com
  atencao.

## PostgreSQL

PostgreSQL foi escolhido por ser um banco relacional forte e comum em producao.

Vantagens:

- relacionamentos claros;
- integridade referencial;
- JSON quando necessario;
- bom encaixe com Laravel.

Tradeoff:

- ambiente local precisa de Docker ou instalacao propria.

## Redis

Redis entra como cache/fila no compose.

Vantagens:

- habilita infraestrutura de cache e filas;
- permite queue worker;
- prepara o projeto para jobs.

Tradeoff:

- adiciona mais um servico para operar.

## Seed automatico no primeiro deploy

O seed roda em deploy com controle por `seed_runs`.

Vantagens:

- ambiente inicial nasce com dados;
- login admin/editor/student funciona apos primeiro deploy;
- deploys seguintes nao duplicam registros.

Tradeoff:

- em producao real, seeds automaticos precisam ser avaliados com cuidado.

## Docker na VPS

As imagens sao buildadas no GitHub Actions e publicadas no GHCR. A VPS apenas
faz pull e sobe containers.

Vantagens:

- deploy mais previsivel;
- VPS nao precisa Node, Composer ou build local;
- rollback fica mais simples por tag de imagem.

Tradeoff:

- exige configurar GHCR, secrets, vars, Docker e nginx.
