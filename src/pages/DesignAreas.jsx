import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { PageHeader, Section, Insight, Pill, Sources, Segmented } from '../components/ui.jsx';
import { VERIFIED, src } from '../data/sources.js';
import { pageById } from './registry.js';

const areas = [
  {
    name: 'Billing and Microsoft Entra tenant',
    short: 'Billing & tenant',
    group: 'Environment',
    phase: 'Plan',
    decisions: [
      'How you buy Azure: through a CSP partner, a Microsoft Customer Agreement or an Enterprise Agreement',
      'Who is allowed to create subscriptions, and from which billing scope',
      'One Entra tenant for every environment, so identity and policy stay in one place',
    ],
    default: 'Not automated: you set these up before the accelerator runs. It needs the platform subscriptions to exist.',
    explore: ['billing'],
  },
  {
    name: 'Identity and access management',
    short: 'Identity',
    group: 'Environment',
    phase: 'Plan',
    decisions: [
      'Access through Entra groups, never individual role assignments',
      'Privileged Identity Management for Owner-level roles and the groups that grant them',
      'Two monitored emergency-access accounts',
      'Whether domain controllers are needed in an identity subscription',
    ],
    default: 'An identity management group and optional identity subscription, plus policies that harden it.',
    explore: ['pipeline', 'policy-simulator'],
  },
  {
    name: 'Resource organisation',
    short: 'Resource org',
    group: 'Environment',
    phase: 'Plan',
    decisions: [
      'Management-group hierarchy, grouped by the policy subscriptions need',
      'One subscription per workload and environment',
      'Naming convention and the required tag set',
    ],
    default: 'The ALZ hierarchy: an intermediate root with Platform, Landing zones (Internal, Online, Local), Sandbox and Decommissioned.',
    explore: ['policy-simulator', 'naming', 'resource-groups'],
  },
  {
    name: 'Network topology and connectivity',
    short: 'Network',
    group: 'Environment',
    phase: 'Plan',
    decisions: [
      'Hub-and-spoke or Virtual WAN, single or multiple regions',
      'An IP address plan that won’t clash with on-premises',
      'Private DNS for private endpoints, and how on-premises resolves it',
      'Internet egress and ingress through a firewall and web application firewall',
    ],
    default: 'Eleven accelerator scenarios, from single-region SMB to multi-region, with Azure Firewall or a network virtual appliance.',
    explore: ['network-flow'],
  },
  {
    name: 'Security',
    short: 'Security',
    group: 'Compliance',
    phase: 'Platform',
    decisions: [
      'Which Defender for Cloud plans to pay for, by risk',
      'Security benchmark to assess against',
      'SIEM: Microsoft Sentinel in the Defender portal, or an existing tool',
      'Key and secret management',
    ],
    default: 'Defender for Cloud settings and the Microsoft cloud security benchmark assigned at the intermediate root.',
    explore: ['guardrails'],
  },
  {
    name: 'Management',
    short: 'Management',
    group: 'Compliance',
    phase: 'Platform',
    decisions: [
      'Central platform workspace plus one per workload, and the table plan for each log type',
      'Which alerts exist and who receives them',
      'Backup and patching (Azure Update Manager)',
    ],
    default: 'A Log Analytics workspace, Azure Monitor Agent identity and data collection rules; optional AMBA alerts.',
    explore: ['observability'],
  },
  {
    name: 'Governance',
    short: 'Governance',
    group: 'Compliance',
    phase: 'Platform',
    decisions: [
      'Which policies deny, which audit and which fix things automatically',
      'When to switch from audit to enforce, and how exemptions are approved',
      'Budgets, cost allocation and tag rules',
    ],
    default: 'The ALZ policy set, assigned across the hierarchy; enforcement mode is configurable.',
    explore: ['guardrails', 'billing'],
  },
  {
    name: 'Platform automation and DevOps',
    short: 'Automation',
    group: 'Compliance',
    phase: 'Bootstrap',
    decisions: [
      'Terraform or Bicep, and GitHub or Azure DevOps',
      'Repository split: platform, vending and workload repos',
      'Who approves platform changes',
    ],
    default: 'The accelerator bootstrap: repos, pipelines, environments with approvals, plan and apply identities, state storage.',
    explore: ['pipeline', 'state-backends', 'build-options'],
  },
];

const CX = 210;
const CY = 210;
const R1 = 78;
const R2 = 196;

function wedge(i, n) {
  const gap = 0.012;
  const a0 = (i / n) * Math.PI * 2 - Math.PI / 2 + gap;
  const a1 = ((i + 1) / n) * Math.PI * 2 - Math.PI / 2 - gap;
  const p = (r, a) => [CX + r * Math.cos(a), CY + r * Math.sin(a)];
  const [x0, y0] = p(R2, a0);
  const [x1, y1] = p(R2, a1);
  const [x2, y2] = p(R1, a1);
  const [x3, y3] = p(R1, a0);
  const mid = (a0 + a1) / 2;
  const [lx, ly] = p((R1 + R2) / 2, mid);
  return { d: `M${x0} ${y0} A${R2} ${R2} 0 0 1 ${x1} ${y1} L${x2} ${y2} A${R1} ${R1} 0 0 0 ${x3} ${y3} Z`, lx, ly };
}

export default function DesignAreas() {
  const [sel, setSel] = useState(0);
  const [view, setView] = useState('all');
  const a = areas[sel];

  return (
    <article>
      <PageHeader
        eyebrow="Explorer · Design areas"
        title="Eight areas, decided once for everyone"
        deck="Microsoft splits a landing zone into eight design areas. The accelerator gives a tested default for each, so you only decide where you differ."
        meta={[
          { dt: 'Areas', dd: '8' },
          { dt: 'Environment', dd: '4 areas' },
          { dt: 'Compliance', dd: '4 areas' },
          { dt: 'Last verified', dd: VERIFIED },
        ]}
      />

      <Section n={1} title="The map" intro="Select an area to see its decisions and the default the accelerator gives you. Highlight a group to see how Microsoft splits them.">
        <div className="mb-4 max-w-[420px]">
          <Segmented
            label="Highlight"
            value={view}
            onChange={setView}
            options={[
              { value: 'all', label: 'All' },
              { value: 'Environment', label: 'Environment' },
              { value: 'Compliance', label: 'Compliance' },
            ]}
          />
        </div>
        <div className="grid items-start gap-8 lg:grid-cols-[420px_1fr]">
          <svg viewBox="0 0 420 420" role="img" aria-label="Eight design areas around the landing zone" className="mx-auto w-full max-w-[420px]">
            {areas.map((ar, i) => {
              const w = wedge(i, areas.length);
              const on = i === sel;
              const dim = view !== 'all' && ar.group !== view;
              return (
                <g
                  key={ar.name}
                  role="button"
                  tabIndex={0}
                  aria-label={ar.name}
                  aria-pressed={on}
                  onClick={() => setSel(i)}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setSel(i))}
                  style={{ cursor: 'pointer', opacity: dim ? 0.35 : 1, transition: 'opacity .3s' }}
                >
                  <path
                    d={w.d}
                    fill={on ? 'var(--navy)' : ar.group === 'Environment' ? 'var(--surface)' : 'var(--callout)'}
                    stroke={on ? 'var(--navy)' : 'var(--rule)'}
                    strokeWidth="1.25"
                    style={{ transition: 'fill .25s' }}
                  />
                  <text x={w.lx} y={w.ly - 6} textAnchor="middle" fontSize="11" fontFamily="var(--font-mono)" fill={on ? 'var(--on-navy)' : 'var(--navy)'}>
                    {i + 1}
                  </text>
                  <text x={w.lx} y={w.ly + 10} textAnchor="middle" fontSize="11.5" fontWeight="500" fill={on ? 'var(--on-navy)' : 'var(--ink)'}>
                    {ar.short}
                  </text>
                </g>
              );
            })}
            <circle cx={CX} cy={CY} r={R1 - 8} fill="var(--paper)" stroke="var(--rule)" />
            <text x={CX} y={CY - 4} textAnchor="middle" fontFamily="var(--font-display)" fontSize="20" fontWeight="600" fill="var(--ink)">
              Landing
            </text>
            <text x={CX} y={CY + 18} textAnchor="middle" fontFamily="var(--font-display)" fontSize="20" fontWeight="600" fill="var(--ink)">
              zone
            </text>
          </svg>

          <div className="fade-in min-w-0 space-y-5" key={sel}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[12px] text-navy">AREA {sel + 1}</span>
              <Pill tone="navy">{a.group}</Pill>
              <Pill>Decided in: {a.phase}</Pill>
            </div>
            <h3 className="font-display text-[30px] font-semibold leading-[1.1] text-ink">{a.name}</h3>
            <div>
              <p className="label mb-2">Decisions you make</p>
              <ul className="space-y-2">
                {a.decisions.map((d) => (
                  <li key={d} className="flex gap-3 text-[15px] leading-[1.55] text-ink">
                    <span className="mt-[9px] h-[5px] w-[5px] shrink-0 bg-gold" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
            <Insight title="What the accelerator gives you" stateKey={String(sel)}>
              <p>{a.default}</p>
            </Insight>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {a.explore.map((id) => (
                <a key={id} href={`#${id}`} className="inline-flex items-center gap-1 text-[14px] text-navy underline decoration-rule underline-offset-4 hover:decoration-navy">
                  {pageById[id].title} <ArrowRight size={13} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Sources verified={VERIFIED} items={[src.designAreas, src.lzOverview, src.accelerator]} />
    </article>
  );
}
