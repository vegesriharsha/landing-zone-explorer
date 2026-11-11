// One entry per page. `id` is the URL hash (#id). Keep ids to letters,
// digits and hyphens so links work on GitHub Pages and in previews.
export const groups = [
  {
    name: 'Foundations',
    pages: [
      { id: 'home', title: 'Overview', kind: 'Index', blurb: 'What this site covers and where to start.' },
      { id: 'journey', title: 'Adoption journey', kind: 'Stepper', blurb: 'Five phases and the gate that closes each one. Tick off the criteria as you go.' },
      { id: 'glossary', title: 'Glossary', kind: 'Explorer', blurb: 'Every term in plain language, with a house-building analogy you can switch on and off.' },
      { id: 'design-areas', title: 'Design areas', kind: 'Explorer', blurb: 'The eight areas a landing zone settles up front, the decisions in each and the default you get.' },
    ],
  },
  {
    name: 'Structure',
    pages: [
      { id: 'policy-simulator', title: 'Hierarchy and policy', kind: 'Simulator', blurb: 'Assign policies to management groups, move subscriptions, try deployments and see what is allowed. Compare with OPA.' },
      { id: 'network-flow', title: 'Network traffic', kind: 'Animated flow', blurb: 'Send packets between spokes, on-premises and the internet and watch where the firewall sits.' },
      { id: 'resource-groups', title: 'Resource groups', kind: 'Simulator', blurb: 'Sort a workload into resource groups and get feedback on lifecycle, access and ownership.' },
      { id: 'naming', title: 'Naming studio', kind: 'Tool', blurb: 'Generate names from a convention and check them against Azure length and character rules.' },
    ],
  },
  {
    name: 'Build',
    pages: [
      { id: 'build-options', title: 'Build options', kind: 'Explorer', blurb: 'Click-ops, custom code, AVM or the accelerator: answer four questions and see which fits.' },
      { id: 'pipeline', title: 'Pipeline and identities', kind: 'Animated flow', blurb: 'Walk a change from pull request to apply and break it on purpose: wrong identity, no approval, renamed repo.' },
      { id: 'state-backends', title: 'Terraform state', kind: 'Explorer', blurb: 'Azure Storage backend or HCP Terraform: how each stores, locks and protects state.' },
      { id: 'vending', title: 'Subscription vending', kind: 'Simulator', blurb: 'Fill in a request and watch the subscription, resource groups and module inputs it produces.' },
      { id: 'brownfield', title: 'Brownfield migration', kind: 'Stepper', blurb: 'Bring a click-ops platform under code, step by step, watching each resource change state.' },
    ],
  },
  {
    name: 'Operate',
    pages: [
      { id: 'observability', title: 'Observability', kind: 'Simulator', blurb: 'Route logs to workspaces, pick table plans, estimate cost and send an alert to the right people.' },
      { id: 'guardrails', title: 'Compliance dashboard', kind: 'Dashboard', blurb: 'A mock platform dashboard: compliance, secure score, budgets and when to switch policy to enforce.' },
      { id: 'billing', title: 'Billing and cost', kind: 'Explorer', blurb: 'How CSP, MCA and EA billing are structured and how a steady estate keeps costs down.' },
      { id: 'paved-paths', title: 'Paved paths', kind: 'Animated flow', blurb: 'Race a ticket queue against a paved path and see where the days go.' },
    ],
  },
  {
    name: 'Practice',
    pages: [
      { id: 'lab-cost', title: 'Lab cost meter', kind: 'Dashboard', blurb: 'Plan a personal lab on free credits: switch components on and off and watch the credit burn.' },
      { id: 'register', title: 'Technology register', kind: 'Dashboard', blurb: 'Every component, its status and when it was last verified. Filter for what needs attention.' },
    ],
  },
];

export const allPages = groups
  .flatMap((g) => g.pages.map((p) => ({ ...p, group: g.name })))
  .map((p, i) => ({ ...p, number: i }));

export const pageById = Object.fromEntries(allPages.map((p) => [p.id, p]));
