import { useState } from 'react';
import { Section, Insight, Segmented, Select, Toggle, Pill, Callout, Illustrative } from '../components/ui.jsx';
import PageShell from '../components/PageShell.jsx';
import config from '../pathway.config.js';
import { useLocalState } from '../lib/hooks.js';
import { mgTree, initialSubs } from '../content/policies.js';
import {
  VERIFIED_IDENTITY,
  roles,
  scopes,
  totalSubs,
  scopeLevels,
  assess,
  breakGlass,
  caSignals,
  caDecisions,
  cafRecommendations,
} from '../content/identity.js';

/* ---------- Scope tree: where the role is assigned and what it reaches ---------- */

function TreeRow({ node, depth, scopeId, reached }) {
  const subs = initialSubs.filter((s) => s.mg === node.id);
  const assigned = node.id === scopeId;
  const inherits = !assigned && node.reachedBy;
  return (
    <li>
      <div
        className={`flex flex-wrap items-center gap-2 border-l-2 py-1.5 pr-2 ${node.hit ? 'border-navy bg-navy-soft' : 'border-transparent'}`}
        style={{ paddingLeft: 12 + depth * 20 }}
      >
        <span className={`text-[14px] ${node.hit ? 'font-medium text-ink' : 'text-muted'}`}>{node.name}</span>
        {assigned && <Pill tone="navy">Assigned here</Pill>}
        {inherits && <Pill tone="neutral">Inherits</Pill>}
      </div>
      {subs.map((s) => {
        const hit = reached.includes(s.id);
        const here = s.id === scopeId;
        return (
          <div
            key={s.id}
            className={`flex flex-wrap items-center gap-2 border-l-2 py-1.5 pr-2 ${hit ? 'border-navy bg-navy-soft' : 'border-transparent'}`}
            style={{ paddingLeft: 12 + (depth + 1) * 20 }}
          >
            <span className={`font-mono text-[12.5px] ${hit ? 'text-ink' : 'text-subtle'}`}>{s.id}</span>
            {here && <Pill tone="navy">Assigned here</Pill>}
            {hit && !here && <Pill tone="neutral">Inherits</Pill>}
          </div>
        );
      })}
      {node.children.length > 0 && (
        <ul>
          {node.children.map((c) => (
            <TreeRow key={c.id} node={c} depth={depth + 1} scopeId={scopeId} reached={reached} />
          ))}
        </ul>
      )}
    </li>
  );
}

// Mark which management groups a role reaches: the scope itself and every descendant.
function mark(node, scopeId, inside) {
  const hit = inside || node.id === scopeId;
  return {
    ...node,
    hit,
    reachedBy: inside,
    children: node.children.map((c) => mark(c, scopeId, hit)),
  };
}

/* ---------- Page ---------- */

export default function Identity() {
  const [scopeId, setScopeId] = useState('landingzones');
  const [role, setRole] = useState('contributor');
  const [eligible, setEligible] = useState(false);
  const [toGroup, setToGroup] = useState(true);
  const [ticks, setTicks] = useLocalState(`${config.storagePrefix}.identity.breakglass.v1`, {});

  const a = assess({ role, scopeId, eligible, toGroup });
  const r = roles.find((x) => x.id === role);
  const tree = mark(mgTree, scopeId, false);
  const done = breakGlass.filter((b) => ticks[b.id]).length;

  const header = {
    eyebrow: 'Simulator · Identity and access',
    title: 'Access flows down the hierarchy, so assign it low and make it temporary',
    deck: 'Assign a built-in role somewhere in the Contoso hierarchy and see which subscriptions it reaches, then check the emergency access and Conditional Access basics.',
    meta: [
      { dt: 'Scope levels', dd: scopeLevels.join(', ') },
      { dt: 'Reach', dd: `${a.reach.length} of ${totalSubs} subscriptions` },
    ],
  };

  return (
    <PageShell
      header={header}
      verified={VERIFIED_IDENTITY}
      sources={['rbacOverview', 'rbacScope', 'rbacRoles', 'rbacBestPractices', 'elevateAccess', 'pimOverview', 'pimAzureRoles', 'emergencyAccess', 'caOverview', 'cafIdentityLz']}
    >
      <Section
        n={1}
        title="Assign a role and see how far it reaches"
        intro="Azure scopes run from management group to subscription, resource group and resource, and lower levels inherit role permissions from higher ones. Pick where to assign a role."
      >
        <div className="mb-3">
          <Illustrative>Illustrative Contoso hierarchy</Illustrative>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <Select id="id-scope" label="Assign at" value={scopeId} onChange={setScopeId} options={scopes.map((s) => ({ value: s.id, label: s.label }))} />
          <Segmented label="Role" value={role} onChange={setRole} options={roles.map((x) => ({ value: x.id, label: x.name }))} />
          <Toggle label="Make it PIM-eligible" checked={eligible} onChange={setEligible} hint="Activate when needed instead of always on" />
          <Toggle label="Assign to a group" checked={toGroup} onChange={setToGroup} hint="Rather than to one person" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div className="border border-rule bg-surface py-3">
            <ul aria-label="Management group and subscription tree">
              <TreeRow node={tree} depth={0} scopeId={scopeId} reached={a.reach} />
            </ul>
          </div>
          <div className="space-y-3">
            <div className="border border-rule bg-surface p-4">
              <p className="label mb-2">{r.name}, as the roles page lists it</p>
              <ul className="space-y-1 text-[14px] text-ink">
                {r.can.map((c) => (
                  <li key={c}>
                    <Pill tone="good">Can</Pill> <span className="ml-1">{c}</span>
                  </li>
                ))}
                {r.cant.map((c) => (
                  <li key={c}>
                    <Pill tone="bad">Can’t</Pill> <span className="ml-1">{c}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Insight stateKey={`${scopeId}-${role}-${eligible}-${toGroup}`} tone={a.risky ? 'gold' : 'navy'}>
              <p>
                <strong>
                  {r.name} reaches {a.reach.length} of {totalSubs} subscriptions.
                </strong>
              </p>
              {a.points.map((p) => (
                <p key={p.text} className="text-[14px] text-muted">
                  {p.text}
                </p>
              ))}
              {a.risky && <p className="text-[14px] font-medium text-ink">Caution: wide scope with power to grant access or without PIM.</p>}
            </Insight>
          </div>
        </div>
      </Section>

      <Section n={2} title="Emergency access checklist" intro="Emergency access, or break-glass, accounts are for emergencies only, when normal administrative accounts can’t be used. Tick what Contoso has in place.">
        <div className="max-w-[760px] border border-rule bg-surface">
          <p className="border-b border-rule px-4 py-3 text-[13px] text-muted">
            {done} of {breakGlass.length} in place. Your ticks stay in this browser only.
          </p>
          <ul>
            {breakGlass.map((b) => (
              <li key={b.id} className="border-b border-faint last:border-0">
                <label className="flex cursor-pointer items-start gap-3 px-4 py-3">
                  <input type="checkbox" className="mt-1" checked={!!ticks[b.id]} onChange={(e) => setTicks({ ...ticks, [b.id]: e.target.checked })} />
                  <span className="text-[15px] leading-[1.5] text-ink">{b.text}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6 max-w-[760px]">
          <Callout title="Elevating access is a separate, temporary tool">
            A Global Administrator can turn on “Access management for Azure resources” and is then assigned User Access Administrator at root scope. The page says to remove
            that access once the changes are made. By default, Global Administrator has no access to Azure resources.
          </Callout>
        </div>
      </Section>

      <Section n={3} title="Azure roles and Microsoft Entra roles are different" wide={false}>
        <div className="overflow-x-auto border border-rule">
          <table className="w-full min-w-[520px] border-collapse text-left text-[14px]">
            <thead>
              <tr className="bg-callout text-[12px] uppercase tracking-[0.08em] text-subtle">
                <th className="px-4 py-3 font-medium" />
                <th className="px-4 py-3 font-medium">Azure roles</th>
                <th className="px-4 py-3 font-medium">Microsoft Entra roles</th>
              </tr>
            </thead>
            <tbody className="text-muted">
              <tr className="border-t border-rule align-top">
                <th scope="row" className="px-4 py-3 font-medium text-ink">Control</th>
                <td className="px-4 py-3">Permissions to manage Azure resources</td>
                <td className="px-4 py-3">Permissions to manage Microsoft Entra resources</td>
              </tr>
              <tr className="border-t border-rule align-top">
                <th scope="row" className="px-4 py-3 font-medium text-ink">Scope</th>
                <td className="px-4 py-3">Management group, subscription, resource group, resource</td>
                <td className="px-4 py-3">Tenant, administrative unit or an individual object</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-[15px] leading-[1.6] text-muted">
          By default the two don’t span each other. Classic administrator roles (Account Administrator, Service Administrator and Co-Administrator) are fully retired, so use Azure RBAC
          instead.
        </p>
      </Section>

      <Section n={4} title="Conditional Access decides at sign-in" intro="A policy is an if-then statement that brings signals together, makes a decision and enforces it after first-factor authentication.">
        <div className="grid items-stretch gap-px border border-rule bg-rule md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
          <div className="bg-paper p-5">
            <p className="label mb-2">Signals</p>
            <ul className="space-y-1 text-[14px] text-muted">
              {caSignals.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <div className="flex items-center justify-center bg-paper px-4 text-[13px] font-medium text-navy">then</div>
          <div className="bg-paper p-5">
            <p className="label mb-2">Decisions</p>
            <ul className="space-y-2 text-[14px] text-muted">
              {caDecisions.map((d) => (
                <li key={d.name}>
                  <strong className="text-ink">{d.name}.</strong> {d.note}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-4 max-w-[760px] text-[15px] leading-[1.6] text-muted">
          Conditional Access needs Microsoft Entra ID P1 licences, and risk-based policies need Entra ID Protection. Exclude your emergency access accounts from policies that block or
          restrict sign-in.
        </p>
      </Section>

      <Section n={5} title="What the platform team provides" intro="The Cloud Adoption Framework lists these identity recommendations for a landing zone.">
        <ul className="max-w-[760px] list-disc space-y-2 pl-5 text-[16px] leading-[1.6] text-muted">
          {cafRecommendations.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
        <p className="mt-6 max-w-[760px] text-[14px] leading-[1.55] text-subtle">
          Some Privileged Identity Management features, such as PIM for app roles and agent access, are in preview. This page covers eligible and active Azure roles and leaves the
          preview features out; the register holds them on Hold.
        </p>
      </Section>
    </PageShell>
  );
}
