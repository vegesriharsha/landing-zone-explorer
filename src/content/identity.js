// Data and rules for the Identity and access page. Each rule restates a statement on a
// Microsoft Learn page named in `src`, checked 20 Nov 2026. The scope tree and the
// subscriptions are the same fictional Contoso Bank data the hierarchy simulator uses.
import { mgTree, initialSubs } from './policies.js';

export const VERIFIED_IDENTITY = '20 Nov 2026';

// Azure RBAC scopes, broadest to narrowest (rbacOverview, rbacScope). The simulator draws
// management groups and subscriptions; resource groups and resources sit below a subscription.
export const scopeLevels = ['Management group', 'Subscription', 'Resource group', 'Resource'];

// Roles the roles page lists as fundamental (rbacRoles). Capabilities are quoted, not extended.
export const roles = [
  { id: 'owner', name: 'Owner', can: ['Grants full access to manage all resources', 'Assign roles in Azure RBAC'], cant: [] },
  {
    id: 'contributor',
    name: 'Contributor',
    can: ['Grants full access to manage all resources'],
    cant: ['Assign roles in Azure RBAC'],
  },
  { id: 'reader', name: 'Reader', can: ['View Azure resources'], cant: [] },
  {
    id: 'uaa',
    name: 'User Access Administrator',
    can: ['Manage user access to Azure resources', 'Assign roles in Azure RBAC', 'Assign themselves or others the Owner role'],
    cant: [],
  },
];

// Every node a role can be assigned at in this model, with the subscriptions it reaches.
function collect(node, path, out) {
  const here = [...path, node.id];
  out.push({ id: node.id, name: node.name, path: here, kind: 'mg' });
  node.children.forEach((c) => collect(c, here, out));
}
const nodes = [];
collect(mgTree, [], nodes);
const mgScopes = nodes.filter((n) => n.id !== 'tenant');
const subScopes = initialSubs.map((s) => ({ id: s.id, name: `Subscription: ${s.id}`, kind: 'sub', mg: s.mg }));

export const scopes = [...mgScopes.map((n) => ({ ...n, label: n.name })), ...subScopes.map((s) => ({ ...s, label: s.name }))];
export const totalSubs = initialSubs.length;

/** Subscriptions a role assigned at `scopeId` reaches: lower levels inherit from higher ones. */
export function reach(scopeId) {
  const scope = scopes.find((s) => s.id === scopeId);
  if (!scope) return [];
  if (scope.kind === 'sub') return [scopeId];
  const pathOf = (mg) => nodes.find((n) => n.id === mg)?.path ?? [];
  return initialSubs.filter((s) => pathOf(s.mg).includes(scopeId)).map((s) => s.id);
}

/**
 * The advice for one assignment. level: wide (several subscriptions), single, or narrow.
 * `tags` lets the page pair each point with its source keys.
 */
export function assess({ role, scopeId, eligible, toGroup }) {
  const hit = reach(scopeId);
  const wide = hit.length > 1;
  const canAssign = role === 'owner' || role === 'uaa';
  const points = [];
  if (wide) {
    points.push({
      text: `Assigned here, ${role === 'reader' ? 'it' : 'this role'} reaches ${hit.length} of ${totalSubs} subscriptions, because lower levels inherit role permissions from higher ones. Microsoft advises avoiding broader roles at broader scopes, even when that seems convenient.`,
      src: ['rbacScope', 'rbacBestPractices'],
    });
  } else {
    points.push({
      text: `Assigned here, it reaches ${hit.length === 1 ? 'one subscription' : 'no subscription'}. A narrower scope limits what a compromised account can touch.`,
      src: ['rbacScope', 'rbacBestPractices'],
    });
  }
  if (canAssign) {
    points.push({
      text: 'This role can assign roles, so whoever holds it can grant more access. Microsoft says to keep subscription owners to a maximum of 3, and to add a condition when assigning a role that can create role assignments.',
      src: ['rbacBestPractices', 'rbacRoles'],
    });
  }
  points.push(
    eligible
      ? {
          text: 'PIM-eligible: nothing is usable until the person activates the role, which can need multi-factor authentication, a justification or approval. There is no difference in the access once active, but exposure time drops. PIM needs licences.',
          src: ['pimOverview', 'pimAzureRoles', 'rbacBestPractices'],
        }
      : {
          text: 'Permanent and active: the access is usable at all times, so a stolen sign-in can use it at once. PIM can make a role eligible and time-bound instead.',
          src: ['pimOverview', 'rbacBestPractices'],
        },
  );
  points.push(
    toGroup
      ? { text: 'Assigned to a group, so people join and leave the group and the number of role assignments, which has a limit per subscription, stays low.', src: ['rbacBestPractices'] }
      : { text: 'Assigned straight to a person. Microsoft advises assigning roles to groups instead, which also keeps the count of role assignments down.', src: ['rbacBestPractices'] },
  );
  const risky = (wide && canAssign) || (wide && !eligible && role !== 'reader');
  return { reach: hit, points, risky };
}

// The emergency access checklist, each line from the emergency access page (emergencyAccess).
export const breakGlass = [
  { id: 'two', text: 'Create two or more emergency access accounts.' },
  { id: 'cloud', text: 'Make them cloud-only on the onmicrosoft.com domain, not federated or synchronised from on-premises.' },
  { id: 'auth', text: 'Use a passkey (FIDO2), or certificate-based authentication, different from your normal admin accounts.' },
  { id: 'ga', text: 'Assign Global Administrator as permanent active in PIM, not eligible.' },
  { id: 'noexpire', text: 'Keep credentials and devices from expiring or being cleaned up automatically.' },
  { id: 'exclude', text: 'Exclude the accounts from Conditional Access policies that block or restrict sign-in.' },
  { id: 'alert', text: 'Alert on every use, for example a severity 0 critical alert in Azure Monitor or Sentinel.' },
  { id: 'test', text: 'Validate that the accounts work at least every 90 days.' },
];

// What a Conditional Access policy weighs and decides (caOverview).
export const caSignals = ['User, group or agent', 'IP location', 'Device', 'Application', 'Risk from Entra ID Protection', 'Microsoft Defender for Cloud Apps'];
export const caDecisions = [
  { name: 'Block access', note: 'The most restrictive decision.' },
  { name: 'Grant access', note: 'May require multi-factor authentication, a compliant device, a password change or terms of use.' },
];

// CAF landing zone identity recommendations (cafIdentityLz).
export const cafRecommendations = [
  'Enforce Microsoft Entra multi-factor authentication for everyone with rights to the Azure environment, using phishing-resistant methods.',
  'Apply Conditional Access to administrators.',
  'Use separate cloud-only accounts for privileged roles.',
  'Use Privileged Identity Management for just-in-time access.',
  'Assign roles to groups, not users.',
  'Assign landing zone roles at subscription or resource group scope, because Azure Policy assignments happen at management group scope.',
  'Keep Global Administrator for emergencies, and do not assign it to more than five people.',
];
