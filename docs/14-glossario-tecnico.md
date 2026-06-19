# Glossario Tecnico

## Laravel

Framework PHP para criar aplicacoes web, APIs, jobs, comandos, testes,
migrations e integracoes.

## MVC

Padrao que separa Model, View e Controller. No Astera Solis, o Laravel usa
Models e Controllers, mas a View principal e o frontend Next.js. No backend, a
resposta visual e substituida por API Resources em JSON.

## Eloquent

ORM do Laravel. Permite trabalhar com tabelas como models PHP e criar
relacionamentos como `hasMany`, `belongsTo` e `belongsToMany`.

## Migration

Arquivo versionado que cria ou altera estrutura do banco. E o historico de
schema do projeto.

## Seeder

Classe que popula o banco com dados iniciais.

## Form Request

Classe do Laravel usada para validar entrada de dados antes do controller
executar a regra.

## Policy

Classe que centraliza autorizacao de acoes sobre um model.

## API Resource

Classe que transforma models em JSON de resposta.

## Sanctum

Pacote Laravel para autenticar SPAs, mobile apps e tokens simples. Neste projeto,
foi usado no modo SPA com cookie.

## CSRF

Protecao contra requisicoes falsas vindas de outros sites. Em escritas, o
frontend envia o token XSRF para o Laravel validar.

## Cookie HttpOnly

Cookie que o JavaScript nao consegue ler diretamente. Isso ajuda a reduzir
risco em ataques XSS.

## Redis

Banco em memoria usado para cache, filas e dados temporarios.

## GHCR

GitHub Container Registry. Guarda as imagens Docker geradas pelo GitHub
Actions.

## FrankenPHP

Runtime moderno para rodar aplicacoes PHP em container, usado na imagem de
producao da API.

## Next.js App Router

Modelo de roteamento do Next.js usado para organizar paginas, layouts e
componentes da aplicacao web.

## Tailwind CSS

Framework CSS utilitario usado para criar a interface do frontend com classes
componiveis.

## Docker Compose

Ferramenta usada para orquestrar API, frontend, PostgreSQL, Redis e worker em
ambientes locais ou de VPS.

## GitHub Actions

Plataforma de automacao usada para executar testes, lint, build das imagens
Docker e deploy na VPS.
