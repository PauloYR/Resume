---
name: web-security
description: Checklist de segurança e privacidade obrigatório. Use antes de commitar ou abrir PR de qualquer mudança que toque env, tokens (GITHUB_TOKEN), HTML dinâmico, links externos, dependências, CI/GitHub Actions, headers ou dados pessoais (telefone/e-mail). Lei número 1 é nunca expor segredo ou env sensível.
---

# Segurança web e privacidade (lei do projeto)

## Leis (sem exceção, sem "só pra testar")

1. **Nenhum segredo no repositório, no bundle ou no log.** Inclui `GITHUB_TOKEN`, chaves, DSNs com credencial, `.env` reais, JWT de exemplo. `PUBLIC_*` vai para **todo navegador**: só dado público.
2. **Nunca ler, imprimir, copiar ou commitar `.env` real.** Só `.env.example`, sem valores.
3. **`GITHUB_TOKEN` é só de build**: lido em `src/lib/github.ts`/scripts/CI, nunca em componente, nunca em `PUBLIC_*`, nunca impresso em log. Escopo mínimo (somente leitura de dados públicos).
4. **Sem HTML cru** (`set:html`, `innerHTML`, `dangerouslySetInnerHTML`). Se inevitável, sanitize e marque `// security-reviewed: <motivo>`. Markdown de collections é renderizado pelo Astro.
5. **Nunca pular as proteções**: pular hooks do git, desligar regra de lint de segurança, executar script remoto via pipe no shell. Se um hook bloquear, corrija a causa; se for falso positivo, pergunte ao usuário.

Se um segredo vazar: considere-o comprometido, **rotacione primeiro**, limpe o histórico depois, avise o usuário.

## Privacidade (site público de uma pessoa real)

- **Telefone nunca no HTML público** (scraping/spam). Só no PDF do currículo, se o usuário aprovar. E-mail: só de `src/config/site.ts`, preferencialmente atrás de botão `mailto:` (sem texto literal repetido em várias páginas).
- Nada de endereço residencial; cidade/estado bastam.
- Sem analytics/cookies de terceiros por padrão. Se adicionar métrica, use opção sem cookie e avise o usuário.
- JSON-LD e metadados só com dados que o usuário aprovou publicar.

## Checklist por mudança

**Env e config**

- [ ] Variável nova em `.env.example` sem valor; nenhuma não-`PUBLIC_` em código de browser.
- [ ] `npm run secrets:scan` limpo.

**Markup**

- [ ] Links `_blank` com `rel="noopener noreferrer"`. `href` dinâmico só `http(s):`/`mailto:`.
- [ ] Sem script/CSS/fonte de CDN de terceiros (self-host). Se inevitável: SRI + justificativa.
- [ ] Dado de collection/API passa por zod; saída escapada (não contorne o escape do Astro).

**CI e dependências**

- [ ] GitHub Actions: `permissions:` mínimas, actions fixadas por versão/SHA, token só como `secrets.*`, sem `pull_request_target` com checkout de PR externo.
- [ ] Dependência nova: necessária? mantida? `npm run audit` limpo (o pre-push roda). Confira nome/downloads/repo (typosquatting).
- [ ] `package-lock.json` versionado; scripts de install só pela allow-list `allowScripts`.

**Headers (configure no host quando o deploy for definido)**

- [ ] CSP sem `unsafe-eval` (comece em Report-Only), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` mínima, `frame-ancestors 'none'`, HSTS.

**Logs**

- [ ] Sem token/PII em log. Use `src/lib/logger.ts`; nunca `console.*` (lint barra).

## Ferramentas já ligadas

- `.claude/hooks/guard-write.mjs` e `guard-bash.mjs` barram os padrões acima na sessão. Autoteste: `npm run hooks:test`.
- `lefthook` pre-commit: betterleaks (segredos staged, falha fechada), selftest dos hooks, prettier, oxlint, `astro check`. Pre-push: audit, testes, build.
- `.claude/settings.json` nega `Read/Edit` de `.env*` reais.

Para revisão profunda de um diff, combine com `/security-review`.
