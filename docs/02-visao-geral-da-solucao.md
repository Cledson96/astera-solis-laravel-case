# Visao Geral da Solucao

## Produto

Astera Solis e uma plataforma educacional para uma editora. Ela permite
organizar conteudos didaticos, materiais digitais e atividades avaliativas por
perfil de usuario.

## Perfis

```text
admin:
  gerencia tudo

editor:
  cria e edita colecoes, materiais e quizzes

teacher:
  visualiza colecoes, materiais, quizzes e tentativas

student:
  visualiza materiais e responde quizzes
```

## Modulos

### Escolas

Representam instituicoes atendidas pela editora. Usuarios professores e
estudantes podem estar vinculados a uma escola.

### Colecoes

Representam linhas didaticas, por exemplo uma colecao infantil, uma colecao de
ciencias ou uma colecao de humanidades.

### Materiais

Representam conteudos digitais da colecao:

- ebook;
- video;
- quiz;
- PDF;
- game.

### Quizzes

Representam simulados ou avaliacoes. Cada quiz possui questoes, alternativas,
gabarito, nota minima e tentativas.

### Tentativas

Quando um estudante responde um quiz, a API calcula a pontuacao, grava as
respostas e informa se ele foi aprovado.

## Credenciais do ambiente inicial

Os seeders criam usuarios iniciais para acesso ao ambiente:

```text
admin@astera.test   / password
editor@astera.test  / password
teacher@astera.test / password
student@astera.test / password
```
