---
name: Paulo Rocha
description: Portfólio de engenheiro backend em Go, escuro e limpo, em cards, com violeta e azul e uma versão clara.
colors:
  bg: '#15131f'
  surface: '#1e1c2b'
  surface-2: '#272539'
  border: '#322f49'
  fg: '#f3f1ff'
  muted: '#aeaacd'
  accent: '#a58bff'
  accent-2: '#5ba2ff'
  accent-fg: '#15131f'
  bg-light: '#f7f5ff'
  surface-light: '#ffffff'
  surface-2-light: '#efebfb'
  border-light: '#ddd6f3'
  fg-light: '#1a1632'
  muted-light: '#565080'
  accent-light: '#5b34d6'
  accent-2-light: '#1d5fd8'
  accent-fg-light: '#ffffff'
typography:
  display:
    fontFamily: 'Bricolage Grotesque Variable, ui-sans-serif, system-ui, sans-serif'
    fontSize: 'clamp(2.4rem, 8.5vw, 4.75rem)'
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: '-0.03em'
  headline:
    fontFamily: 'Bricolage Grotesque Variable, ui-sans-serif, system-ui, sans-serif'
    fontSize: 'clamp(2rem, 7vw, 3.75rem)'
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: '-0.02em'
  title:
    fontFamily: 'Bricolage Grotesque Variable, ui-sans-serif, system-ui, sans-serif'
    fontSize: 'clamp(1.4rem, 4.4vw, 2rem)'
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: '-0.02em'
  body:
    fontFamily: 'Hanken Grotesk Variable, ui-sans-serif, system-ui, sans-serif'
    fontSize: '1.0625rem'
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: 'Hanken Grotesk Variable, ui-sans-serif, system-ui, sans-serif'
    fontSize: '0.875rem'
    fontWeight: 400
    lineHeight: 1.5
rounded:
  card: '14px'
  metric: '12px'
  logo: '16px'
  pill: '9999px'
spacing:
  card: '20px'
  card-lg: '32px'
  gutter: '16px'
  gutter-md: '32px'
components:
  button-primary:
    backgroundColor: '{colors.accent}'
    textColor: '{colors.accent-fg}'
    rounded: '{rounded.pill}'
    padding: '0 32px'
    height: '56px'
  button-secondary:
    backgroundColor: '{colors.bg}'
    textColor: '{colors.fg}'
    rounded: '{rounded.pill}'
    padding: '0 24px'
    height: '48px'
  card:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.fg}'
    rounded: '{rounded.card}'
    padding: '{spacing.card}'
  metric-tile:
    backgroundColor: '{colors.bg}'
    textColor: '{colors.fg}'
    rounded: '{rounded.metric}'
    padding: '16px'
  chip:
    backgroundColor: '{colors.surface-2}'
    textColor: '{colors.muted}'
    rounded: '{rounded.pill}'
    padding: '4px 12px'
---

# Design System: Paulo Rocha

## Overview

**Creative North Star: "The Straight Dossier"**

O padrão da categoria executado sem enfeite: um portfólio de desenvolvedor em cards, na estrutura do template do Figma, com violeta e azul no lugar do verde. Escuro é o tema de origem, um grafite arroxeado com superfícies elevadas e bordas de 1px. O claro é um lavanda pálido com superfícies brancas. Nada na página existe só para decorar: o peso visual vai para os números reais dos sistemas.

A voz é de quem mostra prova. Títulos em grotesca confiante, texto em humanista calmo, cards de um só nível e pouco movimento: o carrossel de empresas é o único elemento que se move sozinho, o resto só reage ao scroll ou a uma ação da pessoa. O gradiente é raro de propósito: aparece no trecho destacado do título e no botão principal, e em mais nenhum lugar.

**Key Characteristics:**

- Dois temas por tokens semânticos; componentes nunca usam cor literal.
- Cards planos: superfície, borda de 1px, sem pilha de sombras.
- Gradiente violeta para azul só no destaque do título e nos botões primários.
- Mobile-first a partir de 360px; alvos de toque de pelo menos 44px.
- Números em `tabular-nums`; monoespaçada não é usada.

## Colors

Grafite arroxeado no escuro, lavanda pálido no claro, com os mesmos dois acentos (violeta e azul) nos dois temas, ajustados para passar AA em cada fundo. Os valores do tema claro levam o sufixo `-light` no frontmatter; no CSS são os mesmos tokens redefinidos em `:root[data-theme='light']`.

### Primary

- **Violeta Lavanda** (`accent`): links decorados, rótulos de definição, seta do antes/depois, ponto da marca, anel da foto. No claro vira o violeta profundo `accent-light`.
- **Azul Céu** (`accent-2`): fim do gradiente, anel de foco, sublinhado dos links de contato. No claro vira `accent-2-light`.

### Neutral

- **Grafite Violeta** (`bg`): fundo da página e dos blocos de métrica.
- **Superfície Elevada** (`surface`): cards. `surface-2` serve a chips e a estados ativos.
- **Fio Violeta** (`border`): toda borda de 1px e divisórias da timeline.
- **Névoa** (`fg`): texto principal e títulos. **Lilás Cinza** (`muted`): texto secundário, legendas, datas.

### Named Rules

**The Two-Place Gradient Rule.** O gradiente violeta para azul existe em dois lugares: o trecho destacado do `h1` e o botão de ação principal (`.bg-brand`, repetido em "Enviar e-mail", no CTA do currículo e na 404). Qualquer outro uso é erro.

**The Token-Only Rule.** Nenhum componente carrega hex, `rgb` ou classe de paleta crua. Se falta uma cor, nasce um token em `global.css`.

## Typography

**Display Font:** Bricolage Grotesque Variable (com `ui-sans-serif`, `system-ui`)
**Body Font:** Hanken Grotesk Variable (com `ui-sans-serif`, `system-ui`)

**Character:** Uma grotesca de título com personalidade, ao lado de uma humanista legível em tela pequena. Ambas hospedadas no próprio site, sem CDN.

### Hierarchy

- **Display** (700, `clamp(2.4rem, 8.5vw, 4.75rem)`, 1.04, -0.03em): só o `h1` da home, medida máxima de 20ch.
- **Headline** (600, `clamp(2rem, 7vw, 3.75rem)`, 1.08): títulos de seção. O título do contato usa 700 e `clamp(2.4rem, 9vw, 5rem)`.
- **Title** (600, `clamp(1.4rem, 4.4vw, 2rem)`, 1.08): título de cada case.
- **Body** (400, 17px, 1.6): texto corrido; parágrafos de apoio ficam entre 46ch e 60ch.
- **Label** (400, 14px): legendas de métrica, datas, chips e localização.

### Named Rules

**The Tabular Numbers Rule.** Métricas, datas e percentuais usam `tabular-nums lining-nums`. O número é a prova; ele não pode dançar.

**The Balanced Heading Rule.** Todo `h1`–`h3` usa `text-wrap: balance`. Quebras ruins ("sobre o" sozinho) se corrigem com espaço não separável, não com `<br>`.

## Layout

Coluna única no celular, com gutter de 16px; em `md` o gutter passa a 32px e o conteúdo se limita a 68rem, centralizado. O ritmo vertical é generoso entre seções e curto dentro dos grupos. O primeiro viewport traz foto, título, uma linha de posicionamento, o botão primário e o link do currículo, e a faixa de três cards (Biografia, O que eu uso, Disponibilidade) aparece logo abaixo no celular. Os cases viram duas colunas (7/5) em `md`: texto à esquerda, métricas à direita. A timeline usa grade de 3/9 colunas em `md`. Sem scroll horizontal em 320px; alturas usam `dvh`, nunca `vh`.

## Elevation & Depth

Plano por camadas tonais: a profundidade vem da diferença entre `bg`, `surface` e `surface-2`, mais uma borda de 1px. Não há sombra em nenhum componente. O cabeçalho fixo usa `bg/90` com `backdrop-blur-sm`, um efeito funcional para o texto passar por trás sem ruído.

### Named Rules

**The One-Edge Rule.** A elevação se declara uma vez, por borda. Card com borda e sombra larga junto é proibido.

## Shapes

Cards de 14px de raio; blocos de métrica de 12px; tiles de logo de 16px; botões, chips e o botão de tema são pílulas. Foto de perfil em círculo com anel de 2px no violeta. Logos são tiles uniformes de 148px de altura (2x), cada um sobre o fundo da própria marca; a marca Banco Original foi refeita em verde sólido sobre branco porque a fonte, clara sobre escuro, sumia no tema escuro.

## Components

### Buttons

- **Shape:** pílula (9999px).
- **Primary:** gradiente violeta para azul, texto `accent-fg`, altura mínima de 56px, padding horizontal de 32px, peso 600. Sobe 2px no hover, com seta que desliza 4px.
- **Secondary:** transparente, borda de 1px `border`, altura mínima de 48px; a borda vira `accent` no hover. Serve ao "Baixar currículo (PDF)".
- **Focus:** anel de 2px em `accent-2`, afastado 3px.

### Chips

- **Style:** fundo `surface-2`, texto `muted`, borda de 1px, pílula, 14px.
- **State:** estáticos; listam tecnologias de cada case. Na seção de stack o chip leva o logo da tecnologia (20px, monocromático em `accent` via máscara) antes do nome; sem logo, só o texto.

### Cards / Containers

- **Corner Style:** 14px. **Background:** `surface`. **Border:** 1px `border`. **Padding:** 20px, 32px em `md` nos cases.
- **Hover:** só os cards que são links sobem 2px e trocam a borda para `accent`.

### Metric tile

Bloco de 12px sobre `bg`, rótulo em `muted` e valor em display 600 de 24px. Quando há antes e depois, o valor antigo vem riscado em `muted` e uma seta violeta leva ao novo; a leitura para tecnologia assistiva diz "para".

### Navigation

Cabeçalho fixo com marca, links centrais no desktop, botão de tema e menu em círculo de 44px no celular. O link ativo ganha um sublinhado de 2px em `accent` que cresce da esquerda.

### Carrossel de logos (componente de assinatura)

Faixa que desliza a 42s, em duas listas, com borda esmaecida por máscara alfa. Pausa no hover e no foco; com `prefers-reduced-motion` vira uma grade estática. Cada logo traz o nome em legenda de 12px, presa à largura do tile. É o único elemento que se move sozinho na página, sem depender de scroll ou ação.

### Gopher (stack)

Botão de 44px ou mais com o gopher oficial (Renée French, vetor de Takuya Ueda, CC BY 3.0, crédito no rodapé), ao lado do chip de Go. Ao tocar, dá um pulo curto de transform e um balão mostra uma métrica real dos cases. Só se move por ação da pessoa; com `prefers-reduced-motion` o pulo some e o balão continua trocando de texto.

### Movimento por scroll e ação

Regra geral: o movimento responde ao scroll ou a uma ação da pessoa, acontece uma vez e usa só `transform` e `opacity` (exceção: expandir/recolher anima a altura via `interpolate-size`). Nenhuma mudança de estado é seca: toda abertura, fechamento e troca de texto, ícone ou tema tem transição (regra em AGENTS.md, "Movimento"). Sem biblioteca; tokens `--ease-out`, `--dur-fast` e `--dur-base` em `global.css`. Tudo some com `prefers-reduced-motion: reduce`, e em navegadores sem suporte o conteúdo simplesmente aparece estático.

- **Entrada (`.reveal`):** blocos sobem 12px e aparecem ao entrar na tela (`animation-timeline: view()`, sem JS). Usada em cabeçalhos de seção, cases, carrosséis, stack, GitHub e cada cargo. O hero não anima, para não atrasar o LCP.
- **Números dos cases:** o valor final já está no HTML. Ao entrar na tela (uma vez), números simples contam de zero até o valor em 900ms. Intervalos ("15–25 s") e palavras ("nunca") não animam.
- **Trajetória:** timeline com trilho sólido à esquerda (sem gradiente) que se desenha com o scroll e um nó por cargo (preenchido no cargo atual). Cada cargo abre com `<details>` nativo, mostrando realizações e stack com altura e fade de 300ms (Web Animations API, funciona em todos os navegadores); o primeiro vem aberto. Rótulo e chevron trocam em cross-fade.
- **Paleta de comandos (Ctrl/Cmd+K):** `<dialog>` nativo com busca e ações (seções, páginas, tema, currículo, copiar e-mail, LinkedIn, GitHub). No desktop há o botão "Buscar" no header; no celular, o item "Buscar no site" no menu. Itens de 44px, selecionado marcado por barra e fundo, entrada e saída de 150ms (fade e leve deslocamento, backdrop incluso). Lista vazia e aviso de cópia entram e saem com fade.
- **Entre páginas:** `@view-transition` troca `/`, `/projetos` e `/curriculo` com fade; o header tem nome próprio para ficar parado.

## Do's and Don'ts

### Do:

- **Do** usar só tokens semânticos (`bg-surface`, `text-muted`, `border-line`) e deixar o tema trocar os valores.
- **Do** reservar o gradiente ao destaque do título e ao botão de ação principal.
- **Do** mostrar números reais com `tabular-nums`, e o antes riscado quando houver comparação.
- **Do** animar toda mudança de estado com os tokens de movimento; reduced-motion vai direto ao estado final.
- **Do** manter alvos de toque de 44px ou mais e foco visível em `accent-2`.
- **Do** gerar logos pelo `scripts/optimize-logos.mjs`, nunca à mão, para manter o tile uniforme.

### Don't:

- **Don't** pôr gradiente em ponto de marca, ícone, borda, card ou texto corrente.
- **Don't** alternar `hidden`/`display` sem transição (abre e fecha "seco").
- **Don't** reintroduzir o conceito de renda/fios, descartado pelo usuário.
- **Don't** empilhar sombra sobre borda, nem aninhar cards.
- **Don't** usar cor literal, classe de paleta crua, `max-*:`, `vh` ou largura fixa de 100px ou mais.
- **Don't** colocar telefone no HTML público, nem CDN ou rastreador de terceiros.
