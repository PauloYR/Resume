# paulo-rocha

Portfólio de Paulo Rocha (Engenheiro de Software Sênior, Backend em Go). Site estático em PT-BR com Astro e Tailwind 4, mobile-first, tema escuro e claro (roxo + azul).

## Rodando

```bash
npm install
npm run dev            # desenvolvimento
npm run build          # astro check + build em dist/
npm run pdf            # gera dist/curriculo-paulo-rocha.pdf a partir da página /curriculo
node scripts/build-og.mjs   # regenera as imagens Open Graph em public/og/
npm run test:e2e       # Playwright (precisa de dist/ já buildado)
```

## Onde trocar os dados

| O quê                                             | Onde                 |
| ------------------------------------------------- | -------------------- |
| Nome, e-mail, LinkedIn, resumo, idiomas           | `src/config/site.ts` |
| Experiência, cases, competências, formação, certs | `src/content/*.json` |

### Logos das empresas e clientes

1. Coloque o arquivo original (qualquer tamanho, SVG, PNG, JPG, WebP ou AVIF) em `assets/logos-src/`.
2. Registre a linha dele em `scripts/optimize-logos.mjs` (nome do arquivo, identificador e cor de fundo; `auto` copia o fundo da própria imagem).
3. Rode `node scripts/optimize-logos.mjs`: gera `public/logos/<id>.webp` (cartão de mesma altura, marca centralizada, 2 a 5 KB) e `src/content/logo-sizes.json`. Precisa de `magick` e `ffmpeg`.

O identificador é o `id` da vaga em `src/content/experience.json` (empresas) ou o `id` em `src/content/clients.json` (clientes). Sem logo, o carrossel mostra o nome em texto.

### Logos de tecnologias (seção "O que eu uso")

1. Em `src/lib/tech-icons.ts`, mapeie o item de `skills.json` para o slug do [Simple Icons](https://simpleicons.org).
2. Rode `node scripts/build-tech-icons.mjs`: copia os SVGs usados para `src/assets/tech/`.

Item sem mapeamento aparece como chip só de texto. O gopher (`src/assets/gopher.svg`) é CC BY 3.0 e o crédito fica no rodapé.

O mesmo conteúdo alimenta o site, o JSON-LD de SEO e o PDF do currículo. O telefone não aparece no HTML público.

## Variáveis de ambiente (build)

| Variável       | Uso                                                                       |
| -------------- | ------------------------------------------------------------------------- |
| `SITE_URL`     | origem pública (canonical, sitemap, Open Graph)                           |
| `GITHUB_USER`  | usuário do GitHub; sem ele o painel de atividade fica oculto              |
| `GITHUB_TOKEN` | token somente leitura, só no build/CI; sem ele usa `src/data/github.json` |

Nunca coloque o token em `PUBLIC_*` nem no repositório. No GitHub Actions use o secret `GH_STATS_TOKEN` e as variáveis `SITE_URL` e `GITHUB_USER` (`.github/workflows/build.yml`, com rebuild diário).

## Qualidade

`npm run lint`, `npm run check`, `npm test`, `npm run hooks:test`. Hooks de git via lefthook (segredos, formatação, lint, tipos) e hooks do Claude em `.claude/` (ver `AGENTS.md`).
