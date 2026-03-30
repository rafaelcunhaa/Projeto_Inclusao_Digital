# Inclusão Digital — Plataforma Web de Capacitação Tecnológica

Projeto front-end para promoção de inclusão digital, com foco em trilhas gratuitas, acompanhamento de progresso e experiência de navegação acessível. A aplicação inicia em `index.html` e direciona o usuário para páginas de cursos, perfil, conteúdo institucional e rede social.

---

## Visão Geral

A plataforma foi pensada para apoiar aprendizado tecnológico de forma prática, gratuita e inclusiva, alinhada aos ODS 4 (Educação de Qualidade) e ODS 9 (Inovação e Infraestrutura). O projeto contém:

- **Página inicial com onboarding completo** (hero, catálogo de cursos, autenticação, newsletter e depoimentos).
- **Fluxo de autenticação** com suporte a Firebase e fallback para `localStorage`.
- **Bloqueio de acesso às aulas para usuários não autenticados** com modal orientando cadastro/login.
- **Página de curso** com módulos, progresso e persistência do avanço.
- **Página de perfil** com progresso consolidado, preferências e configurações do usuário.

---

## Estrutura do Projeto

```text
Projeto_Inclusao_Digital/
├── README.md
└── Informática e Sociedade/
    ├── index.html             # Landing page + autenticação + catálogo de cursos
    ├── curso.html             # Página de aulas/módulos e progresso
    ├── perfil.html            # Área do usuário e configurações
    ├── sobre.html             # Contexto institucional do projeto
    ├── rede_social.html       # Página de comunidade e divulgação
    ├── styles.css             # Estilos globais (home, sobre, perfil, etc.)
    ├── curso.css              # Estilos específicos do curso
    ├── firebase-config.js     # Camada de autenticação/dados (Firebase + fallback)
    ├── notifications.js       # Toast notifications
    └── back.js                # Simulação local de backend (localStorage)
```

---

## Funcionalidades Principais

### 1) Home (`index.html`)
- Navegação responsiva (menu mobile + tema claro/escuro).
- Busca/filtro de cursos por texto e categoria.
- Cards de cursos com CTA para acesso às aulas.
- Formulários de login e cadastro na própria home.
- Modal de proteção para usuários não autenticados ao tentar entrar no curso.

### 2) Curso (`curso.html`)
- Lista de módulos clicáveis.
- Progresso visual por barra e percentual.
- Salvamento de avanço por usuário (Firebase ou fallback local).
- Redirecionamento para home se o usuário não estiver autenticado.

### 3) Perfil (`perfil.html`)
- Dados básicos do usuário (nome/e-mail/avatar).
- Indicadores de progresso total, cursos concluídos e horas estimadas.
- Configurações de conta e tema.
- Logout integrado.

### 4) Conteúdo Institucional (`sobre.html` e `rede_social.html`)
- Explicação sobre o propósito do projeto.
- Conexão com comunidade e canais externos.

---

## Arquitetura de Dados e Autenticação

A aplicação possui uma estratégia híbrida:

1. **Modo Firebase (preferencial)**
   - Quando `firebase-config.js` está configurado com credenciais válidas.
   - Autenticação e persistência via Firestore/Auth.

2. **Modo Fallback localStorage**
   - Ativado automaticamente quando as credenciais são placeholders (`SEU_*`) ou Firebase indisponível.
   - Mantém funcionamento local para demo/desenvolvimento.

### Entidades utilizadas (conceitualmente)
- **users**: dados de autenticação/perfil.
- **progress**: progresso por curso/usuário.
- **newsletter**: e-mails inscritos.

---

## Como Executar Localmente

Como é uma aplicação estática, basta servir os arquivos por um servidor local.

### Opção rápida com Python
```bash
cd "Informática e Sociedade"
python -m http.server 5500
```
Abra no navegador: `http://localhost:5500/index.html`

### Opção com VS Code
- Instale a extensão **Live Server**.
- Abra a pasta `Informática e Sociedade`.
- Clique em **Go Live** e acesse `index.html`.

---

## Configuração do Firebase (opcional, recomendado para produção)

Edite o arquivo `Informática e Sociedade/firebase-config.js` e substitua os placeholders pelos dados reais do seu projeto Firebase:

- `apiKey`
- `authDomain`
- `projectId`
- `storageBucket`
- `messagingSenderId`
- `appId`

Após configurar, o app passa a utilizar Firebase automaticamente.

---

## Padrões de UX implementados

- **Acessibilidade básica**: skip-link e atributos ARIA em pontos-chave.
- **Feedback visual**: toasts para operações importantes.
- **Navegação orientada**: estado ativo em menu e CTAs claros.
- **Proteção de fluxo**: acesso às aulas condicionado à autenticação.
- **Responsividade**: layout adaptado para desktop/mobile.

---

## Melhorias futuras recomendadas

1. **Separar scripts inline em módulos JS** (`/js/core`, `/js/pages`).
2. **Adicionar testes E2E** (Playwright/Cypress) para login, acesso a curso e progresso.
3. **Adicionar validações mais robustas de formulário** (senhas, mensagens de erro por campo).
4. **Internacionalização (i18n)** para suporte multilíngue.
5. **Pipeline CI** (lint + testes + build check).
6. **Monitoramento de erros** (Sentry ou equivalente).

---

## Licença

Uso educacional/acadêmico. Ajuste a licença conforme necessidade institucional (MIT, Apache-2.0, etc.).

---

## Contato e Contribuição

Se você for evoluir este projeto:
- Crie branch por funcionalidade (`feat/...`, `fix/...`).
- Faça commits pequenos e semânticos.
- Atualize este README quando mudar fluxo de autenticação, rotas ou arquitetura.

> Este README foi estruturado para facilitar onboarding técnico de novos colaboradores e dar visão executiva do sistema.
