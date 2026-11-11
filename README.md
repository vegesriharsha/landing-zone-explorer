# Landing Zone Explorer

Interactive explainers, simulators and dashboards for Azure landing zones, built around **Contoso Bank**, a fictional
bank. Twenty pages cover the adoption journey, a capability sequencer, policy and hierarchy, networking, resource
groups, naming, the IaC accelerator, pipelines and identities, Terraform state, subscription vending, brownfield
migration, observability, compliance, billing, paved paths, a personal-lab cost meter and a technology register.

Every page states the date its facts were last verified and lists its sources. Prices are East US 2 retail list
prices from the Azure Retail Prices API.

The site is built on the Pathway Kit: data-driven archetype pages, custom simulators, a sources file every page cites
by key, a register with review cadences, and prompts for research, fact-checking and the monthly refresh. The rules
for working on it are in `CLAUDE.md`; the scope is in `PATHWAY_SPEC.md`.

## Run it locally

Needs Node.js 22.12 or later.

```bash
npm ci
npm run dev      # http://localhost:5173
npm run check    # every cited source key, page id and register source exists (add --urls to fetch each source)
npm run build    # static site in dist/
npm run preview  # serve the built site
```

## Publish to GitHub Pages

1. Create a public repository and push this folder to its `main` branch.
2. In the repository, open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Push to `main` (or run the workflow from the **Actions** tab). The workflow in `.github/workflows/deploy.yml` runs
   the content check, builds the site and deploys it.

The site uses hash links (`#pipeline`) and relative asset paths, so it works at `https://<user>.github.io/<repo>/`
without extra configuration.

## Keep it current

| What changed | Edit |
| --- | --- |
| A fact on a page | The page in `src/pages/` or its data file in `src/content/`, then the verified date |
| A component's status or version | `src/content/register.js` |
| A price | `src/content/prices.js` (and `PRICES_VERIFIED`) |
| A source link | `src/content/sources.js` |
| A glossary term | `src/content/glossary.js` |
| A phase, wave or standard | `src/content/journey.js`, `src/content/sequencer.js` |

The Technology register page shows which entries are due for review. `prompts/04-refresh.md` is the monthly routine;
`prompts/03-fact-check.md` is the independent check before a release.

## Design

Typography is Cormorant Garamond, Geist and JetBrains Mono from Google Fonts. Colours are CSS variables in
`src/index.css`, with a dark theme that follows the system setting. Charts use a single-hue ramp validated for
colour-vision deficiency in both themes.

## Disclaimer

Contoso Bank is fictional. Nothing here describes a real organisation's environment. This is a learning aid, not
Microsoft documentation; check the linked sources before relying on any detail.

## Change log

| Date | Change |
| --- | --- |
| 11 Nov 2026 | Rebuilt on the Pathway Kit: archetype pages for journey, glossary, design areas and register; Pipeline and Build options use the Flow and Decision sections; added the Capability sequencer, `PageShell`, the content check, CLAUDE.md, PATHWAY_SPEC.md and the prompts |
| 1 Nov 2026 | First release, rev 2026.11; facts verified against Microsoft and HashiCorp documentation |
