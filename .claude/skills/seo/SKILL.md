---
name: seo
description: Use ao criar ou alterar qualquer página, layout, metadado, imagem, link, sitemap ou dado estruturado. Checklist de SEO para o portfólio aparecer bem no Google (title/description, canonical, Open Graph, imagem OG, JSON-LD Person/WebSite/BreadcrumbList, sitemap, robots, semântica, Core Web Vitals).
---

# SEO do portfólio

Objetivo: quando alguém buscar "Paulo Rocha desenvolvedor Go", "engenheiro de software backend Go Fortaleza" ou "backend Go microsserviços AWS", o site aparece com snippet atraente e rico. Tudo em `lang="pt-BR"`.

## Por página (checklist obrigatório)

- [ ] `<title>` único, 50–60 caracteres, palavra-chave principal + nome: `Paulo Rocha | Engenheiro de Software Sênior Backend (Go)`. Subpáginas: `Projetos | Paulo Rocha`.
- [ ] `<meta name="description">` único, 120–155 caracteres, com proposta de valor e uma métrica real (ex.: motor de pontos com 588 eventos/s). Nunca copie a mesma em duas páginas.
- [ ] `<link rel="canonical">` absoluto (usa `site` do `astro.config.mjs`/`SITE_URL`).
- [ ] Open Graph (`og:title/description/type/url/image/locale=pt_BR/site_name`) e Twitter card `summary_large_image`.
- [ ] Imagem OG 1200×630 por página, gerada no build (`satori` + `resvg`), com texto legível em miniatura e `og:image:alt`.
- [ ] Um único `h1` com a palavra-chave natural; `h2`/`h3` em ordem; landmarks (`header`, `nav`, `main`, `footer`).
- [ ] Links internos com texto descritivo (nada de "clique aqui"); breadcrumb visível nas subpáginas.
- [ ] Imagens: `alt` descritivo, `width`/`height`, AVIF/WebP via `astro:assets`, lazy abaixo da dobra.
- [ ] Página fora do sitemap e `noindex` só quando for intencional (ex.: 404, `/curriculo` de impressão se duplicar conteúdo).

## Dados estruturados (JSON-LD, `src/lib/seo.ts` + `JsonLd.astro`)

- Home: `Person` (`name`, `jobTitle`, `description`, `url`, `image`, `address` só cidade/UF, `sameAs` = GitHub + LinkedIn, `knowsAbout` = Go, microsserviços, AWS, Temporal…, `worksFor`/`alumniOf` conforme o currículo) e `WebSite`.
- Subpáginas: `BreadcrumbList`; projetos: `CreativeWork`/`SoftwareSourceCode` quando houver repositório público.
- **Sem telefone** no JSON-LD. Valide com o Rich Results Test; no teste Playwright, faça `JSON.parse` de cada `<script type="application/ld+json">`.

## Técnico

- `@astrojs/sitemap` ligado, `public/robots.txt` com `Sitemap:` absoluto. `site` correto no `astro.config.mjs`.
- URLs curtas, minúsculas, sem acento (`/projetos`, `/curriculo`). Redirecione variações em vez de duplicar.
- `<meta name="theme-color">` para claro/escuro, favicon SVG + `apple-touch-icon`, `manifest` opcional.
- Fontes self-host com `font-display: swap`; nada de bloqueio de render por terceiros.
- Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms. Lighthouse ≥ 95 em todas as categorias antes de publicar.
- PDF do currículo com título e metadados corretos (`/curriculo-paulo-rocha.pdf`), linkado a partir do site (texto âncora "Baixar currículo em PDF").

## Conteúdo que ranqueia

- A Home deve ter, em texto real (não imagem): quem é, stack (Go, AWS, Temporal, OpenTelemetry…), resultados com números e localização/disponibilidade (Fortaleza-CE, remoto/híbrido).
- Cases do currículo viram páginas/seções indexáveis com contexto → ação → resultado.

## Depois de publicar

Verificar no Search Console (propriedade de domínio), enviar o sitemap, inspecionar a URL da Home. Informar o usuário dessas etapas manuais.
