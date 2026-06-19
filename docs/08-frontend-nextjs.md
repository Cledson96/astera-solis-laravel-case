# Frontend Next.js

## Estrutura principal

```text
astera-solis-web/
  src/
    app/
      dashboard/
      collections/
      materials/
      quizzes/
      login/
    components/
    lib/
```

## App Router

O frontend usa o App Router do Next.js. As telas ficam dentro de `src/app` e
compartilham componentes de layout, cards, badges, formulario de login e
componentes de feedback.

## Consumo da API

O arquivo `src/lib/api.ts` define o cliente HTTP base:

- usa `NEXT_PUBLIC_API_URL`;
- envia `credentials: "include"`;
- busca CSRF antes de escritas;
- inclui `X-XSRF-TOKEN` quando necessario.

## Leituras

As leituras usam helpers em `src/lib/read-api.ts`, que normalizam retorno da
API Laravel, paginação e erros.

## Escritas

As escritas usam `src/lib/mutations.ts`, chamando:

```text
POST
PUT
PATCH
DELETE
```

Antes de cada escrita, o frontend chama o fluxo CSRF.

## Telas

### Login

Permite entrar com os usuarios de seed e inicia o fluxo Sanctum.

### Dashboard

Carrega usuario logado, colecoes, materiais e quizzes diretamente da API.

### Colecoes

Lista colecoes e permite criar, editar e excluir quando o perfil tem permissao.

### Materiais

Lista materiais associados as colecoes e permite operacoes conforme permissao.

### Quizzes

Lista quizzes e permite criar, editar, excluir e responder.

### Detalhe do quiz

Mostra questoes, alternativas e envia tentativa para a API calcular a nota.

## Interface

A interface usa Tailwind com componentes proprios. O foco visual e ser claro
para uso operacional: cards, tabelas, badges de status, formularios e feedback
de erro/sucesso.

## Integracao com a API

- O frontend nao usa dados mockados nas telas principais.
- A API Laravel e a fonte real dos dados.
- O login depende do cookie Sanctum.
- A permissao visual acompanha a role do usuario logado.
- As operacoes de escrita usam CSRF.
