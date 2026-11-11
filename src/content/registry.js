// One entry per page. `id` is the URL hash (#id): letters, digits and hyphens only.
// Use `archetype` + `data` for data-driven pages, or `component` for a custom page.
import journey from './journey.js';
import sequencer from './sequencer.js';
import glossary from './glossary.js';
import designAreas from './design-areas.js';
import register from './register.js';
import PolicySimulator from '../pages/PolicySimulator.jsx';
import NetworkFlow from '../pages/NetworkFlow.jsx';
import ResourceGroups from '../pages/ResourceGroups.jsx';
import Naming from '../pages/Naming.jsx';
import BuildOptions from '../pages/BuildOptions.jsx';
import Pipeline from '../pages/Pipeline.jsx';
import StateBackends from '../pages/StateBackends.jsx';
import Vending from '../pages/Vending.jsx';
import Brownfield from '../pages/Brownfield.jsx';
import Observability from '../pages/Observability.jsx';
import Guardrails from '../pages/Guardrails.jsx';
import Billing from '../pages/Billing.jsx';
import PavedPaths from '../pages/PavedPaths.jsx';
import LabCost from '../pages/LabCost.jsx';

export const groups = [
  {
    name: 'Foundations',
    pages: [
      { id: 'home', title: 'Overview', kind: 'Index', archetype: 'home', blurb: 'What this site covers and where to start.' },
      { id: 'journey', title: 'Adoption journey', kind: 'Stepper', archetype: 'journey', data: journey, blurb: 'Five phases and the gate that closes each one. Tick off the criteria as you go.' },
      { id: 'sequencer', title: 'Capability sequencer', kind: 'Sequencer', archetype: 'sequencer', data: sequencer, blurb: 'What the platform must have in place before each kind of workload can land. Tick standards and watch the gates close.' },
      { id: 'glossary', title: 'Glossary', kind: 'Explorer', archetype: 'glossary', data: glossary, blurb: 'Every term in plain language, with a house-building analogy you can switch on and off.' },
      { id: 'design-areas', title: 'Design areas', kind: 'Explorer', archetype: 'explorer', data: designAreas, blurb: 'The eight areas a landing zone settles up front, the decisions in each and the default you get.' },
    ],
  },
  {
    name: 'Structure',
    pages: [
      { id: 'policy-simulator', title: 'Hierarchy and policy', kind: 'Simulator', component: PolicySimulator, blurb: 'Assign policies to management groups, move subscriptions, try deployments and see what is allowed. Compare with OPA.' },
      { id: 'network-flow', title: 'Network traffic', kind: 'Animated flow', component: NetworkFlow, blurb: 'Send packets between spokes, on-premises and the internet and watch where the firewall sits.' },
      { id: 'resource-groups', title: 'Resource groups', kind: 'Simulator', component: ResourceGroups, blurb: 'Sort a workload into resource groups and get feedback on lifecycle, access and ownership.' },
      { id: 'naming', title: 'Naming studio', kind: 'Tool', component: Naming, blurb: 'Generate names from a convention and check them against Azure length and character rules.' },
    ],
  },
  {
    name: 'Build',
    pages: [
      { id: 'build-options', title: 'Build options', kind: 'Explorer', component: BuildOptions, blurb: 'Click-ops, custom code, AVM or the accelerator: answer four questions and see which fits.' },
      { id: 'pipeline', title: 'Pipeline and identities', kind: 'Animated flow', component: Pipeline, blurb: 'Walk a change from pull request to apply and break it on purpose: wrong identity, no approval, renamed repo.' },
      { id: 'state-backends', title: 'Terraform state', kind: 'Explorer', component: StateBackends, blurb: 'Azure Storage backend or HCP Terraform: how each stores, locks and protects state.' },
      { id: 'vending', title: 'Subscription vending', kind: 'Simulator', component: Vending, blurb: 'Fill in a request and watch the subscription, resource groups and module inputs it produces.' },
      { id: 'brownfield', title: 'Brownfield migration', kind: 'Stepper', component: Brownfield, blurb: 'Bring a click-ops platform under code, step by step, watching each resource change state.' },
    ],
  },
  {
    name: 'Operate',
    pages: [
      { id: 'observability', title: 'Observability', kind: 'Simulator', component: Observability, blurb: 'Route logs to workspaces, pick table plans, estimate cost and send an alert to the right people.' },
      { id: 'guardrails', title: 'Compliance dashboard', kind: 'Dashboard', component: Guardrails, blurb: 'A mock platform dashboard: compliance, secure score, budgets and when to switch policy to enforce.' },
      { id: 'billing', title: 'Billing and cost', kind: 'Explorer', component: Billing, blurb: 'How CSP, MCA and EA billing are structured and how a steady estate keeps costs down.' },
      { id: 'paved-paths', title: 'Paved paths', kind: 'Animated flow', component: PavedPaths, blurb: 'Race a ticket queue against a paved path and see where the days go.' },
    ],
  },
  {
    name: 'Practice',
    pages: [
      { id: 'lab-cost', title: 'Lab cost meter', kind: 'Dashboard', component: LabCost, blurb: 'Plan a personal lab on free credits: switch components on and off and watch the credit burn.' },
      { id: 'register', title: 'Technology register', kind: 'Dashboard', archetype: 'register', data: register, blurb: 'Every component, its status and when it was last verified. Filter for what needs attention.' },
    ],
  },
];

export const allPages = groups.flatMap((g) => g.pages.map((p) => ({ ...p, group: g.name })));
export const pageById = Object.fromEntries(allPages.map((p) => [p.id, p]));
