import { useState } from 'react';
import { ArrowRight, Check, RotateCcw } from 'lucide-react';
import { PageHeader, Section, Insight, Button, Pill, Sources } from '../components/ui.jsx';
import { useLocalState } from '../lib/hooks.js';
import { VERIFIED, src } from '../data/sources.js';
import { pageById } from './registry.js';

const phases = [
  {
    id: 'plan',
    name: 'Plan',
    sub: 'Decide and design',
    team: 'Architects, security, finance',
    what: 'Make the decisions every later phase depends on. Most are cheap now and expensive to change once workloads exist.',
    gate: 'Design signed off by the architecture board',
    criteria: [
      'Platform owner and a small platform team named',
      'Regions and network topology chosen (hub-and-spoke or Virtual WAN)',
      'Infrastructure-as-code language and version control chosen',
      'Naming convention and required tags agreed',
      'Billing account and the route for creating subscriptions confirmed',
    ],
    explore: ['design-areas', 'naming', 'billing', 'build-options'],
  },
  {
    id: 'bootstrap',
    name: 'Bootstrap',
    sub: 'Repos and pipelines',
    team: 'Platform team',
    what: 'Run the ALZ accelerator. It creates the repositories, pipelines, identities and state storage the platform is built from.',
    gate: 'Pipelines produce a clean plan on the main branch',
    criteria: [
      'Platform subscriptions exist and the bootstrap identity has the permissions it needs',
      'Deploy-Accelerator has created the repositories and pipelines',
      'Plan and apply run as separate identities; apply needs approval',
      'Terraform state storage is private, versioned and access-controlled',
    ],
    explore: ['pipeline', 'state-backends'],
  },
  {
    id: 'platform',
    name: 'Platform',
    sub: 'Foundation live',
    team: 'Platform team, security',
    what: 'Deploy the management groups, policies, logging, hub network and identity pieces. Policies start in audit mode so nothing breaks.',
    gate: 'Logs are flowing and audit findings have been reviewed',
    criteria: [
      'Management-group hierarchy deployed',
      'Policies assigned in audit or DoNotEnforce mode',
      'Platform Log Analytics workspace receiving activity and diagnostic logs',
      'Hub network, firewall and private DNS in place',
      'Audit findings triaged into fix, exempt or accept',
    ],
    explore: ['policy-simulator', 'network-flow', 'observability'],
  },
  {
    id: 'first-apps',
    name: 'First apps',
    sub: 'Pilot on paved paths',
    team: 'Platform team plus one or two app teams',
    what: 'Vend landing zones for one or two pilot workloads and publish the first paved paths. Their feedback shapes version two.',
    gate: 'A pilot workload is in production on the paved path',
    criteria: [
      'Subscription vending pipeline live',
      'Pilot workload landing zones vended from a pull request',
      'Workload repo template with OIDC sign-in and approvals published',
      'Pilot workload deployed through the paved path',
      'Pilot team feedback captured and prioritised',
    ],
    explore: ['vending', 'resource-groups', 'paved-paths'],
  },
  {
    id: 'scale',
    name: 'Scale',
    sub: 'Operate and improve',
    team: 'Everyone',
    what: 'Vend at the pace teams need, bring existing subscriptions under the hierarchy, switch policy to enforce and keep the stack current.',
    gate: 'Ongoing: a quarterly review keeps versions and guidance current',
    criteria: [
      'Existing subscriptions moved under the new management groups',
      'Policies switched to enforce, with every exception recorded as an exemption',
      'Budgets and alerts routed to subscription owners',
      'Quarterly review of module versions and the technology register scheduled',
    ],
    explore: ['brownfield', 'guardrails', 'register'],
  },
];

export default function Journey() {
  const [active, setActive] = useState(0);
  const [done, setDone] = useLocalState('lze.journey.v1', {});
  const phase = phases[active];

  const phaseDone = (p) => p.criteria.every((_, i) => done[`${p.id}:${i}`]);
  const doneCount = phases.reduce((n, p) => n + p.criteria.filter((_, i) => done[`${p.id}:${i}`]).length, 0);
  const total = phases.reduce((n, p) => n + p.criteria.length, 0);
  const firstOpen = phases.findIndex((p) => !phaseDone(p));

  const toggle = (key) => setDone((d) => ({ ...d, [key]: !d[key] }));

  return (
    <article>
      <PageHeader
        eyebrow="Stepper · Adoption journey"
        title="Five phases, each closed by a gate"
        deck="Prove the platform before anything depends on it. Tick each gate's criteria; the gate closes when all of them are met."
        meta={[
          { dt: 'Phases', dd: '5' },
          { dt: 'Gate criteria', dd: String(total) },
          { dt: 'Your progress', dd: `${doneCount} of ${total}` },
          { dt: 'Last verified', dd: VERIFIED },
        ]}
      />

      <Section n={1} title="The roadmap" intro="Select a phase to see what happens in it and what closes it. Your ticks are kept in this browser only.">
        {/* Track */}
        <div className="relative overflow-x-auto pb-2">
          <ol className="relative flex min-w-[640px] items-start justify-between">
            <div className="absolute left-[10%] right-[10%] top-[15px] h-[2px] bg-faint" aria-hidden="true" />
            <div
              className="absolute left-[10%] top-[15px] h-[2px] bg-navy transition-all duration-500"
              style={{ width: `${(Math.max(0, firstOpen === -1 ? phases.length - 1 : firstOpen) / (phases.length - 1)) * 80}%` }}
              aria-hidden="true"
            />
            {phases.map((p, i) => {
              const closed = phaseDone(p);
              const isActive = i === active;
              return (
                <li key={p.id} className="relative z-10 flex w-[20%] flex-col items-center text-center">
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-pressed={isActive}
                    className="flex flex-col items-center gap-2"
                  >
                    <span
                      className={`flex h-[32px] w-[32px] rotate-45 items-center justify-center border-2 transition-colors ${
                        closed ? 'border-navy bg-navy' : isActive ? 'border-navy bg-navy-soft' : 'border-rule bg-paper'
                      }`}
                    >
                      <span className={`-rotate-45 font-mono text-[12px] ${closed ? 'text-on-navy' : 'text-navy'}`}>
                        {closed ? <Check size={14} /> : i + 1}
                      </span>
                    </span>
                    <span className={`text-[14px] ${isActive ? 'font-semibold text-ink' : 'text-muted'}`}>{p.name}</span>
                    <span className="text-[12px] text-subtle">{p.sub}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Phase detail */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="fade-in min-w-0 border border-rule bg-surface p-5" key={phase.id}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[12px] text-navy">PHASE {active + 1}</span>
              <Pill tone={phaseDone(phase) ? 'good' : 'neutral'}>{phaseDone(phase) ? 'Gate closed' : 'Gate open'}</Pill>
            </div>
            <h3 className="mt-2 font-display text-[30px] font-semibold leading-[1.1] text-ink">{phase.name}</h3>
            <p className="mt-2 text-[15px] text-muted">{phase.what}</p>
            <p className="label mt-5">Who</p>
            <p className="text-[14px] text-ink">{phase.team}</p>
            <p className="label mt-5">Exit gate</p>
            <p className="text-[15px] font-medium text-ink">{phase.gate}</p>
            <ul className="mt-3 space-y-2">
              {phase.criteria.map((c, i) => {
                const key = `${phase.id}:${i}`;
                return (
                  <li key={key}>
                    <label className="flex cursor-pointer items-start gap-3 text-[14px] text-ink">
                      <input type="checkbox" checked={!!done[key]} onChange={() => toggle(key)} className="mt-1 accent-[var(--navy)]" />
                      <span className={done[key] ? 'text-subtle line-through' : ''}>{c}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button variant="quiet" onClick={() => setActive((a) => Math.max(0, a - 1))} disabled={active === 0}>
                Previous phase
              </Button>
              <Button onClick={() => setActive((a) => Math.min(phases.length - 1, a + 1))} disabled={active === phases.length - 1}>
                Next phase <ArrowRight size={14} />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <Insight stateKey={`${phase.id}-${phaseDone(phase)}`}>
              {phaseDone(phase) ? (
                <p>
                  The <strong>{phase.name}</strong> gate is closed. Everything after it can rely on what this phase produced.
                </p>
              ) : active > firstOpen && firstOpen !== -1 ? (
                <p>
                  You're looking ahead: <strong>{phases[firstOpen].name}</strong> still has open criteria. Starting this phase
                  early means building on something that hasn't been proven yet.
                </p>
              ) : (
                <p>
                  {phase.criteria.filter((_, i) => !done[`${phase.id}:${i}`]).length} criteria left before the{' '}
                  <strong>{phase.name}</strong> gate closes.
                </p>
              )}
            </Insight>
            <div className="border border-rule p-4">
              <p className="label mb-2">Explore for this phase</p>
              <ul className="space-y-1.5">
                {phase.explore.map((id) => (
                  <li key={id}>
                    <a href={`#${id}`} className="inline-flex items-center gap-1.5 text-[14px] text-navy underline decoration-rule underline-offset-4 hover:decoration-navy">
                      {pageById[id].title} <ArrowRight size={13} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <Button variant="quiet" onClick={() => setDone({})}>
              <RotateCcw size={14} /> Clear my ticks
            </Button>
          </div>
        </div>
      </Section>

      <Sources verified={VERIFIED} items={[src.cafOverview, src.accelerator, src.bootstrap]} />
    </article>
  );
}
