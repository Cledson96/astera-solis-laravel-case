# Arquitetura Fullstack

## Visao geral

```mermaid
flowchart TB
  User["Usuario no browser"]
  Next["Next.js App Router"]
  Laravel["Laravel API"]
  Sanctum["Laravel Sanctum"]
  Policies["Policies"]
  Services["Services e Actions"]
  Eloquent["Eloquent Models"]
  Postgres["PostgreSQL"]
  Redis["Redis"]
  Worker["Queue Worker"]

  User --> Next
  Next -->|HTTP com credentials include| Laravel
  Laravel --> Sanctum
  Laravel --> Policies
  Laravel --> Services
  Services --> Eloquent
  Laravel --> Eloquent
  Eloquent --> Postgres
  Laravel --> Redis
  Worker --> Redis
  Worker --> Laravel
```

## Separacao de responsabilidades

### Frontend

O frontend se concentra em:

- autenticar o usuario;
- renderizar telas;
- enviar formularios;
- mostrar estados de carregamento, erro e sucesso;
- respeitar permissoes vindas do usuario logado.

### Backend

O backend se concentra em:

- autenticar sessoes;
- validar dados;
- autorizar acoes por perfil;
- persistir e consultar dados;
- calcular pontuacao de quizzes;
- expor JSON para o frontend.

### Banco

O PostgreSQL guarda os dados relacionais. Redis fica reservado para cache e
fila, principalmente no ambiente Docker/VPS.

## Fluxo de autenticacao

```mermaid
sequenceDiagram
  participant U as Usuario
  participant W as Next.js
  participant A as Laravel API
  participant S as Sanctum
  participant DB as PostgreSQL

  U->>W: Preenche email e senha
  W->>A: GET /sanctum/csrf-cookie
  A->>W: Cookie XSRF-TOKEN
  W->>A: POST /api/auth/login
  A->>DB: Valida usuario
  A->>S: Cria sessao
  A->>W: Cookie de sessao HttpOnly
  W->>A: GET /api/auth/me
  A->>W: Dados do usuario logado
```

## Fluxo de criacao de colecao

```mermaid
sequenceDiagram
  participant E as Editor
  participant W as Next.js
  participant A as CollectionController
  participant R as StoreCollectionRequest
  participant P as CollectionPolicy
  participant DB as PostgreSQL

  E->>W: Envia formulario de colecao
  W->>A: POST /api/collections
  A->>R: Valida payload
  A->>P: Autoriza create
  P->>A: Permite admin/editor
  A->>DB: INSERT collections
  A->>W: CollectionResource JSON
```

## Fluxo de tentativa de quiz

```mermaid
sequenceDiagram
  participant S as Student
  participant W as Next.js
  participant C as QuizAttemptController
  participant V as SubmitQuizAttemptRequest
  participant A as SubmitQuizAttempt
  participant DB as PostgreSQL

  S->>W: Responde quiz
  W->>C: POST /api/quizzes/{quiz}/attempts
  C->>V: Valida respostas
  C->>A: handle(user, quiz, answers)
  A->>DB: Busca questoes e gabarito
  A->>A: Calcula score e approved
  A->>DB: INSERT quiz_attempts
  C->>W: Resultado da tentativa
```

## Deploy em alto nivel

```mermaid
flowchart LR
  Dev["Push main"]
  Actions["GitHub Actions"]
  Tests["Testes e build"]
  GHCR["GHCR"]
  VPS["VPS"]
  Compose["Docker Compose"]
  Nginx["nginx + certbot"]
  Browser["Browser"]

  Dev --> Actions
  Actions --> Tests
  Tests --> GHCR
  Actions --> VPS
  VPS --> Compose
  Compose --> Nginx
  Nginx --> Browser
```

