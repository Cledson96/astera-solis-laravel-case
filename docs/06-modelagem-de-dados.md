# Modelagem de Dados

## Entidades

```mermaid
erDiagram
  SCHOOLS ||--o{ USERS : possui
  COLLECTIONS ||--o{ MATERIALS : contem
  COLLECTIONS ||--o{ QUIZZES : possui
  QUIZZES ||--o{ QUESTIONS : possui
  QUIZZES ||--o{ QUIZ_ATTEMPTS : recebe
  USERS ||--o{ QUIZ_ATTEMPTS : realiza

  SCHOOLS {
    bigint id
    string name
    string city
    string state
    string inep_code
    boolean active
  }

  USERS {
    bigint id
    string name
    string email
    string password
    string role
    bigint school_id
  }

  COLLECTIONS {
    bigint id
    string title
    string slug
    text description
    string segment
    string subject
    boolean active
  }

  MATERIALS {
    bigint id
    bigint collection_id
    string title
    string type
    text summary
    string url
    integer estimated_minutes
    boolean active
  }

  QUIZZES {
    bigint id
    bigint collection_id
    string title
    text description
    integer passing_score
    boolean active
  }

  QUESTIONS {
    bigint id
    bigint quiz_id
    text statement
    json options
    string correct_option
    integer points
  }

  QUIZ_ATTEMPTS {
    bigint id
    bigint quiz_id
    bigint user_id
    json answers
    integer score
    boolean approved
    timestamp submitted_at
  }
```

## Decisoes de modelagem

### Role como string

O campo `role` usa string em vez de enum nativo do PostgreSQL. Essa escolha
facilita migrations, testes e alteracoes futuras nos perfis de acesso.

### JSON em questions.options

As alternativas ficam em JSON para manter o quiz simples:

```json
{
  "A": "Resposta A",
  "B": "Resposta B",
  "C": "Resposta C",
  "D": "Resposta D"
}
```

### JSON em quiz_attempts.answers

As respostas do estudante tambem ficam em JSON, mapeando `question_id` para
opcao marcada.

### seed_runs

A tabela `seed_runs` registra se o seed inicial ja foi executado no ambiente.
Isso permite popular o banco automaticamente no primeiro deploy sem duplicar
dados nos deploys seguintes.

## Relacionamentos Eloquent

Principais relacionamentos:

- `User belongsTo School`;
- `User hasMany QuizAttempt`;
- `School hasMany User`;
- `Collection hasMany Material`;
- `Collection hasMany Quiz`;
- `Material belongsTo Collection`;
- `Quiz belongsTo Collection`;
- `Quiz hasMany Question`;
- `Quiz hasMany QuizAttempt`;
- `Question belongsTo Quiz`;
- `QuizAttempt belongsTo Quiz`;
- `QuizAttempt belongsTo User`.

## Casts importantes

```php
// Question
'options' => 'array'

// QuizAttempt
'answers' => 'array'
'submitted_at' => 'datetime'
'approved' => 'boolean'
```
