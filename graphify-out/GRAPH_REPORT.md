# Graph Report - paulo-rocha  (2026-10-09)

## Corpus Check
- 81 files · ~77,872 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 396 nodes · 458 edges · 36 communities (32 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c7ea17ca`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- index.astro
- rules
- scripts
- github.ts
- devDependencies
- guard-write.mjs
- dependencies
- tsconfig.json
- format.ts
- Product
- paulo-rocha
- content.config.ts
- UI com Astro + Tailwind 4 (portfólio estático, PT-BR)
- Tema escuro/claro (roxo + azul)
- Mobile-first (obrigatório)
- SEO do portfólio
- Currículo em PDF extraído do próprio site
- Segurança web e privacidade (lei do projeto)
- paulo-rocha
- build-og.mjs
- serve-dist.mjs
- Painel de uso do GitHub (estilo gráfico de contribuições)
- logos.ts
- selftest.mjs
- screenshots.mjs
- Portfólio (todas as páginas)
- site.spec.ts
- optimize-logos.mjs
- Design System: Paulo Rocha
- ignorePatterns
- tech-icons.ts
- build-tech-icons.mjs
- vercel.json

## God Nodes (most connected - your core abstractions)
1. `scripts` - 17 edges
2. `Product` - 12 edges
3. `rules` - 11 edges
4. `ignorePatterns` - 9 edges
5. `paulo-rocha` - 9 edges
6. `Design System: Paulo Rocha` - 9 edges
7. `Site` - 8 edges
8. `Components` - 8 edges
9. `UI com Astro + Tailwind 4 (portfólio estático, PT-BR)` - 7 edges
10. `Tema escuro/claro (roxo + azul)` - 7 edges

## Surprising Connections (you probably didn't know these)
- `getSiteGithubActivity()` --calls--> `loadGithubActivity()`  [EXTRACTED]
  src/lib/github-site.ts → src/lib/github.ts

## Import Cycles
- None detected.

## Communities (36 total, 4 thin omitted)

### Community 0 - "index.astro"
Cohesion: 0.07
Nodes (26): links, json, Site, canonical, ogImage, isCurrent(), nav, NavItem (+18 more)

### Community 1 - "rules"
Cohesion: 0.08
Nodes (25): categories, correctness, suspicious, env, browser, es2024, node, overrides (+17 more)

### Community 2 - "scripts"
Cohesion: 0.08
Nodes (25): allowScripts, esbuild, engines, node, name, private, scripts, astro (+17 more)

### Community 3 - "github.ts"
Cohesion: 0.10
Nodes (21): vitest, buildActivity(), cacheSchema, GithubActivity, GithubDay, HeatLevel, loadGithubActivity(), LoadOptions (+13 more)

### Community 4 - "devDependencies"
Cohesion: 0.10
Nodes (21): @astrojs/check, lefthook, oxlint, devDependencies, @astrojs/check, lefthook, oxlint, @playwright/test (+13 more)

### Community 5 - "guard-write.mjs"
Cohesion: 0.15
Nodes (13): cmd, envFile, problems, reader, file, isPolicyFile, problems, rel (+5 more)

### Community 6 - "dependencies"
Cohesion: 0.13
Nodes (15): astro, @astrojs/sitemap, @fontsource-variable/bricolage-grotesque, @fontsource-variable/hanken-grotesk, dependencies, astro, @astrojs/sitemap, @fontsource-variable/bricolage-grotesque (+7 more)

### Community 7 - "tsconfig.json"
Cohesion: 0.12
Nodes (16): **/*, astro/tsconfigs/strict, .astro/types.d.ts, ./src/config/*, ./src/content/*, ./src/lib/*, compilerOptions, noUncheckedIndexedAccess (+8 more)

### Community 8 - "format.ts"
Cohesion: 0.48
Nodes (4): formatMonth(), formatPeriod(), months, yearsBetween()

### Community 9 - "Product"
Cohesion: 0.15
Nodes (12): Accessibility & Inclusion, Brand Commitments, Capabilities and Constraints, Evidence on Hand, Operating Context, Platform, Positioning, Product (+4 more)

### Community 10 - "paulo-rocha"
Cohesion: 0.20
Nodes (9): Arquitetura enxuta (data-driven), Comandos, Convenções, Documentação, Fluxo obrigatório de trabalho, Leis de segurança e privacidade (inegociáveis), Mobile-first (inegociável), paulo-rocha (+1 more)

### Community 11 - "content.config.ts"
Cohesion: 0.22
Nodes (8): cases, certifications, clients, collections, education, experience, period, skills

### Community 12 - "UI com Astro + Tailwind 4 (portfólio estático, PT-BR)"
Cohesion: 0.25
Nodes (7): Acessibilidade (obrigatório), Antes de dar por pronto, Arquitetura (fronteiras impostas por `.oxlintrc.json`), Estilo, JS no cliente, Performance (Core Web Vitals), UI com Astro + Tailwind 4 (portfólio estático, PT-BR)

### Community 13 - "Tema escuro/claro (roxo + azul)"
Cohesion: 0.25
Nodes (7): Contraste e acessibilidade, Mecânica do tema, Movimento, Regra de ouro, Tema escuro/claro (roxo + azul), Tokens (`src/styles/global.css`), Verificação

### Community 14 - "Mobile-first (obrigatório)"
Cohesion: 0.29
Nodes (6): Imagens e performance (4G / aparelho médio), Mobile-first (obrigatório), Tailwind, Tipografia e espaço, Toque e interação, Validação antes de dar por pronto

### Community 15 - "SEO do portfólio"
Cohesion: 0.29
Nodes (6): Conteúdo que ranqueia, Dados estruturados (JSON-LD, `src/lib/seo.ts` + `JsonLd.astro`), Depois de publicar, Por página (checklist obrigatório), SEO do portfólio, Técnico

### Community 16 - "Currículo em PDF extraído do próprio site"
Cohesion: 0.33
Nodes (5): Currículo em PDF extraído do próprio site, Geração do PDF (`scripts/build-pdf.mjs`, `npm run pdf`), Princípios, Página `/curriculo`, Verificação

### Community 17 - "Segurança web e privacidade (lei do projeto)"
Cohesion: 0.33
Nodes (5): Checklist por mudança, Ferramentas já ligadas, Leis (sem exceção, sem "só pra testar"), Privacidade (site público de uma pessoa real), Segurança web e privacidade (lei do projeto)

### Community 18 - "paulo-rocha"
Cohesion: 0.25
Nodes (7): Logos das empresas e clientes, Logos de tecnologias (seção "O que eu uso"), Onde trocar os dados, paulo-rocha, Qualidade, Rodando, Variáveis de ambiente (build)

### Community 19 - "build-og.mjs"
Cohesion: 0.33
Nodes (3): display, pages, text

### Community 20 - "serve-dist.mjs"
Cohesion: 0.47
Nodes (3): serveDist(), types, port

### Community 21 - "Painel de uso do GitHub (estilo gráfico de contribuições)"
Cohesion: 0.40
Nodes (4): Componente `GithubActivity.astro`, Fluxo, Painel de uso do GitHub (estilo gráfico de contribuições), Testes

### Community 22 - "logos.ts"
Cohesion: 0.20
Nodes (13): buildClientItems(), buildCompanyItems(), CarouselItem, Client, extensions, FALLBACK_SIZE, findLogo(), Job (+5 more)

### Community 24 - "screenshots.mjs"
Cohesion: 0.50
Nodes (3): routes, themes, widths

### Community 29 - "optimize-logos.mjs"
Cohesion: 0.33
Nodes (4): logos, MARK, PAD, sizes

### Community 30 - "Design System: Paulo Rocha"
Cohesion: 0.08
Nodes (24): Buttons, Cards / Containers, Carrossel de logos (componente de assinatura), Chips, Colors, Components, Design System: Paulo Rocha, Do: (+16 more)

### Community 31 - "ignorePatterns"
Cohesion: 0.18
Nodes (9): ignorePatterns, dist, .agents, .astro, .claude/skills, graphify-out, node_modules, playwright-report (+1 more)

### Community 32 - "tech-icons.ts"
Cohesion: 0.36
Nodes (3): TechChip, techIconSlugs, toChip()

### Community 34 - "build-tech-icons.mjs"
Cohesion: 0.50
Nodes (3): bySlug, mapSource, slugs

## Knowledge Gaps
- **226 isolated node(s):** `cmd`, `problems`, `envFile`, `reader`, `file` (+221 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `github.ts` to `format.ts`, `rules`, `tech-icons.ts`, `logos.ts`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Why does `plugins` connect `rules` to `github.ts`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **What connects `cmd`, `problems`, `envFile` to the rest of the system?**
  _226 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `index.astro` be split into smaller, more focused modules?**
  _Cohesion score 0.07312925170068027 - nodes in this community are weakly interconnected._
- **Should `rules` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._
- **Should `scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._
- **Should `github.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10317460317460317 - nodes in this community are weakly interconnected._