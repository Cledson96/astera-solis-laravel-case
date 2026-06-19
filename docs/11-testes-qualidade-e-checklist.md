# Testes, Qualidade e Checklist

## Testes backend

O backend possui testes feature para validar os fluxos mais importantes:

- login com CSRF;
- login invalido;
- rota protegida sem sessao;
- logout;
- usuario autenticado consultando perfil;
- estudante impedido de criar colecao;
- editor criando material;
- admin gerenciando escolas;
- estudante enviando tentativa de quiz;
- seed-once executando apenas uma vez.

## Comandos

```bash
cd astera-solis-api
php artisan test
vendor/bin/pint --test
php artisan route:list
```

Frontend:

```bash
cd astera-solis-web
npm run lint
npm run build
```

Docker:

```bash
docker compose config
docker compose -f deploy/docker-compose.vps.yml config
```

## Checklist antes de apresentar

```text
[ ] API sobe sem erro
[ ] Frontend sobe sem erro
[ ] Login admin funciona
[ ] Login editor funciona
[ ] Login student funciona
[ ] Dashboard carrega dados reais
[ ] Colecoes listam dados da API
[ ] Materiais listam dados da API
[ ] Quizzes listam dados da API
[ ] Student consegue responder quiz
[ ] Editor consegue criar conteudo
[ ] Student nao consegue criar colecao
[ ] Testes Laravel passam
[ ] Build Next.js passa
[ ] Deploy Actions esta verde
[ ] HTTPS esta ativo nos dominios
```

## Roteiro de validacao funcional

1. Entrar como `admin@astera.test`.
2. Mostrar dashboard com dados vindos da API.
3. Abrir colecoes e explicar relacionamento com materiais e quizzes.
4. Entrar como `editor@astera.test`.
5. Criar ou editar uma colecao/material.
6. Entrar como `student@astera.test`.
7. Responder um quiz.
8. Mostrar pontuacao calculada pelo backend.
9. Explicar rapidamente o fluxo Sanctum.
10. Mostrar GitHub Actions e deploy em VPS.

## Perguntas que podem aparecer

## Observacoes de qualidade

### Uso do Laravel

Laravel concentra API, validacao, ORM, migrations, policies, testes e
autenticacao, mantendo o backend organizado em camadas conhecidas do
ecossistema.

### MVC na API

Models representam dados e relacionamentos, controllers recebem as requisicoes,
e a camada de apresentacao no backend e feita por API Resources. Como o
frontend e Next.js, as views Blade nao fazem parte do fluxo principal.

### Regra de negocio

Parte esta nos models e policies, e a regra de calculo de tentativa de quiz
esta no service `SubmitQuizAttempt`.

### Banco relacional

O dominio e relacional: usuarios pertencem a escolas, colecoes possuem
materiais e quizzes, quizzes possuem questoes e tentativas.

### Containerizacao

Docker padroniza ambiente local e deploy. A VPS nao precisa buildar nada, ela
baixa imagens prontas do GHCR.
