---
name: theming
description: Use ao criar ou alterar cores, tema escuro/claro, tokens, gradientes, sombras, toggle de tema ou qualquer estilo visual. Define a paleta roxo+azul, tokens semânticos em global.css, script anti-flash, contraste AA e regras de movimento.
---

# Tema escuro/claro (roxo + azul)

## Regra de ouro

Componentes **nunca** usam cor literal (`#7c3aed`, `rgb()`) nem classe de paleta crua (`bg-violet-600`, `text-white`). Só tokens semânticos; o hook `guard-write` barra. Cores literais existem apenas em `src/styles/global.css`.

## Tokens (`src/styles/global.css`)

- Semânticos por tema, expostos ao Tailwind via `@theme inline`: `bg-bg`, `bg-surface`, `bg-surface-2`, `border-line`, `text-fg`, `text-muted`, `text-accent` (violeta), `text-accent-2` (azul), `text-accent-fg`, `fill-heat-0..4` (painel do GitHub), `bg-code-bg`.
- Dark (padrão, perto do template do Figma): grafite arroxeado (`--bg` ~#15131f, superfícies um degrau acima, borda 1px). Light: lavanda clara com superfícies brancas e acentos mais escuros para manter contraste.
- Direção escolhida pelo usuário: padrão da categoria, cards no estilo do template. O gradiente violeta→azul existe **somente** em `.text-brand` (palavra de destaque do título) e `.bg-brand` (botão principal). Em qualquer outro lugar use cor sólida (`text-accent`, `border-accent`).
- Card único: classe `.card` (superfície, borda 1px, raio 14px, sem pilha de sombras). `a.card` ganha hover de borda e elevação de 2px.
- Use `color-mix(in oklab, …)` para estados em vez de novas cores.

## Mecânica do tema

- `<html data-theme="dark|light">`. Sem preferência salva, segue `prefers-color-scheme`. Selector: `:root[data-theme='dark']`, `:root[data-theme='light']`; `color-scheme` definido por tema.
- **Script inline anti-flash** no `<head>` (`is:inline`, antes do CSS): lê `localStorage.theme` em `try/catch`, aplica `data-theme` e atualiza `<meta name="theme-color">`. Sem flash e sem quebrar se o storage falhar.
- `ThemeToggle.astro`: botão de 44px com `aria-pressed`/`aria-label` ("Alternar para tema claro/escuro"), ícone sol/lua, persiste a escolha; também reage a mudanças do SO se o usuário não escolheu.
- O currículo (`/curriculo`) força `data-theme="light"` em impressão.

## Contraste e acessibilidade

- Texto normal AA ≥ 4.5:1, texto grande/ícones ≥ 3:1 nos **dois** temas; confira acento sobre superfície e sobre fundo. Foco visível (`--color-ring`) com 3:1.
- Nada só por cor (links sublinhados ou com marcador; estados com ícone/texto).

## Movimento

- Microanimações curtas (150–300ms), `transform`/`opacity` apenas. `@media (prefers-reduced-motion: reduce)` desliga marquee, parallax e transições longas (marquee vira grade estática).
- **Sem troca de estado seca** (regra do repositório, AGENTS.md "Movimento"). Receitas: `<details>` → Web Animations API no painel interno (`[data-panel]`, altura+opacity; `::details-content` não existe em Firefox/Safari, então não use sozinho); menu/painel → `grid-rows-[0fr]`→`[1fr]` + `invisible`/`inert`; `<dialog>` e `::backdrop` → `@starting-style` + `display`/`overlay` `allow-discrete`; toast/estado vazio → `data-open` + opacity/visibility; troca de texto/ícone → empilhar em grid e cross-fade; tema → `document.startViewTransition` (aplicar `data-theme` síncrono no callback).
- Sem animação que cause CLS ou dependa de hover para revelar conteúdo essencial.

## Verificação

Screenshots Playwright em 375/768/1280 × dark/light de cada página; checar contraste (axe) e que trocar o tema não gera flash (carregar com `localStorage.theme` e `colorScheme` emulados).
