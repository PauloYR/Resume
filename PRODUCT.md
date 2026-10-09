# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro (static), Tailwind CSS 4, TypeScript strict, zod, Vitest, Playwright. Chosen by the user; no framework runtime on the client unless an interaction requires it.

## Users

Primary: recruiters and tech leads evaluating a senior backend engineer, usually arriving on a phone from a LinkedIn or WhatsApp link, deciding within seconds whether to make contact. Secondary: engineers reading the cases.

## Product Purpose

Personal portfolio of Paulo Rocha, Senior Software Engineer (Backend, Go), based in Fortaleza-CE, 8 years of experience, open to remote or hybrid Backend/Go roles with immediate availability. Success: a visitor contacts him (LinkedIn or e-mail) or downloads the resume PDF, and the site ranks for searches about him and about Go backend engineers in Brazil.

## Positioning

A backend engineer who can show measured production outcomes (points engine at 588 events/s, 15-25 s down to at most 1 s, 98.1% subscription success, KMS card encryption, 18 microservices) and whose career runs from native Android to distributed Go systems. The site shows the work with real numbers instead of listing buzzwords.

## Operating Context

Static site, rebuilt on a schedule so the GitHub activity panel stays current (GraphQL at build time, cached fallback). The resume PDF is generated from the same data as the site. Content language is Brazilian Portuguese.

## Capabilities and Constraints

- Pages: Home, Projects/Cases, Resume. Snippets page was removed by the user: it read as copy-and-paste and was not the user's own work.
- Company carousel: Mobiup (Beyond Digital), G4F, Grupo GFT (Banco Original), GFX Consultoria.
- Deep links to GitHub and LinkedIn (`linkedin.com/in/pauloyr`); GitHub activity panel (contributions heatmap, languages).
- Resume PDF generated from the site's own resume route; single data source (content collections) feeds site, JSON-LD and PDF.
- Light and dark themes; mobile-first; strong SEO (structured data, Open Graph images, sitemap).
- Undecided: GitHub username, final domain, public repositories to feature, real company logos.
- Privacy: the phone number never appears in public HTML; e-mail comes from one config file.

## Brand Commitments

Standing preference (chosen by the user after previewing alternatives): the category standard played straight, close to the Figma community template "Portofolio Website Template" (dark, clean, card-based, gradient accent), with green replaced by purple and blue, plus a light theme. Gradient purple to blue only on the highlight word of the headline and on the primary button. Craft bar: the template's clarity executed with polished details (typography, focus, hover, themes). Site text in pt-BR; code and commits in English. Rejected by the user: the lace/thread concept (renda de bilro).

## Evidence on Hand

Resume at `~/Documentos/Curriculo_Paulo_Rocha.pdf` (roles, metrics, skills, education, certifications, languages). The user will send a photo. No public project repositories, testimonials or client names have been provided: do not invent them. Cases are drawn from resume bullets only.

## Product Principles

1. Lead with proof: real numbers from real systems, never adjectives.
2. A recruiter on a phone should know who he is, what he does and how to reach him within one screen.
3. One source of truth for content: site, structured data and PDF never drift apart.
4. Privacy by default: no phone in HTML, no third-party trackers or CDNs.
5. Fast and accessible by construction: static output, minimal JavaScript, AA contrast in both themes.

## Accessibility & Inclusion

WCAG AA contrast in both themes, full keyboard operation, visible focus, `prefers-reduced-motion` respected (carousel stops, reveals, count-up and view transitions are disabled), touch targets of at least 44px.
