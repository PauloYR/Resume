---
name: resume-pdf
description: Use ao criar ou alterar o currículo do site (/curriculo), o botão "Baixar currículo", o CSS de impressão A4 ou o script que gera o PDF no build. Define a fonte única de dados (collections), o layout ATS-friendly e a geração do PDF via Playwright.
---

# Currículo em PDF extraído do próprio site

## Princípios

- **Fonte única**: o currículo é renderizado a partir das mesmas collections do site (`experience`, `skills`, `education`, `certifications`, `languages`) e de `src/config/site.ts`. Nunca duplique texto do currículo em markup; se mudar o dado, site e PDF mudam juntos.
- Conteúdo de referência: `~/Documentos/Curriculo_Paulo_Rocha.pdf` (o usuário é o dono). Ele é a origem para popular as collections; depois disso, as collections mandam.
- **ATS-friendly**: uma coluna, texto real selecionável, ordem Resumo → Competências → Experiência → Formação → Certificações → Idiomas, sem ícones/tabelas/imagens que quebrem a leitura, fonte do sistema ou única embutida.
- **Privacidade**: o telefone só entra no PDF se o usuário aprovar explicitamente e **nunca** na página HTML pública (`guard-write` barra literais de telefone/e-mail em `components/layouts/pages`). O HTML de `/curriculo` usa o mesmo componente com a flag `includePhone={false}`; o script do PDF abre a rota com `?pdf=1` somente em build local para incluir o telefone vindo de variável de ambiente de build (nunca do repo).

## Página `/curriculo`

- `src/pages/curriculo.astro` reaproveita `components/resume/*`. Tema **claro forçado** em print e no PDF (`data-theme="light"`), independente da preferência.
- CSS `@media print` em `src/styles/print.css`: `@page { size: A4; margin: 14mm }`, `print-color-adjust: exact` só onde necessário, quebra de página controlada (`break-inside: avoid` em cada vaga), links com URL visível na impressão (`a[href^="http"]::after` só em print), esconde header/footer/botões/toggle de tema.
- Alvo: 2 páginas A4 no máximo. Tamanhos em `pt`/`mm` apenas dentro de `@media print` (mobile-first continua valendo para a tela).
- Botão "Baixar currículo (PDF)" (`ResumeButton.astro`): link direto para `/curriculo-paulo-rocha.pdf` com atributo `download`; alternativa "Imprimir" chama `window.print()`. Alvo de toque ≥ 44px, `aria-label` claro.

## Geração do PDF (`scripts/build-pdf.mjs`, `npm run pdf`)

1. Sobe `astro preview` (ou serve `dist/`) em porta livre.
2. Playwright (Chromium) abre `/curriculo`, `page.pdf({ format: 'A4', printBackground: true, preferCSSPageSize: true })`.
3. Salva em `public/curriculo-paulo-rocha.pdf` (ou `dist/`), define título/autor via metadados do documento (`<title>` da página).
4. Falha o build se o PDF tiver > 2 páginas ou não tiver texto extraível (checar com `pdftotext`/`pdf-parse`).
5. Roda no CI após `astro build`; o PDF é artefato versionado só se o usuário pedir.

## Verificação

- Abrir o PDF gerado: texto selecionável, 1–2 páginas, sem corte de linhas/vagas, acentos corretos, links clicáveis.
- Conferir que `dist/curriculo/index.html` não contém telefone.
- Teste Playwright: rota `/curriculo` responde 200, tem um `h1`, e o link de download aponta para um arquivo existente.
