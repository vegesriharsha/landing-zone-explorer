# Landing Zone Explorer

Interactive explainers, simulators and dashboards for Azure landing zones, built around **Contoso Bank**, a fictional bank. Nineteen pages cover the adoption journey, policy and hierarchy, networking, resource groups, naming, the IaC accelerator, pipelines and identities, Terraform state, subscription vending, brownfield migration, observability, compliance, billing, paved paths, a personal-lab cost meter and a technology register.

Every page states the date its facts were last verified and lists its sources. Prices are East US 2 retail list prices from the Azure Retail Prices API.

## Run it locally

Needs Node.js 22.12 or later.

```bash
npm ci
npm run dev      # http://localhost:5173
npm run build    # static site in dist/
npm run preview  # serve the built site
```

## Publish to GitHub Pages

1. Create a public repository and push this folder to its `main` branch.
2. In the repository, open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Push to `main` (or run the workflow from the **Actions** tab). The workflow in `.github/workflows/deploy.yml` builds the site and deploys it.

The site uses hash links (`#pipeline`) and relative asset paths, so it works at `https://<user>.github.io/<repo>/` without extra configuration.

## Keep it current

| What changed | Edit |
| --- | --- |
| A fact on a page | The page in `src/pages/`, then `VERIFIED` in `src/data/sources.js` |
| A component's status or version | `src/data/register.js` |
| A price | `src/data/prices.js` (and `PRICES_VERIFIED`) |
| A source link | `src/data/sources.js` |
| A glossary term | `src/data/glossary.js` |

The Technology register page shows which entries are due for review.

## Design

Typography is Cormorant Garamond, Geist and JetBrains Mono from Google Fonts. Colours are CSS variables in `src/index.css`, with a dark theme that follows the system setting. Charts use a single-hue ramp validated for colour-vision deficiency in both themes.

## Disclaimer

Contoso Bank is fictional. Nothing here describes a real organisation's environment. This is a learning aid, not Microsoft documentation; check the linked sources before relying on any detail.
