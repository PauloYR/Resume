---
name: astro-ui
description: Use ao criar ou alterar páginas, layouts, componentes .astro, scripts de cliente, content collections, estilos Tailwind, acessibilidade ou performance no front-end do portfólio. Define a arquitetura enxuta (content → lib → components/pages), quando usar JS no cliente, a11y e Core Web Vitals. Invocar junto com mobile-first e theming.
---

# UI com Astro + Tailwind 4 (portfólio estático, PT-BR)

Antes de desenhar qualquer tela, invoque as skills de design: `impeccable`, `frontend-design`, `design-taste-frontend` e, para fidelidade ao layout, `figma:figma-design-to-code`. O visual deve ser único (roxo + azul), não o template genérico.
Consulte https://docs.astro.build antes de usar API nova; a versão instalada é recente, não confie na memória.

## Arquitetura (fronteiras impostas por `.oxlintrc.json`)

```
src/content/**  dados (md/json) + src/content.config.ts (zod)   ─┐
src/config/site.ts  nome, links, e-mail (único lugar de contato) ├─▶ src/lib/**  lógica pura TS (github, seo, resume)
                                                                  ─┘            │
                                                      src/components, src/layouts, src/pages  (apresentação)
```

- `lib`, `content` e `config` não importam `components`/`layouts`/`pages` nem `astro`/`react` (exceção: `astro:content` em `content.config.ts`).
- Componentes `.astro` recebem `Props` tipadas e não fazem fetch; o frontmatter da **página** chama `lib` e `getCollection`.
- Conteúdo (experiência, cases, clientes, empresas, skills) vive em collections com schema zod: **uma fonte de verdade** para site, JSON-LD e currículo. Dado externo passa por zod.
- Aliases: `@/*`, `@lib/*`, `@content/*`, `@config/*`. Use `import type` para tipos.

## JS no cliente

- Padrão: `.astro` sem JS. Script só para: tema (inline no `<head>`), menu mobile. Use `<script>` do Astro (bundle) e `is:inline` só para o anti-flash do tema.
- Sem framework de UI (React etc.) a menos que uma interação realmente exija; pergunte antes de adicionar.
- `localStorage` só para conveniência (tema), sempre em `try/catch`; nunca credencial.

## Estilo

- Tailwind 4 utilitário; tokens em `src/styles/global.css` (`@theme` + variáveis por tema). **Sem cor literal nem classe de paleta crua** em componentes (o hook barra): use tokens semânticos (`bg-surface`, `text-fg`, `text-accent`). Veja skill `theming`.
- Prettier ordena classes (`prettier-plugin-tailwindcss`): `npm run format`.
- `<style>` escopado só para casos pontuais (keyframes do carrossel); não misture dois sistemas no mesmo componente.

## Acessibilidade (obrigatório)

- HTML semântico (`header`, `nav`, `main`, `section` com `aria-labelledby`, `footer`). Um `h1` por página, sem pular níveis.
- `alt` descritivo (`alt=""` só em decorativas). Foco visível (`focus-visible:`), tudo operável por teclado, skip link "Pular para o conteúdo".
- Contraste AA nos dois temas; estado nunca só por cor. Botão só de ícone tem `aria-label`.
- Carrossel: lista duplicada marcada `aria-hidden`, pausa em hover/foco, sem animação com `prefers-reduced-motion`.
- Links externos: `target="_blank"` sempre com `rel="noopener noreferrer"` (GitHub/LinkedIn levam `rel="me noopener noreferrer"`).

## Performance (Core Web Vitals)

- Imagens por `astro:assets` (AVIF/WebP, `width`/`height`). Fontes self-host (`@fontsource-variable/*`), `font-display: swap`, preload só da principal. Nada de CDN de terceiros.
- Ícones: importe só o que usa (SVG inline/`astro-icon` com set mínimo).
- Meta: Lighthouse ≥ 95 em Performance/Acessibilidade/Boas práticas/SEO.

## Antes de dar por pronto

`npm run lint && npm run check && npm test && npm run build`; abrir no navegador em mobile e desktop, tema escuro e claro, teclado.
