import { useState } from 'react';
import { Section, Insight, Segmented, Toggle, Pill, Callout, Illustrative } from '../components/ui.jsx';
import PageShell from '../components/PageShell.jsx';
import { regions, failures, placements, outcome, stateInfo, recommendations, VERIFIED_RESILIENCE } from '../content/resilience.js';

/* ---------- Diagram: the two regions, the zones inside them and what fails ---------- */

function Diagram({ placement, failure, backup, immutable, state }) {
  const zoneW = 70;
  const regionOf = (x, r, label, failed) => (
    <g>
      <rect x={x} y={30} width={r.zones * (zoneW + 8) + 8} height={150} fill="var(--callout)" stroke={failed ? 'var(--bad)' : 'var(--rule)'} strokeWidth={failed ? 2 : 1.25} />
      <text x={x + 12} y={52} fontSize="13" fontWeight="600" fill="var(--ink)">
        {label}
        {failed ? ' · outage' : ''}
      </text>
      <text x={x + 12} y={168} fontSize="11" fill="var(--subtle)">
        {r.zones} availability zones
      </text>
    </g>
  );
  const regionFailed = failure === 'region';
  const zoneCell = (x, i, hasWorkload, failed) => (
    <g key={i}>
      <rect x={x} y={64} width={zoneW} height={84} fill="var(--surface)" stroke={failed ? 'var(--bad)' : 'var(--faint)'} strokeWidth={failed ? 2 : 1} strokeDasharray={failed ? '4 3' : undefined} />
      <text x={x + zoneW / 2} y={80} fontSize="11" textAnchor="middle" fill="var(--subtle)">
        Zone {i + 1}
      </text>
      {hasWorkload && <rect x={x + 14} y={94} width={zoneW - 28} height={26} fill="var(--navy)" />}
      {hasWorkload && (
        <text x={x + zoneW / 2} y={111} fontSize="11" textAnchor="middle" fill="var(--on-navy)">
          App
        </text>
      )}
      {failed && (
        <text x={x + zoneW / 2} y={140} fontSize="11" fontWeight="600" textAnchor="middle" fill="var(--bad)">
          down
        </text>
      )}
    </g>
  );
  const p = regions.primary;
  const s = regions.secondary;
  const px = 20;
  const sx = px + p.zones * (zoneW + 8) + 8 + 28;
  // One zone: the app sits in zone 1. Zone-redundant: spread over zones 1 to 3.
  const hasApp = (i) => (placement === 'zonal' ? i === 0 : i < 3);
  const standby = placement === 'multi';
  const dataHit = failure === 'data';
  return (
    <svg viewBox="0 0 640 300" className="block w-full min-w-[600px]" role="img" aria-label={`East US 2 and Central US with the app placed ${placement === 'zonal' ? 'in one zone' : 'across zones'}${standby ? ' and in a second region' : ''}`}>
      {regionOf(px, p, p.name, regionFailed)}
      {Array.from({ length: p.zones }, (_, i) => zoneCell(px + 8 + i * (zoneW + 8), i, hasApp(i), failure === 'zone' && i === 0 || regionFailed))}
      {regionOf(sx, s, s.name, false)}
      {Array.from({ length: s.zones }, (_, i) => zoneCell(sx + 8 + i * (zoneW + 8), i, standby && i === 0, false))}
      {standby && (
        <text x={sx + 12} y={192} fontSize="11" fill="var(--muted)">
          Standby copy
        </text>
      )}

      <g>
        <rect x={px} y={210} width={150} height={44} fill="var(--surface)" stroke={dataHit ? 'var(--bad)' : 'var(--rule)'} strokeWidth={dataHit ? 2 : 1.25} />
        <text x={px + 12} y={229} fontSize="13" fontWeight="600" fill="var(--ink)">
          Live data
        </text>
        <text x={px + 12} y={245} fontSize="11" fill={dataHit ? 'var(--bad)' : 'var(--subtle)'}>
          {dataHit ? 'deleted or encrypted' : 'in East US 2'}
        </text>
      </g>
      {backup && (
        <g>
          <path d={`M${px + 150} 232H${px + 190}`} stroke="var(--rule)" strokeWidth="1.25" fill="none" />
          <rect x={px + 190} y={210} width={200} height={44} fill="var(--surface)" stroke={failure === 'data' && state === 'restore' ? 'var(--good)' : 'var(--rule)'} strokeWidth="1.25" />
          <text x={px + 202} y={229} fontSize="13" fontWeight="600" fill="var(--ink)">
            Backup vault
          </text>
          <text x={px + 202} y={245} fontSize="11" fill="var(--subtle)">
            {immutable ? 'immutable, locked' : 'soft delete on'}
          </text>
        </g>
      )}
      {!backup && (
        <text x={px + 170} y={236} fontSize="12" fill="var(--subtle)">
          No backup vault
        </text>
      )}
    </svg>
  );
}

/* ---------- Page ---------- */

export default function Resilience() {
  const [placement, setPlacement] = useState('zonal');
  const [failure, setFailure] = useState('zone');
  const [backup, setBackup] = useState(false);
  const [immutable, setImmutable] = useState(false);
  const eff = backup && immutable;
  const o = outcome({ placement, failure, backup, immutable: eff });
  const info = stateInfo[o.state];

  const header = {
    eyebrow: 'Simulator · Resilience and recovery',
    title: 'Zones, regions and backups protect against different things',
    deck: 'Place a workload, break something, and see what survives. A zone, a region and a deleted database each need a different answer.',
    meta: [
      { dt: 'Primary region', dd: `${regions.primary.name}, ${regions.primary.zones} zones` },
      { dt: 'Secondary', dd: `${regions.secondary.name}, ${regions.secondary.zones} zones` },
    ],
  };

  return (
    <PageShell header={header} sources={['azZones', 'regionsPaired', 'regionsList', 'cafBcdr', 'backupOverview', 'siteRecovery', 'immutableVault', 'wafTargets']} verified={VERIFIED_RESILIENCE}>
      <Section n={1} title="Break something" intro="Contoso Bank keeps workloads in East US 2 and Central US, which Microsoft lists as a region pair. Choose a design, then a failure.">
        <div className="mb-3">
          <Illustrative>Illustrative workload</Illustrative>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <Segmented label="Where the workload runs" value={placement} onChange={setPlacement} options={placements.map((x) => ({ value: x.id, label: x.label }))} />
          <Segmented label="What goes wrong" value={failure} onChange={setFailure} options={failures.map((x) => ({ value: x.id, label: x.label }))} />
          <Toggle label="Back up the data" checked={backup} onChange={setBackup} hint="Azure Backup recovery points in a vault" />
          <Toggle label="Lock an immutable vault" checked={eff} onChange={setImmutable} disabled={!backup} hint={backup ? 'Blocks operations that could lose recovery points' : 'Needs a backup vault first'} />
        </div>

        <div className="mt-6 overflow-x-auto border border-rule bg-surface p-5">
          <Diagram placement={placement} failure={failure} backup={backup} immutable={eff} state={o.state} />
        </div>

        <div className="mt-6">
          <Insight stateKey={`${placement}-${failure}-${backup}-${eff}`} tone={info.tone === 'bad' ? 'bad' : info.tone === 'good' ? 'good' : 'navy'}>
            <p className="flex flex-wrap items-center gap-2">
              <Pill tone={info.tone}>{info.word}</Pill>
              <strong>{o.headline}</strong>
            </p>
            <p>{o.why}</p>
          </Insight>
        </div>
      </Section>

      <Section n={2} title="What each design survives" intro="The same rules, laid out for every combination. Read across to see what a design buys you.">
        <div className="overflow-x-auto border border-rule">
          <table className="w-full min-w-[640px] border-collapse text-left text-[14px]">
            <thead>
              <tr className="bg-callout text-[12px] uppercase tracking-[0.08em] text-subtle">
                <th className="px-4 py-3 font-medium">Design</th>
                {failures.map((f) => (
                  <th key={f.id} className="px-4 py-3 font-medium">
                    {f.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {placements.map((pl) => (
                <tr key={pl.id} className="border-t border-rule align-top">
                  <th scope="row" className="px-4 py-3 font-medium text-ink">
                    {pl.label}
                  </th>
                  {failures.map((f) => {
                    const r = outcome({ placement: pl.id, failure: f.id, backup, immutable: eff });
                    return (
                      <td key={f.id} className="px-4 py-3">
                        <Pill tone={stateInfo[r.state].tone}>{stateInfo[r.state].word}</Pill>
                        <p className="mt-1 text-[13px] leading-[1.5] text-muted">{r.headline}</p>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[13px] text-subtle">The data column follows the two backup switches above.</p>
      </Section>

      <Section n={3} title="Set recovery targets before you choose" wide={false}>
        <div className="space-y-4 text-[16px] leading-[1.65] text-muted">
          <p>
            <strong className="text-ink">RTO</strong> is the maximum acceptable time an application can be unavailable after an incident. <strong className="text-ink">RPO</strong> is the
            maximum acceptable duration of data loss. Each workload needs both, and the business sets them.
          </p>
          <p>Microsoft publishes RTO and RPO guarantees only for some products, such as Azure SQL Database, so this page shows no numbers. Ask for them per workload and test that the design meets them.</p>
        </div>
        <div className="mt-6">
          <Callout title="Region pairs are not a recovery plan">
            Microsoft says a design can be highly resilient with paired regions, nonpaired regions or a mix. Putting resources in a pair does not by itself give automatic
            high availability, disaster recovery or failover, so write your own plan either way.
          </Callout>
        </div>
      </Section>

      <Section n={4} title="What the platform team provides" intro="The Cloud Adoption Framework lists these recommendations for a landing zone.">
        <ul className="max-w-[760px] list-disc space-y-2 pl-5 text-[16px] leading-[1.6] text-muted">
          {recommendations.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
        <div className="mt-6 max-w-[760px]">
          <p className="text-[15px] leading-[1.6] text-muted">
            Azure Backup is for data protection: backup and restore. Azure Site Recovery is for replication, failover and failback. Site Recovery for Extended Zones is in
            preview, so the register holds it on Hold.
          </p>
        </div>
      </Section>
    </PageShell>
  );
}
