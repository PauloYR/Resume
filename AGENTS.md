# paulo-rocha

Portfólio pessoal de Paulo Rocha (Senior Software Engineer, Backend Go). Site estático em PT-BR, mobile-first, tema escuro/claro (roxo + azul), inspirado no template Figma "Portofolio Website Template (Community)" (fileKey `3XDrCGwZKkAdYV9qlmuG78`).
Stack: Astro 7 (estático), Tailwind 4, TypeScript strict, zod, Vitest, Playwright, Node ≥ 22.

Funcionalidades: SEO forte, carrossel de empresas, currículo em PDF gerado pelo próprio site, deeplinks GitHub/LinkedIn, painel de uso do GitHub (build-time). Origem dos dados reais: `~/Documentos/Curriculo_Paulo_Rocha.pdf`.

## Leis de segurança e privacidade (inegociáveis)

1. **Nunca expor env/segredo.** `GITHUB_TOKEN` é só de build (`src/lib`, `scripts`, CI). Nada sensível em `PUBLIC_*`, bundle, log ou git.
2. **Nunca ler, imprimir, copiar, editar ou commitar `.env` real.** Só `.env.example`, com nome e valor vazio.
3. **Telefone nunca no HTML público.** Dados de contato só em `src/config/site.ts`/collections.
4. **Sem HTML cru** (`set:html`, `innerHTML`, `dangerouslySetInnerHTML`) com dado externo.
5. **Nunca contornar proteções**: sem `--no-verify`, sem desligar regra de lint. Se um hook bloquear, corrija a causa; se achar falso positivo, pergunte ao usuário.

Checklist completo: skill `web-security`. Se um segredo vazar, rotacione primeiro e avise o usuário.

## Arquitetura enxuta (data-driven)

`src/content` + `src/config` (dados, zod) → `src/lib` (lógica pura TS: github, seo, resume, logger) → `src/components`, `src/layouts`, `src/pages` (apresentação). Fronteiras impostas por `.oxlintrc.json`.

- `lib`/`content`/`config` não importam componentes, layouts, pages, astro ou react (exceção: `astro:content` em `content.config.ts`).
- Componentes não fazem fetch; a página chama `lib`/`getCollection` no frontmatter. Dado externo passa por zod.
- Uma fonte de verdade: o mesmo conteúdo alimenta site, JSON-LD e currículo.
- Aliases: `@/*`, `@lib/*`, `@content/*`, `@config/*`.

## Fluxo obrigatório de trabalho

- **Antes de criar/alterar qualquer UI**: invocar `impeccable`, `frontend-design`, `design-taste-frontend`, `astro-ui`, `mobile-first` e `theming`. Para telas do Figma, `figma:figma-design-to-code` (frames: Home `813:40`, Mentorship `813:256`, Projects `813:51`; arquivo `3XDrCGwZKkAdYV9qlmuG78`). Para gráficos, `dataviz`.
- SEO em toda página: skill `seo`. Painel do GitHub: `github-stats`. Currículo/PDF: `resume-pdf`.
- Mudou dependência, env, CI ou link externo: skill `web-security`.
- Direção visual escolhida pelo usuário (impeccable, PRODUCT.md): padrão da categoria perto do template do Figma (escuro, limpo, cards), roxo + azul, gradiente só no destaque do título e no botão principal. O conceito de renda/fios foi descartado; não reintroduzir.

## Mobile-first (inegociável)

Estilo base ~360px; só escale com `sm:`/`md:`/`lg:`. Detalhes: skill `mobile-first`.

- Proibido `max-*:`, `@media (max-width)`, `h-screen`/`100vh` (use `dvh`), largura fixa em px ≥ 100, `user-scalable=no`. O hook `guard-write` bloqueia.
- Alvo de toque ≥ 44px, input ≥ 16px, nada essencial só em `hover:`, sem scroll horizontal em 320px.
- Validar em 320/375/414px e depois desktop, nos dois temas.

## Movimento (inegociável)

Nenhuma mudança de estado é seca. Abrir/fechar, mostrar/ocultar, trocar texto, tema, hover/active/selected: tudo transita. Detalhes e receitas: skill `theming` e DESIGN.md.

- Duração e curva só pelos tokens `--dur-fast`/`--dur-base`/`--ease-out` (`global.css`); nada de `200ms` solto.
- Proibido alternar `hidden`/`display` direto (`el.hidden = …`, `group-open:hidden`). Use `data-open` + `opacity`/`visibility`/`grid-template-rows`, animação WAAPI do painel em `<details>` (não dependa só de `::details-content`), ou `@starting-style` + `allow-discrete` em `<dialog>`. Fechado fica `inert`/`visibility:hidden` (a11y).
- Só `transform`/`opacity`, exceto expandir/recolher (altura via `interpolate-size`/grid-rows).
- `prefers-reduced-motion: reduce` chega ao estado final na hora (rede de segurança em `global.css`); nunca omite a mudança.
- Todo estado novo com transição ganha teste Playwright em `tests/e2e/motion.spec.ts` (estado intermediário em movimento normal, estado final imediato em `reduce`). O hook `guard-write` bloqueia os padrões secos mais comuns.

## Tema

Sem cor literal nem classe de paleta crua em componentes; só tokens semânticos de `src/styles/global.css` (`bg-surface`, `text-fg`, `text-accent`…). Skill `theming`.

## Convenções

- Código, nomes de arquivo e commits em inglês (Conventional Commits: `feat:`, `fix:`, `refactor:`…). Texto do site e docs internas em português (PT-BR).
- TypeScript estrito: sem `any`, sem `console.*` (use `src/lib/logger.ts`), `import type` para tipos.
- Mensagem de commit descreve a mudança e nada mais (sem trailers de ferramenta/sessão/co-author).
- Depois de alterar código: `graphify update .` se existir `graphify-out/`.

## Comandos

```
npm run lint          # oxlint --deny-warnings (inclui fronteiras)
npm run check         # astro check (tipos)
npm test              # vitest (src/lib)
npm run test:e2e      # playwright
npm run build         # astro check + build
npm run pdf           # gera o PDF do currículo
npm run format        # prettier (astro + ordenação Tailwind)
npm run secrets:scan  # betterleaks no working dir
npm run audit         # npm audit das dependências de produção
npm run hooks:test    # autoteste dos hooks do Claude
```

Git hooks (lefthook): pre-commit = betterleaks staged (falha fechada), selftest dos hooks, prettier, oxlint, astro check; pre-push = audit, testes, build.
Hooks do Claude (`.claude/settings.json`): bloqueiam escrita de segredos/`.env`, padrões inseguros, quebras de mobile-first/tema/SEO e comandos perigosos; formatam e fazem lint após cada edição.

## Documentação

Astro: https://docs.astro.build · Tailwind 4: https://tailwindcss.com/docs · Playwright: https://playwright.dev
