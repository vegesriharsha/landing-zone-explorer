// Shared source links. Each page lists the ones it relies on.
export const VERIFIED = '1 Nov 2026';

export const src = {
  lzOverview: {
    title: 'What is an Azure landing zone? (Cloud Adoption Framework)',
    url: 'https://learn.microsoft.com/azure/cloud-adoption-framework/ready/landing-zone/',
  },
  designAreas: {
    title: 'Azure landing zone design areas',
    url: 'https://learn.microsoft.com/azure/cloud-adoption-framework/ready/landing-zone/design-areas',
  },
  cafOverview: {
    title: 'Cloud Adoption Framework overview',
    url: 'https://learn.microsoft.com/azure/cloud-adoption-framework/overview',
  },
  accelerator: {
    title: 'Azure Landing Zones IaC accelerator',
    url: 'https://azure.github.io/Azure-Landing-Zones/accelerator/',
  },
  bootstrap: {
    title: 'Accelerator Phase 2: Bootstrap',
    url: 'https://azure.github.io/Azure-Landing-Zones/accelerator/2_bootstrap/',
  },
  moduleIndex: {
    title: 'Accelerator Terraform module index',
    url: 'https://azure.github.io/Azure-Landing-Zones/accelerator/starter-terraform/module-index/',
  },
  scenarios: {
    title: 'Accelerator Terraform scenarios',
    url: 'https://azure.github.io/Azure-Landing-Zones/accelerator/starter-terraform/scenarios/',
  },
  alzLibrary: {
    title: 'Azure Landing Zones Library (management groups and policy)',
    url: 'https://github.com/Azure/Azure-Landing-Zones-Library',
  },
  avm: { title: 'Azure Verified Modules', url: 'https://azure.github.io/Azure-Verified-Modules/' },
  avmPattern: {
    title: 'AVM Terraform pattern module index',
    url: 'https://azure.github.io/Azure-Verified-Modules/indexes/terraform/tf-pattern-modules/',
  },
  subVending: {
    title: 'Subscription vending (ALZ docs)',
    url: 'https://azure.github.io/Azure-Landing-Zones/sub-vending/',
  },
  subVendingRepo: {
    title: 'avm-ptn-alz-sub-vending module',
    url: 'https://github.com/Azure/terraform-azure-avm-ptn-alz-sub-vending',
  },
  policyEffects: {
    title: 'Azure Policy definitions: effect basics and order of evaluation',
    url: 'https://learn.microsoft.com/azure/governance/policy/concepts/effect-basics',
  },
  policyScope: {
    title: 'Azure Policy scope and inheritance',
    url: 'https://learn.microsoft.com/azure/governance/policy/concepts/scope',
  },
  policyExemption: {
    title: 'Azure Policy exemption structure',
    url: 'https://learn.microsoft.com/azure/governance/policy/concepts/exemption-structure',
  },
  policyK8s: {
    title: 'Azure Policy for Kubernetes',
    url: 'https://learn.microsoft.com/azure/governance/policy/concepts/policy-for-kubernetes',
  },
  conftest: { title: 'Conftest', url: 'https://www.conftest.dev/' },
  opa: { title: 'Open Policy Agent documentation', url: 'https://www.openpolicyagent.org/docs/latest/' },
  hubSpoke: {
    title: 'Hub-spoke network topology in Azure',
    url: 'https://learn.microsoft.com/azure/architecture/networking/architecture/hub-spoke',
  },
  vwan: { title: 'Azure Virtual WAN overview', url: 'https://learn.microsoft.com/azure/virtual-wan/virtual-wan-about' },
  firewallSku: { title: 'Choose the right Azure Firewall SKU', url: 'https://learn.microsoft.com/azure/firewall/choose-firewall-sku' },
  ghOidc: {
    title: 'GitHub Actions: OpenID Connect reference',
    url: 'https://docs.github.com/en/actions/reference/security/oidc',
  },
  ghImmutable: {
    title: 'Immutable subject claims for GitHub Actions OIDC tokens (GitHub changelog)',
    url: 'https://github.blog/changelog/2026-04-23-immutable-subject-claims-for-github-actions-oidc-tokens',
  },
  entraImmutable: {
    title: 'Migrate federated credentials to GitHub immutable subjects (Microsoft Entra)',
    url: 'https://learn.microsoft.com/entra/workload-id/workload-identities-github-immutable-subjects',
  },
  wif: {
    title: 'Workload identity federation (Microsoft Entra)',
    url: 'https://learn.microsoft.com/entra/workload-id/workload-identity-federation',
  },
  azurermBackend: {
    title: 'Terraform azurerm backend',
    url: 'https://developer.hashicorp.com/terraform/language/backend/azurerm',
  },
  tablePlans: {
    title: 'Azure Monitor Logs table plans',
    url: 'https://learn.microsoft.com/azure/azure-monitor/logs/logs-table-plans',
  },
  retention: {
    title: 'Manage data retention in a Log Analytics workspace',
    url: 'https://learn.microsoft.com/azure/azure-monitor/logs/data-retention-configure',
  },
  amba: {
    title: 'Azure Monitor Baseline Alerts: ALZ pattern',
    url: 'https://azure.github.io/azure-monitor-baseline-alerts/patterns/alz/',
  },
  actionGroups: { title: 'Action groups', url: 'https://learn.microsoft.com/azure/azure-monitor/alerts/action-groups' },
  amaMigration: {
    title: 'Migrate to Azure Monitor Agent',
    url: 'https://learn.microsoft.com/azure/azure-monitor/agents/azure-monitor-agent-migration',
  },
  sentinel: { title: 'Microsoft Sentinel overview', url: 'https://learn.microsoft.com/azure/sentinel/overview' },
  defenderCspm: {
    title: 'Cloud security posture management in Defender for Cloud',
    url: 'https://learn.microsoft.com/azure/defender-for-cloud/concept-cloud-security-posture-management',
  },
  tagPolicies: {
    title: 'Assign policy definitions for tag compliance',
    url: 'https://learn.microsoft.com/azure/azure-resource-manager/management/tag-policies',
  },
  platformEng: {
    title: 'What is platform engineering? (Microsoft Learn)',
    url: 'https://learn.microsoft.com/platform-engineering/what-is-platform-engineering',
  },
  adeRetire: {
    title: 'Azure Deployment Environments retirement guide',
    url: 'https://learn.microsoft.com/azure/deployment-environments/deployment-environments-retirement-guide',
  },
  aztfexport: {
    title: 'Azure Export for Terraform overview',
    url: 'https://learn.microsoft.com/azure/developer/terraform/azure-export-for-terraform/export-terraform-overview',
  },
  tfImport: { title: 'Terraform: import resources overview', url: 'https://developer.hashicorp.com/terraform/language/import' },
  reviewChecklists: { title: 'Azure review checklists', url: 'https://github.com/Azure/review-checklists' },
  naming: {
    title: 'Define your naming convention (Cloud Adoption Framework)',
    url: 'https://learn.microsoft.com/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming',
  },
  abbreviations: {
    title: 'Abbreviation recommendations for Azure resources',
    url: 'https://learn.microsoft.com/azure/cloud-adoption-framework/ready/azure-best-practices/resource-abbreviations',
  },
  namingRules: {
    title: 'Naming rules and restrictions for Azure resources',
    url: 'https://learn.microsoft.com/azure/azure-resource-manager/management/resource-name-rules',
  },
  azurermV5: {
    title: 'Terraform AzureRM provider 5.0 is generally available',
    url: 'https://www.hashicorp.com/blog/terraform-azurerm-provider-50-now-generally-available',
  },
  stateImporter: { title: 'Azure/terraform-state-importer', url: 'https://github.com/Azure/terraform-state-importer' },
  alzMigration: { title: 'ALZ Terraform migration guidance', url: 'https://azure.github.io/Azure-Landing-Zones/terraform/migration/' },
  planning: { title: 'Accelerator Phase 0: planning', url: 'https://azure.github.io/Azure-Landing-Zones/accelerator/0_planning/' },
  permissionsFaq: { title: 'Accelerator permissions FAQ', url: 'https://azure.github.io/Azure-Landing-Zones/accelerator/faq/permissions/' },
  mgOptions: {
    title: 'Accelerator option: customise management group names and IDs',
    url: 'https://azure.github.io/Azure-Landing-Zones/accelerator/starter-terraform/options/management-groups/',
  },
  hcpDynamic: {
    title: 'HCP Terraform dynamic credentials for Azure',
    url: 'https://developer.hashicorp.com/terraform/cloud-docs/dynamic-provider-credentials/azure-configuration',
  },
  hcpOverview: { title: 'HCP Terraform plans and features', url: 'https://developer.hashicorp.com/terraform/cloud-docs/overview' },
  hcpPolicy: { title: 'HCP Terraform policy enforcement', url: 'https://developer.hashicorp.com/terraform/cloud-docs/policy-enforcement' },
  tfeReleases: { title: 'Terraform Enterprise 2.1.x release notes', url: 'https://developer.hashicorp.com/terraform/enterprise/releases/2.1.x' },
  uamiFederated: {
    title: 'Federated credentials on a user-assigned managed identity',
    url: 'https://learn.microsoft.com/entra/workload-id/workload-identity-federation-create-trust-user-assigned-managed-identity',
  },
  cafCsp: {
    title: 'CAF: Azure billing with a Cloud Solution Provider',
    url: 'https://learn.microsoft.com/azure/cloud-adoption-framework/ready/landing-zone/design-area/azure-billing-cloud-solution-provider',
  },
  cafEa: {
    title: 'CAF: Enterprise Agreement enrollment design',
    url: 'https://learn.microsoft.com/azure/cloud-adoption-framework/ready/landing-zone/design-area/azure-billing-enterprise-agreement',
  },
  cafMca: {
    title: 'CAF: Microsoft Customer Agreement design',
    url: 'https://learn.microsoft.com/azure/cloud-adoption-framework/ready/landing-zone/design-area/azure-billing-microsoft-customer-agreement',
  },
  partnerCost: { title: 'Get started with Cost Management for partners', url: 'https://learn.microsoft.com/azure/cost-management-billing/costs/get-started-partners' },
  costScopes: { title: 'Understand and work with Cost Management scopes', url: 'https://learn.microsoft.com/azure/cost-management-billing/costs/understand-work-scopes' },
  mpaSubs: {
    title: 'Create subscriptions for a Microsoft Partner Agreement programmatically',
    url: 'https://learn.microsoft.com/azure/cost-management-billing/manage/programmatically-create-subscription-microsoft-partner-agreement',
  },
  tagInheritance: { title: 'Enable tag inheritance in Cost Management', url: 'https://learn.microsoft.com/azure/cost-management-billing/costs/enable-tag-inheritance' },
  reservationExchange: {
    title: 'Exchange and refund Azure reservations',
    url: 'https://learn.microsoft.com/azure/cost-management-billing/reservations/exchange-and-refund-azure-reservations',
  },
  savingsPlan: {
    title: 'What are Azure savings plans for compute?',
    url: 'https://learn.microsoft.com/azure/cost-management-billing/savings-plan/savings-plan-compute-overview',
  },
  budgets: { title: 'Create and manage budgets', url: 'https://learn.microsoft.com/azure/cost-management-billing/costs/tutorial-acm-create-budgets' },
  lighthouseCsp: { title: 'Azure Lighthouse and the CSP program', url: 'https://learn.microsoft.com/azure/lighthouse/concepts/cloud-solution-provider' },
  finopsAllocation: { title: 'FinOps: allocation', url: 'https://learn.microsoft.com/cloud-computing/finops/framework/understand/allocation' },
  organize: { title: 'CAF: Organize resources', url: 'https://learn.microsoft.com/azure/cloud-adoption-framework/ready/azure-setup-guide/organize-resources' },
  locks: { title: 'Lock your resources to protect your infrastructure', url: 'https://learn.microsoft.com/azure/azure-resource-manager/management/lock-resources' },
  transition: {
    title: 'CAF: Transition existing environments to Azure landing zones',
    url: 'https://learn.microsoft.com/azure/cloud-adoption-framework/ready/enterprise-scale/transition',
  },
  duplicateAudit: {
    title: 'CAF: Duplicate landing zone management groups, audit only',
    url: 'https://learn.microsoft.com/azure/cloud-adoption-framework/ready/landing-zone/align-approach-duplicate-brownfield-audit-only',
  },
  mgManage: { title: 'Manage management groups (moving subscriptions)', url: 'https://learn.microsoft.com/azure/governance/management-groups/manage' },
  moveSupport: { title: 'Move support for Azure resources', url: 'https://learn.microsoft.com/azure/azure-resource-manager/management/move-support-resources' },
  policyRule: { title: 'Azure Policy rule structure', url: 'https://learn.microsoft.com/azure/governance/policy/concepts/definition-structure-policy-rule' },
  policyLibraryAvm: { title: 'Azure/policy-library-avm', url: 'https://github.com/Azure/policy-library-avm' },
  remediation: {
    title: 'Remediate non-compliant resources with Azure Policy',
    url: 'https://learn.microsoft.com/azure/governance/policy/how-to/remediate-resources',
  },
  secureScore: { title: 'Secure score in Defender for Cloud', url: 'https://learn.microsoft.com/azure/defender-for-cloud/secure-score-security-controls' },
  freeAccount: { title: 'Azure free account and free services', url: 'https://azure.microsoft.com/pricing/free-services/' },
  vsCredits: {
    title: 'Monthly Azure credits for Visual Studio subscribers',
    url: 'https://azure.microsoft.com/pricing/member-offers/credit-for-visual-studio-subscribers/',
  },
  spendingLimit: {
    title: 'Azure spending limit',
    url: 'https://learn.microsoft.com/azure/cost-management-billing/manage/spending-limit',
  },
  pricingCalc: { title: 'Azure pricing calculator', url: 'https://azure.microsoft.com/pricing/calculator/' },
  ghEnvironments: {
    title: 'GitHub: managing environments for deployment',
    url: 'https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments',
  },
  idpTeam: {
    title: 'Platform engineering guide: self-service',
    url: 'https://learn.microsoft.com/platform-engineering/about/self-service',
  },
  psrule: { title: 'PSRule for Azure: using Terraform', url: 'https://azure.github.io/PSRule.Rules.Azure/using-terraform/' },
  epac: { title: 'Enterprise Policy as Code (EPAC)', url: 'https://azure.github.io/enterprise-azure-policy-as-code/' },
  retailPrices: { title: 'Azure Retail Prices API', url: 'https://learn.microsoft.com/rest/api/cost-management/retail-prices/azure-retail-prices' },
  monitorPricing: { title: 'Azure Monitor pricing', url: 'https://azure.microsoft.com/pricing/details/monitor/' },
  logsOverview: { title: 'Azure Monitor Logs overview: table plan comparison', url: 'https://learn.microsoft.com/azure/azure-monitor/logs/data-platform-logs' },
  serviceHealth: { title: 'Service Health alerts', url: 'https://learn.microsoft.com/azure/service-health/alerts-activity-log-service-notifications-portal' },
};
