---
name: github-stats
description: Use ao criar ou alterar o painel de uso do GitHub (heatmap de contribuições, linguagens, contadores), o módulo src/lib/github.ts, o cache de fallback ou o workflow de rebuild diário. Define busca via GraphQL só no build, fallback, SVG acessível e paleta roxo→azul.
---

# Painel de uso do GitHub (estilo gráfico de contribuições)

## Fluxo

1. **Build-time apenas.** `src/lib/github.ts` chama `https://api.github.com/graphql` com `GITHUB_TOKEN` (env de build/CI) e `GITHUB_USER`. Nunca no navegador, nunca `PUBLIC_*`, nunca em log (o hook `guard-write` e a skill `web-security` barram).
2. Consulta mínima: `user(login) { contributionsCollection { contributionCalendar { totalContributions weeks { contributionDays { date contributionCount weekday } } } } repositories(first: 100, ownerAffiliations: OWNER, isFork: false, privacy: PUBLIC) { nodes { name stargazerCount languages(first: 5, orderBy: {field: SIZE, direction: DESC}) { edges { size node { name } } } } } }`. Só dados públicos.
3. Valide a resposta com **zod** na borda (`schema.parse`); nunca passe JSON cru para o componente. `src/lib/github.ts` devolve um tipo próprio (`GithubActivity`) já agregado: total, semanas × dias com nível 0–4, top linguagens em %, stars, repos.
4. **Fallback obrigatório**: sucesso → grava `src/data/github.json` (versionado, só dados públicos); falha, sem token ou sem rede → lê o cache; sem cache → painel esconde o heatmap e mostra link para o perfil. O build **nunca quebra** por causa do GitHub. Logue com `logger.warn` (sem expor token).
5. **Rebuild agendado**: `.github/workflows/deploy.yml` com `schedule` diário (cron) + `workflow_dispatch`; `permissions: contents: read`; token via `secrets.GH_STATS_TOKEN`.

## Componente `GithubActivity.astro`

- Heatmap em **SVG inline** (53 semanas × 7 dias), células `rect` com `<title>` ("12 contribuições em 3 mar"), cantos arredondados, legenda "Menos … Mais".
- Mobile-first: o SVG usa `viewBox` e `width: 100%`; no mobile rola horizontalmente **dentro** do card (`overflow-x-auto`, alvo com `tabindex="0"` e `role="img"`/`aria-label`) mostrando as semanas mais recentes primeiro, sem estourar a página; em `md:` cabe inteiro.
- Cores só por tokens (`--heat-0..4`) definidos por tema em `global.css`: escala sequencial **roxo→azul** com contraste suficiente nos dois temas (valide com a skill `dataviz`; célula nível 0 distinguível do fundo). Informação nunca só por cor: o resumo textual cobre.
- Resumo textual acessível: "N contribuições nos últimos 12 meses; linguagens principais: Go 62%, Kotlin 20%…" em texto visível ou `sr-only`.
- Barra empilhada de linguagens com rótulos e %; contadores (repositórios, stars, contribuições). Respeite `prefers-reduced-motion` em qualquer entrada animada.
- Link "Ver no GitHub" (`rel="me noopener noreferrer"`), `target="_blank"`.

## Testes

- Unitário (Vitest) de `lib/github`: agregação de níveis, percentuais de linguagens, parse com payload inválido, uso do cache quando o fetch falha (mock de `fetch`).
- E2E: o painel renderiza com o cache (sem token) e não há `GITHUB_TOKEN` em `dist/` (`grep` no build).
