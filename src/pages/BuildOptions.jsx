import { useState } from 'react';
import { Play } from 'lucide-react';
import { Section, Insight, Segmented, Button, Pill, Callout } from '../components/ui.jsx';
import PageShell from '../components/PageShell.jsx';
import { useProgress } from '../lib/hooks.js';
import { DecisionSection } from '../archetypes/Decision.jsx';
import decision from '../content/build-options.js';

const stack = [
  { id: 'you', name: 'Your configuration', who: 'You', items: ['platform-landing-zone.tfvars', 'inputs.yaml', 'lib/ overrides (archetypes, policy assignments)'], update: 'You change inputs in a pull request. The plan shows exactly what moves.' },
  { id: 'starter', name: 'Accelerator starter module', who: 'Microsoft (ALZ team)', items: ['platform_landing_zone starter', 'bootstrap modules for GitHub, Azure DevOps or local'], update: 'New accelerator releases arrive as a new starter version. Re-run the accelerator or merge the change into your repo.' },
  { id: 'ptn', name: 'AVM pattern modules', who: 'Microsoft (AVM owners)', items: ['avm-ptn-alz (management groups, policy, roles)', 'avm-ptn-alz-management', 'connectivity: hub-and-spoke or Virtual WAN', 'avm-ptn-alz-sub-vending'], update: 'Semantic versions on the Terraform Registry. Pin them; read release notes before bumping.' },
  { id: 'res', name: 'AVM resource modules', who: 'Microsoft (AVM owners)', items: ['avm-res-network-virtualnetwork', 'avm-res-network-azurefirewall', 'avm-res-operationalinsights-workspace', '…one per resource type'], update: 'Pulled in by the pattern modules. You rarely touch them directly.' },
  { id: 'prov', name: 'Providers', who: 'HashiCorp and Microsoft', items: ['AzureRM ~> 4.x (starter, management, connectivity)', 'AzAPI (avm-ptn-alz, vending)', 'alz (reads the library)'], update: 'Constraints are set by the modules above. A provider major version only works once every module allows it.' },
  { id: 'lib', name: 'ALZ library', who: 'Microsoft (ALZ team)', items: ['Policy definitions and initiatives', 'Archetypes per management group', 'Release 2026.10.0'], update: 'Dated releases. The alz provider reads the version you pin, so new policies arrive only when you choose.' },
];

export default function BuildOptions() {
  const [layer, setLayer] = useState('ptn');
  const [trace, setTrace] = useState(0);
  const [provider, setProvider] = useState('4');
  const t = useProgress(`trace-${trace}`, 3200);

  const tracing = trace > 0 && t < 1;
  const traceIndex = tracing ? stack.length - 1 - Math.min(stack.length - 1, Math.floor(t * stack.length)) : -1;
  const L = stack.find((s) => s.id === layer);

  const header = {
    eyebrow: "Explorer · Build options",
    title: "Four ways to build it, one that usually wins",
    deck: "Answer four questions about your organisation and watch the options re-rank. Then look inside the stack the accelerator gives you.",
    meta: [
      { dt: 'Options', dd: '4' },
      { dt: 'Questions', dd: '4' },
      { dt: 'Default pick', dd: 'Accelerator' },
    ],
  };

  return (
    <PageShell header={header} sources={['accelerator', 'moduleIndex', 'avm', 'avmPattern', 'alzLibrary', 'azurermV5']}>

      <DecisionSection data={decision} />

      <Section n={2} title="Inside the accelerator’s stack" intro="Select a layer to see who maintains it and how updates reach you. Trace an update to watch a new policy travel up from the library.">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="space-y-1.5">
            {stack.map((s, i) => {
              const lit = traceIndex !== -1 && i >= traceIndex;
              return (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={layer === s.id}
                  onClick={() => setLayer(s.id)}
                  className={`flex w-full items-center justify-between gap-3 border px-4 py-3 text-left transition-colors duration-300 ${
                    layer === s.id ? 'border-navy bg-navy text-on-navy' : lit ? 'border-gold bg-gold-soft text-ink' : 'border-rule bg-surface text-ink hover:border-subtle'
                  }`}
                >
                  <span className="text-[14.5px] font-medium">{s.name}</span>
                  <span className={`text-[12px] ${layer === s.id ? 'text-on-navy' : 'text-subtle'}`}>{s.who}</span>
                </button>
              );
            })}
            <div className="pt-2">
              <Button variant="secondary" onClick={() => setTrace((n) => n + 1)}>
                <Play size={14} /> Trace an update
              </Button>
            </div>
          </div>
          <div className="fade-in min-w-0 border border-rule bg-paper p-5" key={layer}>
            <p className="label">{L.who}</p>
            <h3 className="mt-1 font-display text-[28px] font-semibold leading-[1.1] text-ink">{L.name}</h3>
            <ul className="mt-3 space-y-1.5">
              {L.items.map((it) => (
                <li key={it} className="flex gap-2.5 font-mono text-[12.5px] text-ink">
                  <span className="mt-[7px] h-[4px] w-[4px] shrink-0 bg-gold" />
                  {it}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[14.5px] leading-[1.6] text-muted">{L.update}</p>
          </div>
        </div>
        {trace > 0 && (
          <div className="mt-4">
            <Insight title="An update, start to finish" stateKey={String(tracing)}>
              <p>
                Microsoft publishes a new ALZ library release. Nothing changes in your estate until you bump the version you pin; the alz
                provider reads it, the pattern module turns it into policy objects, and your pull request shows the plan for review. That
                pin is why upgrades are a decision, not a surprise.
              </p>
            </Insight>
          </div>
        )}
      </Section>

      <Section n={3} title="Provider versions" intro="A provider’s new major version works only when every module in the stack allows it. Try it.">
        <div className="max-w-[360px]">
          <Segmented
            label="AzureRM version you pin"
            value={provider}
            onChange={setProvider}
            options={[
              { value: '4', label: '~> 4.0' },
              { value: '5', label: '~> 5.0' },
            ]}
          />
        </div>
        <div className="mt-4 border border-rule bg-callout">
          <div className="flex items-center justify-between border-b border-faint px-3 py-1.5">
            <span className="label">terraform init · illustrative output</span>
            <Pill tone={provider === '4' ? 'good' : 'bad'}>{provider === '4' ? 'Succeeds' : 'Fails'}</Pill>
          </div>
          <pre className="fade-in overflow-x-auto px-3 py-3 font-mono text-[12.5px] leading-[1.6] text-ink" key={provider}>
            {provider === '4'
              ? `Initializing provider plugins...
- Finding hashicorp/azurerm versions matching "~> 4.0"...
- Installing hashicorp/azurerm v4.x...
- Installing azure/azapi...
- Installing azure/alz...

Terraform has been successfully initialized!`
              : `Initializing provider plugins...
- Finding hashicorp/azurerm versions matching "~> 5.0, ~> 4.0"...

Error: Failed to query available provider packages

Could not retrieve the list of available versions for provider
hashicorp/azurerm: no available releases match the given constraints
~> 5.0, ~> 4.0`}
          </pre>
        </div>
        <div className="mt-4">
          <Insight tone={provider === '4' ? 'navy' : 'bad'} stateKey={provider}>
            <p>
              {provider === '4'
                ? 'The starter, management and connectivity modules constrain AzureRM to 4.x; avm-ptn-alz and the vending module use only AzAPI. Stay on 4.x until their release notes say otherwise.'
                : 'AzureRM 5.0 has been generally available since July 2026, but the starter, management and connectivity modules still constrain it to 4.x, so Terraform can’t find a version that satisfies both. Wait for the modules to move, then upgrade in one pull request.'}
            </p>
          </Insight>
        </div>
        <div className="mt-5">
          <Callout tone="gold" title="Check before you rely on this">
            Module constraints change with each release. Look at the required_providers block in the module versions you pin; the
            Technology register page records when this was last checked.
          </Callout>
        </div>
      </Section>
    </PageShell>
  );
}
