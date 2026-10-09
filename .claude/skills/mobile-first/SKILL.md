---
name: mobile-first
description: Use ao criar ou alterar qualquer tela, layout, componente ou estilo. Regras obrigatórias de mobile-first (Tailwind min-width, toque, viewport dvh, tipografia, imagens, performance em 4G, teste em 320-414px). Invocar junto com astro-ui e theming.
---

# Mobile-first (obrigatório)

Recrutadores abrem o portfólio pelo celular (link no LinkedIn/WhatsApp). Desenhe e escreva o CSS para ~360px primeiro; telas maiores são melhoria progressiva.

## Tailwind

- Classes sem prefixo = mobile. Escale com `sm:` `md:` `lg:` (min-width). **Proibido `max-sm:`/`max-md:`…** e `@media (max-width)` (o hook `guard-write` barra).
- Não esconda conteúdo essencial no mobile (`hidden md:block`). Se algo some, há equivalente (menu, accordion).
- Layout base em coluna única (`flex-col`, `grid-cols-1`); multi-coluna só de `sm:`/`md:` em diante.
- Container: `w-full` + `max-w-*` + padding lateral (`px-4`). Sem largura fixa em px ≥ 100 (`w-[480px]`); use `w-full`, `max-w-*`, `min-w-0`, `clamp()`.
- Sem scroll horizontal em 320px. Em flex/grid, texto longo usa `min-w-0` + `truncate`/`break-words`. O carrossel de empresas rola por transform dentro de um container com `overflow-hidden`, nunca estoura a página.
- Altura de tela: `min-h-dvh`/`h-dvh`/`100dvh`. Nunca `h-screen`/`100vh`.
- Barras fixas respeitam safe-area: `pb-[env(safe-area-inset-bottom)]`.

## Toque e interação

- Alvo de toque ≥ 44x44px (`min-h-11 min-w-11`), espaçamento ≥ 8px entre alvos (menu, toggle de tema, ícones GitHub/LinkedIn, botão "Baixar currículo").
- `hover:` é só enfeite: nada essencial depende de hover; use também `active:` e `focus-visible:`.
- Inputs (se houver) com fonte ≥ 16px, `type`/`inputmode`/`autocomplete` corretos.
- Menu mobile: botão sempre visível, abre em painel de largura total, fecha com Esc/clique fora, foco gerenciado.
- Nunca desabilitar zoom (`user-scalable=no`, `maximum-scale=1`).

## Tipografia e espaço

- Corpo ≥ 16px, linha 1.5. Títulos fluidos (`text-3xl md:text-5xl` ou `clamp()`).
- Escala de espaçamento do Tailwind, nunca px mágico.

## Imagens e performance (4G / aparelho médio)

- `<Image>`/`<Picture>` de `astro:assets` com `widths` + `sizes` mobile-first, `width`/`height` sempre (sem CLS), lazy abaixo da dobra, `fetchpriority="high"` só na imagem do LCP.
- Orçamento: LCP < 2.5s em 4G, CLS ≈ 0, JS mínimo (o site é quase todo HTML/CSS; scripts só para tema e menu).
- Respeite `prefers-reduced-motion` e `prefers-color-scheme`.

## Validação antes de dar por pronto

1. `npm run dev` e abrir em **320, 375 e 414px**, depois 768 e 1280 (Playwright `page.setViewportSize`), nos **dois temas**.
2. Sem scroll horizontal, texto legível sem zoom, alvos tocáveis, navegação utilizável com uma mão.
3. `npm run lint && npm run check && npm run build`.
