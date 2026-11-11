// term, what it is, house analogy, related page id (optional)
export const glossary = [
  // Organisation and identity
  { cat: 'Identity', term: 'Microsoft Entra tenant', what: "The organisation's single identity directory in Microsoft's cloud. Created once; holds every user, group and app identity.", house: 'The title deed: one per property, hard to change.' },
  { cat: 'Identity', term: 'Microsoft Entra ID', what: 'The identity service (formerly Azure Active Directory) that signs people and workloads in and issues tokens.', house: 'The lock-and-key system for every door.' },
  { cat: 'Identity', term: 'Role-based access control (RBAC)', what: 'Who can do what, assigned at a scope: management group, subscription, resource group or resource. Lower scopes inherit.', house: 'Which keys open which doors.', page: 'policy-simulator' },
  { cat: 'Identity', term: 'Privileged Identity Management (PIM)', what: 'Just-in-time, time-limited elevation to powerful roles, with approval and audit. Needs Entra ID P2 or Entra ID Governance.', house: 'A master key kept in a lockbox and signed out.' },
  { cat: 'Identity', term: 'Managed identity', what: 'An identity Azure manages for a workload, so no secret has to be stored. User-assigned identities can be shared and given federated credentials.', house: 'A staff badge issued by the building, not a copied key.' },
  { cat: 'Identity', term: 'Workload identity federation (OIDC)', what: 'Lets a pipeline sign in to Azure with a short-lived token from GitHub or another issuer, matched to a federated credential. No stored secret.', house: 'A day pass checked at the gate.', page: 'pipeline' },

  // Structure
  { cat: 'Structure', term: 'Management group', what: 'A folder that holds subscriptions or other management groups. Policy and access set on it flow down to everything inside.', house: 'A floor of the building: rules for the floor apply to every room on it.', page: 'policy-simulator' },
  { cat: 'Structure', term: 'Subscription', what: 'A billing and isolation boundary that holds resources. Limits, access and cost reporting are scoped to it.', house: 'A room with its own door and meter.' },
  { cat: 'Structure', term: 'Resource group', what: 'A container inside a subscription for resources that share a lifecycle. Deleting it deletes everything in it.', house: 'Furniture grouped by what moves together.', page: 'resource-groups' },
  { cat: 'Structure', term: 'Landing zone', what: 'A pre-configured environment with identity, network, security, logging and policy in place, ready for workloads.', house: 'A finished shell: slab, wiring, plumbing and locks.' },
  { cat: 'Structure', term: 'Platform landing zone', what: 'The shared subscriptions the platform team runs: management (logging), connectivity (hub network), identity and security.', house: 'The foundation and utilities everyone shares.' },
  { cat: 'Structure', term: 'Workload landing zone', what: "A subscription given to one workload team, wired to the platform and governed by inherited policy. Microsoft's name since October 2026; formerly 'application landing zone'.", house: 'A finished room handed to its occupant.' },
  { cat: 'Structure', term: 'Sandbox', what: 'A separate management group with lighter rules for experiments. Still logged, secured and budget-capped.', house: 'The garage workshop.' },
  { cat: 'Structure', term: 'Subscription vending', what: 'Creating workload landing zones on request, from code, with the same baseline every time.', house: 'A builder stamping out identical, inspected rooms.', page: 'vending' },

  // Governance
  { cat: 'Governance', term: 'Azure Policy', what: 'Rules Azure Resource Manager evaluates on every request and resource. Effects include Deny, Audit, Modify and DeployIfNotExists.', house: 'Building inspections that never stop.', page: 'policy-simulator' },
  { cat: 'Governance', term: 'Policy initiative', what: 'A named bundle of policy definitions assigned together, such as a security baseline.', house: 'An inspection checklist.' },
  { cat: 'Governance', term: 'Policy assignment', what: 'Applying a definition or initiative at a scope. Everything below the scope inherits it; a lower scope cannot override it.', house: 'Inspecting a whole floor.' },
  { cat: 'Governance', term: 'Policy exemption', what: 'A recorded, optionally time-bound exception at a scope, with a category of Waiver or Mitigated.', house: 'A signed variance from the building code.' },
  { cat: 'Governance', term: 'Enforcement mode', what: 'DoNotEnforce evaluates and reports compliance without blocking or changing anything on its own; remediation tasks can still be run by hand. Useful before switching to enforce.', house: 'An inspector who writes notes but doesn’t stop work.' },
  { cat: 'Governance', term: 'Remediation task', what: 'Applies a Modify or DeployIfNotExists fix to resources that already existed before the assignment.', house: 'Retrofitting smoke alarms in older rooms.' },
  { cat: 'Governance', term: 'Tags and tag inheritance', what: 'Name-value labels such as owner and cost centre. Policy or Cost Management can copy subscription and resource-group tags down.', house: 'Labels on every circuit in the fuse box.' },
  { cat: 'Governance', term: 'Microsoft Defender for Cloud', what: 'Posture management (secure score, recommendations, free tier) plus paid threat protection plans per resource type.', house: 'The security survey and alarm system.', page: 'guardrails' },

  // Network
  { cat: 'Network', term: 'Hub-and-spoke', what: 'A central hub network holds shared services (firewall, gateways, DNS); each workload network is a spoke peered to it.', house: 'The water main with a branch to each room.', page: 'network-flow' },
  { cat: 'Network', term: 'Virtual network peering', what: 'Connects two virtual networks privately. Peering is not transitive: two spokes peered to a hub can’t reach each other without a route through it.', house: 'A corridor between two rooms only.' },
  { cat: 'Network', term: 'Azure Virtual WAN', what: 'A Microsoft-managed hub service with routing handled for you; suits many regions or branch offices.', house: 'Mains supply run by the utility company.' },
  { cat: 'Network', term: 'Azure Firewall', what: 'Managed, stateful firewall that inspects traffic between spokes, on-premises and the internet. Basic, Standard and Premium SKUs.', house: 'The main valve and filter.' },
  { cat: 'Network', term: 'User-defined route (UDR)', what: 'A route table entry that sends traffic to a chosen next hop, such as the firewall’s private IP.', house: 'Signs that send every visitor past reception.' },
  { cat: 'Network', term: 'Private endpoint and Private DNS', what: 'A private IP for a platform service inside your network, with DNS that resolves the service name to it.', house: 'An internal door instead of a street entrance.' },
  { cat: 'Network', term: 'ExpressRoute and VPN gateway', what: 'A private circuit or an encrypted tunnel between on-premises and Azure.', house: 'The covered walkway to the old building.' },

  // Code and delivery
  { cat: 'Delivery', term: 'Infrastructure as code (IaC)', what: 'Describing infrastructure in versioned files that a tool turns into resources. Reviewable, repeatable, auditable.', house: 'Signed architectural drawings.', page: 'build-options' },
  { cat: 'Delivery', term: 'Terraform', what: "HashiCorp's declarative IaC tool. Compares files with reality, shows a plan, then applies it.", house: 'A builder who quotes before building.' },
  { cat: 'Delivery', term: 'Provider (AzureRM, AzAPI)', what: 'Terraform plug-ins for Azure. AzureRM offers typed resources; AzAPI calls any Azure API version directly. New AVM modules use AzAPI.', house: 'The trades: electrician, plumber.' },
  { cat: 'Delivery', term: 'State file', what: 'Terraform’s record of what it manages. Stored remotely, locked during runs, versioned and protected.', house: 'The as-built record.', page: 'state-backends' },
  { cat: 'Delivery', term: 'Module', what: 'A reusable package of Terraform with inputs and outputs, pinned to a version.', house: 'A prefabricated staircase.' },
  { cat: 'Delivery', term: 'Azure Verified Modules (AVM)', what: "Microsoft's owned, tested Terraform and Bicep modules: resource modules (one service), pattern modules (architectures) and utility modules.", house: 'Certified components with a warranty.' },
  { cat: 'Delivery', term: 'ALZ IaC accelerator', what: 'Bootstrap that asks your choices, creates repos, pipelines, identities and state storage, then deploys the platform from AVM modules.', house: 'A show home you configure and order.', page: 'pipeline' },
  { cat: 'Delivery', term: 'Paved path', what: 'A supported, pre-approved way to do a common task, made easier than the alternatives.', house: 'The path people actually walk on.', page: 'paved-paths' },

  // Observability and cost
  { cat: 'Operations', term: 'Log Analytics workspace', what: 'The store and query engine (KQL) for logs. Each table has a plan: Analytics, Basic or Auxiliary.', house: 'The logbook for the building.', page: 'observability' },
  { cat: 'Operations', term: 'Diagnostic settings', what: 'Per-resource setting that sends its platform logs and metrics to a workspace, storage or event hub. Usually deployed by policy.', house: 'Wiring each appliance to the logbook.' },
  { cat: 'Operations', term: 'Azure Monitor Agent and DCRs', what: 'The agent on VMs and Arc servers, and the data collection rules that say what it collects and where it sends it.', house: 'Sensors in each room and their settings.' },
  { cat: 'Operations', term: 'Alert rule and action group', what: 'A condition that fires an alert, and the reusable list of who or what is notified.', house: 'The smoke alarm and who it calls.' },
  { cat: 'Operations', term: 'Azure Monitor Baseline Alerts (AMBA)', what: "Microsoft's recommended alerts per service, deployed as policy so new resources get alerts automatically.", house: 'Preset alarm thresholds for every appliance.' },
  { cat: 'Operations', term: 'Budget', what: 'A spending threshold with alerts at chosen percentages of actual or forecast cost.', house: 'The utility-bill warning.', page: 'billing' },
  { cat: 'Operations', term: 'Cloud Solution Provider (CSP)', what: 'Buying Azure through a Microsoft partner who bills you and provides first-line support.', house: 'Buying utilities through a property manager.', page: 'billing' },
];

export const glossaryCats = ['All', 'Identity', 'Structure', 'Governance', 'Network', 'Delivery', 'Operations'];
