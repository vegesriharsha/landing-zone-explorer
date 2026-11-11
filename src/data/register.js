// The technology register. Edit this file when you re-verify something:
// update `verified` (YYYY-MM-DD), the note and, if it changed, the status.
// Review cadence by status (days) decides when an entry is next due.
export const cadence = { Adopt: 180, Hold: 90, Watch: 30, Decide: 30, Retiring: 30 };

export const statusInfo = {
  Adopt: 'Generally available and supported; use it.',
  Hold: 'Works, but not GA, not supported, or blocked by something else. Don’t build on it yet.',
  Watch: 'In use or relevant, with a change coming. Re-check monthly.',
  Decide: 'A decision the organisation still has to make.',
  Retiring: 'Being withdrawn. Don’t start; plan the exit if you use it.',
};

export const register = [
  { name: 'ALZ IaC accelerator (Terraform)', cat: 'Platform code', status: 'Adopt', version: 'Current release', verified: '2026-11-01', note: 'Bootstraps GitHub, Azure DevOps or local; deploys the starter module built on AVM.', src: 'accelerator' },
  { name: 'ALZ library', cat: 'Platform code', status: 'Adopt', version: '2026.10.0', verified: '2026-11-01', note: 'Policy definitions, initiatives and archetypes; pin the release you deploy.', src: 'alzLibrary' },
  { name: 'avm-ptn-alz', cat: 'Platform code', status: 'Adopt', version: '0.22.0', verified: '2026-11-01', note: 'Management groups, policy and role assignments from the library; built on AzAPI.', src: 'avmPattern' },
  { name: 'avm-ptn-alz-management', cat: 'Platform code', status: 'Adopt', version: '0.10.0', verified: '2026-11-01', note: 'Platform Log Analytics workspace, agent identity, data collection rules.', src: 'avmPattern' },
  { name: 'ALZ connectivity patterns (hub-and-spoke, Virtual WAN)', cat: 'Platform code', status: 'Adopt', version: 'Pinned', verified: '2026-11-01', note: 'Choose one topology per region.', src: 'scenarios' },
  { name: 'avm-ptn-alz-sub-vending', cat: 'Platform code', status: 'Adopt', version: '0.3.4', verified: '2026-11-01', note: 'Subscription vending; adopt-by-ID path for CSP.', src: 'subVendingRepo' },
  { name: 'AzureRM provider 4.x', cat: 'Providers', status: 'Adopt', version: '~> 4.0', verified: '2026-11-01', note: 'Required by the starter, management and connectivity modules; avm-ptn-alz and vending use AzAPI.', src: 'moduleIndex' },
  { name: 'AzureRM provider 5.x', cat: 'Providers', status: 'Hold', version: '5.0 GA', verified: '2026-11-01', note: 'Generally available (5.0 in July 2026), but the starter, management and connectivity modules still constrain to 4.x.', src: 'azurermV5' },
  { name: 'GitHub OIDC, name-based subjects', cat: 'Pipeline', status: 'Watch', version: '—', verified: '2026-11-01', note: 'Works today. Repos created, renamed or transferred after 15 July 2026 use immutable subjects.', src: 'ghOidc' },
  { name: 'GitHub immutable subject claims', cat: 'Pipeline', status: 'Watch', version: 'Opt-in for existing repos', verified: '2026-11-01', note: 'Add matching federated credentials before opting in; GitHub.com only.', src: 'entraImmutable' },
  { name: 'Azure Storage state backend', cat: 'Pipeline', status: 'Adopt', version: 'azurerm backend', verified: '2026-11-01', note: 'Accelerator default: Entra ID auth, versioning and soft delete on.', src: 'azurermBackend' },
  { name: 'HCP Terraform', cat: 'Pipeline', status: 'Decide', version: 'Free, Essentials, Standard, Premium', verified: '2026-11-01', note: 'Not supported by the accelerator; an enterprise-wide run-platform decision.', src: 'hcpOverview' },
  { name: 'Terraform Enterprise', cat: 'Pipeline', status: 'Decide', version: '2.1.x', verified: '2026-11-01', note: 'Self-hosted alternative if state must stay inside your boundary.', src: 'tfeReleases' },
  { name: 'Conftest with policy-library-avm', cat: 'Policy', status: 'Hold', version: 'Conftest 0.71 · library 1.0.0', verified: '2026-11-01', note: 'Useful pull-request feedback; Conftest is pre-1.0 and the library has no support statement, so not a control.', src: 'policyLibraryAvm' },
  { name: 'Azure Policy for Kubernetes', cat: 'Policy', status: 'Adopt', version: 'Add-on 1.17.0 · Gatekeeper 3.23.0', verified: '2026-11-01', note: 'Rego inside AKS, reported in Azure Policy compliance.', src: 'policyK8s' },
  { name: 'PSRule for Azure on Terraform', cat: 'Policy', status: 'Hold', version: 'Experimental', verified: '2026-11-01', note: 'Terraform support is marked experimental; fails a GA-only rule.', src: 'psrule' },
  { name: 'Enterprise Policy as Code (EPAC)', cat: 'Policy', status: 'Hold', version: 'Community', verified: '2026-11-01', note: 'Open-source community project. Don’t run it and the ALZ module against the same scope.', src: 'epac' },
  { name: 'terraform-state-importer', cat: 'Brownfield', status: 'Watch', version: 'Current', verified: '2026-11-01', note: 'Maps existing resources for adoption; rehearse in a test tenant.', src: 'stateImporter' },
  { name: 'Azure Export for Terraform (aztfexport)', cat: 'Brownfield', status: 'Watch', version: '0.20', verified: '2026-11-01', note: 'Good for workload resources; management-group policy export unconfirmed.', src: 'aztfexport' },
  { name: 'Azure Monitor Agent', cat: 'Operations', status: 'Adopt', version: '—', verified: '2026-11-01', note: 'The legacy Log Analytics agent is retired.', src: 'amaMigration' },
  { name: 'Azure Monitor Baseline Alerts (ALZ pattern)', cat: 'Operations', status: 'Adopt', version: '—', verified: '2026-11-01', note: 'Baseline alerts and action groups deployed by policy.', src: 'amba' },
  { name: 'Log Analytics Basic and Auxiliary plans', cat: 'Operations', status: 'Adopt', version: '—', verified: '2026-11-01', note: 'Per-table plans; Auxiliary has no alerts.', src: 'logsOverview' },
  { name: 'Defender for Cloud foundational CSPM', cat: 'Security', status: 'Adopt', version: 'Free', verified: '2026-11-01', note: 'Secure score and recommendations at no charge.', src: 'defenderCspm' },
  { name: 'Microsoft Sentinel', cat: 'Security', status: 'Watch', version: 'Defender portal', verified: '2026-11-01', note: 'Azure portal support ends 31 March 2027; plan the move to the Defender portal.', src: 'sentinel' },
  { name: 'Azure Deployment Environments', cat: 'Self-service', status: 'Retiring', version: '—', verified: '2026-11-01', note: 'Retires on 22 February 2027. Read the retirement guide before choosing a self-service front end.', src: 'adeRetire' },
  { name: 'Reservation exchange rules', cat: 'Cost', status: 'Watch', version: '—', verified: '2026-11-01', note: 'Exchange rights change for some services; confirm before buying.', src: 'reservationExchange' },
  { name: 'Retail prices used on this site', cat: 'Cost', status: 'Watch', version: 'East US 2 list', verified: '2026-11-01', note: 'Lab and log prices read from the Retail Prices API.', src: 'retailPrices' },
];
