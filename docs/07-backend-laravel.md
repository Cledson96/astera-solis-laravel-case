# Backend Laravel

## Estrutura principal

```text
astera-solis-api/
  app/
    Http/
      Controllers/Api/
      Requests/
      Resources/
    Models/
    Policies/
    Services/
  database/
    migrations/
    seeders/
    factories/
  routes/
    api.php
    console.php
  tests/
```

## Rotas da API

Principais rotas:

```text
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
POST   /api/auth/logout

GET    /api/schools
POST   /api/schools
GET    /api/schools/{school}
PUT    /api/schools/{school}
DELETE /api/schools/{school}

GET    /api/collections
POST   /api/collections
GET    /api/collections/{collection}
PUT    /api/collections/{collection}
DELETE /api/collections/{collection}

GET    /api/materials
POST   /api/materials
GET    /api/materials/{material}
PUT    /api/materials/{material}
DELETE /api/materials/{material}

GET    /api/quizzes
POST   /api/quizzes
GET    /api/quizzes/{quiz}
PUT    /api/quizzes/{quiz}
DELETE /api/quizzes/{quiz}

POST   /api/quizzes/{quiz}/attempts
```

As rotas de dominio ficam protegidas por `auth:sanctum`.

## Controller fino

Os controllers nao concentram regra pesada. Eles fazem:

- autorizacao;
- chamada de validacao via Form Request;
- consulta ou persistencia simples;
- retorno com API Resource.

Exemplo de responsabilidade:

```text
Controller -> autoriza -> valida -> executa -> retorna Resource
```

## Form Requests

Os Form Requests cuidam das regras de entrada:

- campos obrigatorios;
- tipos;
- tamanho maximo;
- existencia de relacionamentos;
- unicidade;
- dados permitidos.

Isso evita validacao espalhada nos controllers.

## API Resources

Resources controlam o JSON de saida. Isso ajuda a nao vazar estrutura interna
do model e permite incluir relacoes apenas quando carregadas.

## Policies

Policies implementam regras por perfil:

- admin tem `before` e pode tudo;
- editor cria e edita conteudo editorial;
- teacher visualiza;
- student visualiza e responde quiz.

## Services

O service `SubmitQuizAttempt` concentra a regra de negocio do envio de quiz:

1. busca as questoes;
2. compara respostas com gabarito;
3. calcula pontuacao;
4. define aprovacao;
5. grava a tentativa.

Essa regra saiu do controller porque ela tem comportamento de dominio.

## Comando seed-once

Em `routes/console.php`, o comando `app:seed-once` roda o seed inicial apenas
se a execucao ainda nao estiver registrada em `seed_runs`.

Isso e util para a VPS:

- primeiro deploy popula o ambiente;
- proximos deploys nao duplicam registros;
- producao real poderia desligar isso por variavel.
