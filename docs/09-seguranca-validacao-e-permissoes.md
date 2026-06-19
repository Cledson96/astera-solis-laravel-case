# Seguranca, Validacao e Permissoes

## Camadas de protecao

O projeto protege a aplicacao em varias camadas:

- autenticao com Sanctum;
- CSRF nas requisicoes de escrita;
- cookies HttpOnly para sessao;
- CORS configurado para frontend;
- Form Requests para validacao;
- Policies para autorizacao;
- senha com hash automatico no model User;
- dados sensiveis escondidos via `Hidden`.

## Autenticacao

Rotas publicas:

```text
POST /api/auth/register
POST /api/auth/login
```

Rotas protegidas:

```text
GET  /api/auth/me
POST /api/auth/logout
apiResource schools
apiResource collections
apiResource materials
apiResource quizzes
POST /api/quizzes/{quiz}/attempts
```

## Matriz de permissoes

```text
admin:
  tudo

editor:
  visualiza e gerencia colecoes, materiais e quizzes

teacher:
  visualiza dados educacionais

student:
  visualiza conteudo e envia tentativa de quiz
```

## Por que usar policies

Policies deixam a autorizacao perto do recurso. Em vez de espalhar `if role`
por controllers e componentes, cada model tem uma classe de regra.

Exemplo conceitual:

```php
public function create(User $user): bool
{
    return $user->isEditor();
}
```

Com `before`, o admin consegue passar por todas as regras:

```php
public function before(User $user, string $ability): ?bool
{
    return $user->isAdmin() ? true : null;
}
```

## Validacao

Form Requests validam dados antes da persistencia. Isso facilita respostas 422
padronizadas para o frontend.

Exemplos:

- `StoreCollectionRequest`;
- `UpdateCollectionRequest`;
- `StoreMaterialRequest`;
- `UpdateMaterialRequest`;
- `StoreQuizRequest`;
- `UpdateQuizRequest`;
- `SubmitQuizAttemptRequest`;
- `LoginRequest`;
- `RegisterRequest`.

## Erros esperados

```text
401 Unauthorized:
  usuario nao autenticado

403 Forbidden:
  usuario autenticado, mas sem permissao

422 Unprocessable Entity:
  payload invalido

204 No Content:
  exclusao realizada com sucesso
```

