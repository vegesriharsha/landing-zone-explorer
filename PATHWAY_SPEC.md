# Pathway spec: Azure landing zones at Contoso Bank

Filled in on 11 Nov 2026 from the site as built. A coding session reads it first; change it when the scope changes.

## 1. The technology and the outcome

- **Technology:** Azure landing zones, built with the Azure Landing Zones IaC accelerator (Terraform on Azure Verified
  Modules), governed by Azure Policy, with subscription vending and GitHub Actions pipelines signing in through OIDC.
- **Why now:** Contoso Bank is adopting Azure for the first time. Its regulator expects change control, and the usage
  will stay steady for years, so the foundation has to be right before the first workload lands.
- **Outcome in one sentence:** A workload team gets a governed subscription from a pull request, with policy, logging,
  network and cost control already in place, and the platform team can prove it.

## 2. Audience and their decisions

| Audience | Decisions they need to make | What they already know |
| --- | --- | --- |
| Platform team | Topology, build option, state backend, vending design, naming, when to enforce policy | On-premises networking and operations; little Terraform |
| Risk and compliance | Which policies deny, how exemptions are approved, what evidence exists, when enforcement starts | Control frameworks and change control; not Azure |
| Workload teams | Resource-group layout, names, how their pipeline signs in, what the paved path gives them | Their applications; some CI/CD |
| Finance and FinOps | Billing agreement, budgets per subscription, when to buy commitments | The bank's cost centres; not cloud pricing |

## 3. Hosting

- [x] **Public** (GitHub Pages): fictional organisation, generic content, no internal details anywhere in the repo.
- [ ] **Internal**: real names allowed; host where the organisation approves; repo private.

Fictional organisation name: Contoso Bank

## 4. Capabilities in scope

| Capability | Platform | Risk tier | Wave | GA? |
| --- | --- | --- | --- | --- |
| Sandbox subscriptions | Sandbox management group | Low | 1 | Yes |
| Platform subscriptions under code | Management, connectivity, identity | Low | 1 | Yes |
| Internal (Corp) landing zone from a pull request | avm-ptn-alz-sub-vending | Medium | 2 | Yes |
| Workload deploys with its own pipeline identity | GitHub OIDC to a managed identity | Medium | 2 | Yes |
| Online landing zone with public ingress | Online management group, WAF in front | High | 3 | Yes |
| Brownfield subscriptions under policy | Audit-only groups, then production groups | High | 3 | Yes |
| Deny policies enforcing across workload landing zones | Azure Policy, enforcement mode Default | High | 3 | Yes |
| Reservations and savings plans | Cost Management | Medium | 4 | Yes |

Out of scope, and until when: HCP Terraform or Terraform Enterprise as the run platform (an organisation-wide
decision, see the register); Azure Deployment Environments (retiring 22 Feb 2027); multi-region and Virtual WAN
beyond what the network page shows; AKS and workload architecture.

## 5. Standards domains

| Domain | What its standards must define |
| --- | --- |
| Scope | Regions and topology, IaC tooling, what the hub provides, which landing-zone types exist |
| Governance | Naming and tags, billing route, hierarchy, policy assignments and their enforcement mode, exemptions, vending |
| Identity | Plan and apply identities, state access, workload pipeline identities, standing access and PIM |
| Ownership | Platform owner and team, owner group and cost centre per subscription, review cadence |
| Observability | Platform workspace, diagnostic settings by policy, budgets and alerts, drift detection, cost export |

## 6. Waves

| Wave | Name | Window | Capabilities | Gate (standards that must exist) |
| --- | --- | --- | --- | --- |
| 0 | Foundations | Before the platform is deployed | — | Topology, IaC, naming and tags, billing route, platform owner |
| 1 | Platform, audit-only | Bootstrap and first deploy | Sandbox and platform subscriptions | Hierarchy, DoNotEnforce policy, split identities, protected state, hub network, logging, triage |
| 2 | Pilot workloads | First vended landing zones | Internal landing zone, workload pipeline identity | Vending live, paved paths published, repo template, owner tags, budgets |
| 3 | Scale and enforce | Everyone | Online landing zone, brownfield, enforced Deny | Enforce with exemptions, subscriptions moved, PIM, drift alerts, quarterly review |
| 4 | Steady state | Ongoing | Reservations and savings plans | Cost export by tag, commitments against a measured baseline |

The Capability sequencer page (`src/content/sequencer.js`) is the source for this table.

## 7. Pages wanted

| Page | Archetype or custom | The idea it must make obvious |
| --- | --- | --- |
| Adoption journey | journey | Prove the platform before anything depends on it |
| Capability sequencer | sequencer | Capabilities and the standards that gate them move together |
| Glossary | glossary | Every term in plain language |
| Design areas | explorer | Eight areas, decided once for everyone |
| Hierarchy and policy | custom | Policy flows down the tree, in a fixed evaluation order |
| Network traffic | custom | The firewall only sees what is routed to it |
| Resource groups | custom | Group by what lives and dies together |
| Naming studio | custom | Names you can live with for years |
| Build options | custom (decision section) | Four ways to build it, one that usually wins |
| Pipeline and identities | custom (flow section) | Two identities, one approval, no secrets |
| Terraform state | custom | State is the platform's memory; guard it |
| Subscription vending | custom | A subscription is a pull request, not a ticket |
| Brownfield migration | custom | Build beside, then move |
| Observability | custom | Collect on purpose, keep what you need, page the right person |
| Compliance dashboard | custom | Audit first, enforce when the numbers say so |
| Billing and cost | custom | Make the subscription the unit of cost |
| Paved paths | custom | Most of a ticket's life is waiting |
| Lab cost meter | custom | How far free credits take you |
| Technology register | register | Everything we rely on, and when we last checked |

## 8. Practice

Not built yet. Candidate levels: Azure CLI (list management groups, summarise policy state, move a subscription),
Terraform (init, plan, import, state list), KQL on AzureActivity, git (branch, pull request). Phone-first, hints not
answers.

## 9. Documents

- [ ] Adoption guide (doc)
- [ ] Deep dives, one per hard question (doc)
- [ ] Standards pack: one standard per domain, written to be approved (doc)
- [ ] Hands-on lab with cost limits (doc)

## 10. Sources to trust

Microsoft Learn (Cloud Adoption Framework, Azure Policy, Azure Monitor, Cost Management, naming rules), the Azure
Landing Zones site (accelerator, library, subscription vending), Azure Verified Modules, the module repositories and
their release notes, HashiCorp developer docs (backends, HCP Terraform, Terraform Enterprise), GitHub docs and
changelog (OIDC, environments), the Azure Retail Prices API. All 87 are listed by key in `src/content/sources.js`.

## 11. Constraints

- GA-only for recommendations; previews labelled and on Hold in the register.
- Budget for any hands-on lab: free credits with the spending limit on (Visual Studio or free account), as the Lab
  cost meter page models; nothing on a card.
- Anything that must not appear on the site: real tenant or subscription IDs, real people, real IP plans, any
  organisation's internal names or policies.
