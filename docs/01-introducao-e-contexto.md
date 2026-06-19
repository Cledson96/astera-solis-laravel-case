# Introducao e Contexto

## Objetivo deste capitulo

Este capitulo apresenta o Astera Solis, uma aplicacao full stack para gestao de
conteudos educacionais, escolas, usuarios, colecoes didaticas, materiais
digitais e quizzes.

A documentacao descreve a arquitetura, os fluxos de negocio, os componentes da
solucao, os modelos de dados, a seguranca, os testes e o processo de deploy.

## Contexto da aplicacao

O Astera Solis organiza a operacao digital de uma editora educacional. A
plataforma centraliza conteudos e atividades avaliativas para diferentes perfis
de usuario.

A escolha do tema combina com uma editora porque o dominio envolve:

- catalogo de colecoes;
- materiais digitais de apoio;
- professores e estudantes;
- simulados e avaliacao;
- controle editorial;
- gestao por escola.

## Estrutura da solucao

O projeto usa um monorepo com duas aplicacoes:

```text
astera-solis-laravel-case/
  astera-solis-api/     # API Laravel
  astera-solis-web/     # Frontend Next.js
  deploy/               # Compose e templates nginx de producao
  scripts/              # Script de deploy em VPS
  docs/                 # Documentacao tecnica
```

Stack principal:

- Laravel como API;
- PostgreSQL como banco relacional;
- Redis para cache/fila;
- Laravel Sanctum com cookie HttpOnly e CSRF;
- Next.js App Router com TypeScript;
- Tailwind CSS;
- Docker e Docker Compose;
- GitHub Actions;
- GHCR;
- nginx e certbot na VPS.

## Escopo tecnico

A aplicacao foi organizada para manter responsabilidades claras entre frontend,
backend, banco de dados e infraestrutura:

- API com routes, controllers, Form Requests, policies, resources e services;
- banco modelado com migrations e relacionamentos Eloquent;
- autenticao SPA realista com Sanctum;
- permissoes por perfil;
- testes de regras importantes;
- frontend consumindo a API real;
- deploy com imagens Docker e pipeline automatizado;
- seed idempotente para ambientes de homologacao e apresentacao.

## Leitura recomendada

Para entender a solucao rapidamente:

1. Leia `02-visao-geral-da-solucao.md`.
2. Leia `04-arquitetura-fullstack.md`.
3. Leia `05-autenticacao-sanctum.md`.
4. Leia `10-deploy-ci-cd-e-operacao.md`.
5. Rode o projeto seguindo `12-execucao-local-e-comandos.md`.
