import { useMemo, useState } from 'react';
import { Section, Insight, Select, Toggle, Segmented, TextInput, Pill, Callout, Illustrative } from '../components/ui.jsx';
import PageShell from '../components/PageShell.jsx';
import { parseCidr, formatCidr, formatIp, overlaps, allocate, classify, usableInSubnet, RESERVED_PER_SUBNET } from '../lib/cidr.js';
import {
  VERIFIED_IPDNS,
  sizes,
  REGION_BLOCK,
  initialBlocks,
  ON_PREM_DEFAULT,
  overlapFacts,
  resolve,
  ipRecommendations,
  dnsRecommendations,
} from '../content/ipdns.js';

const sizeOf = (id) => sizes.find((s) => s.id === id).size;
const ramp = { hub: 'var(--seq-1)', spoke: 'var(--seq-2)' };

/* ---------- Allocation bar: the regional block, split into the planned networks ---------- */

function AllocationBar({ supernet, placed, onPrem, failed }) {
  const W = 960;
  const x = (addr) => ((addr - supernet.start) / supernet.size) * W;
  const hit = (b) => onPrem && overlaps(onPrem, b);
  const clip = onPrem && overlaps(onPrem, supernet);
  return (
    <svg viewBox={`0 0 ${W + 40} 150`} className="block w-full min-w-[640px]" role="img" aria-label={`The ${REGION_BLOCK} block split into ${placed.length} planned networks`}>
      <rect x={20} y={30} width={W} height={56} fill="var(--callout)" stroke="var(--rule)" strokeWidth="1.25" />
      {placed.map((b) => {
        const w = Math.max(2, x(b.end + 1) - x(b.start));
        const bad = hit(b);
        return (
          <g key={b.id}>
            <rect x={20 + x(b.start)} y={30} width={w} height={56} fill={ramp[b.role]} stroke={bad ? 'var(--bad)' : 'var(--paper)'} strokeWidth={bad ? 3 : 1} />
            {w > 60 && (
              <text x={20 + x(b.start) + 6} y={62} fontSize="11" fill="var(--on-navy)">
                {b.role === 'hub' ? 'Hub' : b.name.split(' ')[0].replace('-prod', '').replace('platform-', '').replace('lab-sandbox-01', 'lab')}
              </text>
            )}
          </g>
        );
      })}
      {clip && (
        <g>
          <rect x={20 + x(Math.max(onPrem.start, supernet.start))} y={96} width={Math.max(3, x(Math.min(onPrem.end, supernet.end) + 1) - x(Math.max(onPrem.start, supernet.start)))} height={10} fill="var(--bad)" />
          <text x={20 + x(Math.max(onPrem.start, supernet.start))} y={124} fontSize="11" fill="var(--bad)">
            On-premises range inside this block: {formatCidr(onPrem.start, onPrem.size)}
          </text>
        </g>
      )}
      <text x={20} y={20} fontSize="11" fill="var(--subtle)">
        {formatIp(supernet.start)}
      </text>
      <text x={20 + W} y={20} fontSize="11" textAnchor="end" fill="var(--subtle)">
        {formatIp(supernet.end)}
      </text>
      {failed.length > 0 && (
        <text x={20} y={144} fontSize="11" fill="var(--bad)">
          Did not fit: {failed.map((f) => f.name).join(', ')}
        </text>
      )}
    </svg>
  );
}

/* ---------- Page ---------- */

export default function IpDns() {
  const supernet = useMemo(() => parseCidr(REGION_BLOCK), []);
  const [blocks, setBlocks] = useState(initialBlocks);
  const [onPremText, setOnPremText] = useState(ON_PREM_DEFAULT);
  const [client, setClient] = useState('azure');
  const [linkedSpoke, setLinkedSpoke] = useState(false);
  const [linkedHub, setLinkedHub] = useState(true);
  const [forwarder, setForwarder] = useState(false);

  const { placed, failed } = useMemo(
    () => allocate(supernet, blocks.map((b) => ({ ...b, size: sizeOf(b.size) }))),
    [supernet, blocks],
  );
  const onPrem = parseCidr(onPremText);
  const kind = onPrem ? classify(onPrem) : null;
  const clashes = onPrem ? placed.filter((b) => overlaps(onPrem, b)) : [];
  const dns = resolve({ client, linkedSpoke, linkedHub, forwarder });

  const header = {
    eyebrow: 'Simulator · IP plan and private DNS',
    title: 'Plan the addresses before you peer, and link the DNS before you connect',
    deck: 'Lay out a regional address block for the hub and spokes, check an on-premises range for overlap, then follow a private endpoint name from a spoke and from the data centre.',
    meta: [
      { dt: 'Regional block', dd: REGION_BLOCK },
      { dt: 'Planned networks', dd: `${placed.length} of ${blocks.length}` },
    ],
  };

  const setSize = (id, size) => setBlocks((bs) => bs.map((b) => (b.id === id ? { ...b, size } : b)));

  return (
    <PageShell
      header={header}
      verified={VERIFIED_IPDNS}
      sources={['vnetFaq', 'vnetConcepts', 'vnetPeering', 'cafIp', 'peDns', 'peOverview', 'privateDns', 'dnsResolver', 'peHubSpoke', 'cafDns']}
    >
      <Section
        n={1}
        title="Lay out the regional block"
        intro="Give each network a size from the Cloud Adoption Framework’s examples (Small /24, Medium /22, Large /20) and see them placed in one block. Each network starts on a boundary that is a multiple of its own size."
      >
        <div className="mb-3">
          <Illustrative>Illustrative Contoso address plan</Illustrative>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {blocks.map((b) => (
            <Select
              key={b.id}
              id={`ip-${b.id}`}
              label={b.name}
              value={b.size}
              onChange={(v) => setSize(b.id, v)}
              options={sizes.map((s) => ({ value: s.id, label: s.label }))}
            />
          ))}
        </div>
        <div className="mt-6 overflow-x-auto border border-rule bg-surface p-5">
          <AllocationBar supernet={supernet} placed={placed} onPrem={onPrem} failed={failed} />
        </div>
        <ul className="mt-4 grid gap-x-8 gap-y-1 text-[13px] sm:grid-cols-2">
          {placed.map((b) => (
            <li key={b.id} className="flex flex-wrap justify-between gap-2 border-b border-faint py-1">
              <span className="text-ink">{b.name}</span>
              <span className="font-mono text-muted">
                {formatCidr(b.start, b.size)} · {b.size.toLocaleString()} addresses · {usableInSubnet(b.size).toLocaleString()} in one subnet
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3 max-w-[760px] text-[13px] leading-[1.5] text-subtle">
          “In one subnet” counts the {RESERVED_PER_SUBNET} addresses Azure reserves in every subnet: the first four and the last one. A network split into several subnets loses {RESERVED_PER_SUBNET} per subnet.
        </p>
      </Section>

      <Section n={2} title="Check an on-premises range for overlap" intro="Type a range your data centre already uses. Contoso’s starts out colliding on purpose.">
        <div className="max-w-[420px]">
          <TextInput id="ip-onprem" label="On-premises range (CIDR)" value={onPremText} onChange={setOnPremText} mono placeholder="10.20.0.0/20" hint="For example 192.168.0.0/16" />
        </div>
        <div className="mt-6">
          {!onPrem ? (
            <Insight tone="gold" stateKey="bad">
              <p>
                <strong>That is not a valid range.</strong> Write it as four numbers, a slash and a length, such as 10.30.0.0/16.
              </p>
            </Insight>
          ) : (
            <Insight tone={clashes.length || kind.kind === 'blocked' ? 'bad' : 'good'} stateKey={`${onPremText}-${clashes.length}-${blocks.map((b) => b.size).join('')}`}>
              <p className="flex flex-wrap items-center gap-2">
                <Pill tone={clashes.length || kind.kind === 'blocked' ? 'bad' : 'good'}>{kind.kind === 'blocked' ? 'Blocked range' : clashes.length ? 'Overlaps' : 'No overlap'}</Pill>
                <strong>
                  {formatCidr(onPrem.start, onPrem.size)}
                  {onPrem.aligned ? '' : ' (rounded to the start of its block)'}
                </strong>
              </p>
              {kind.kind === 'blocked' && <p>Azure doesn’t let you add this range ({kind.why}).</p>}
              {kind.kind === 'other' && <p>This is not in the private ranges Azure names. The FAQ says other private ranges might work but have undesirable side effects, and the CAF says not to use public addresses.</p>}
              {clashes.length > 0 ? (
                <>
                  <p>It overlaps {clashes.map((c) => c.name).join(', ')}. Pick other ranges now, because changing them after workloads land is harder.</p>
                  <ul className="list-disc space-y-1 pl-5 text-[14px] text-muted">
                    {overlapFacts.map((f) => (
                      <li key={f.text}>{f.text}</li>
                    ))}
                  </ul>
                </>
              ) : (
                kind.kind !== 'blocked' && <p>No planned network overlaps this range, so peering and a gateway connection to it can work.</p>
              )}
            </Insight>
          )}
        </div>
      </Section>

      <Section n={3} title="Follow a private endpoint name" intro="A private endpoint is a network interface with a private IP address in your network. Its name must resolve to that address, so DNS has to be set up on purpose.">
        <div className="grid gap-5 md:grid-cols-2">
          <Segmented
            label="Who is asking"
            value={client}
            onChange={setClient}
            options={[
              { value: 'azure', label: 'A VM in a spoke' },
              { value: 'onprem', label: 'A server on-premises' },
            ]}
          />
          <div className="space-y-3">
            <Toggle label="Private zone linked to the spoke network" checked={linkedSpoke} onChange={setLinkedSpoke} hint="Matters for Azure clients" />
            <Toggle label="Private zone linked to the hub network" checked={linkedHub} onChange={setLinkedHub} hint="The hub holds the DNS Private Resolver" />
            <Toggle label="On-premises forwarder to the inbound endpoint" checked={forwarder} onChange={setForwarder} hint="Matters for on-premises clients" />
          </div>
        </div>
        <ol className="mt-6 max-w-[760px] space-y-2 border border-rule bg-surface p-5 text-[15px] leading-[1.55] text-ink">
          {dns.steps.map((s, i) => (
            <li key={s} className="flex gap-3">
              <span className="font-mono text-[12px] text-navy">{i + 1}</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
        <div className="mt-4">
          <Insight tone={dns.ok ? 'good' : 'bad'} stateKey={`${client}-${linkedSpoke}-${linkedHub}-${forwarder}`}>
            <p className="flex flex-wrap items-center gap-2">
              <Pill tone={dns.ok ? 'good' : 'bad'}>{dns.ok ? 'Works' : 'Fails'}</Pill>
              <strong>{dns.headline}</strong>
            </p>
            <p className="text-[14px] text-muted">
              The DNS zone is named like privatelink.blob.core.windows.net for blob storage. Azure adds a CNAME in public DNS that points to that name, and a private DNS zone linked to your network answers it.
            </p>
          </Insight>
        </div>
      </Section>

      <Section n={4} title="Rules of thumb from the Cloud Adoption Framework" wide={false}>
        <p className="label mb-2">Addresses</p>
        <ul className="list-disc space-y-2 pl-5 text-[16px] leading-[1.6] text-muted">
          {ipRecommendations.map((r) => (
            <li key={r.text}>{r.text}</li>
          ))}
        </ul>
        <p className="label mb-2 mt-8">DNS</p>
        <ul className="list-disc space-y-2 pl-5 text-[16px] leading-[1.6] text-muted">
          {dnsRecommendations.map((r) => (
            <li key={r.text}>{r.text}</li>
          ))}
        </ul>
        <div className="mt-8">
          <Callout title="Still in preview">
            Virtual network TAP, peering over IPv6 only and disabling peering route propagation are marked preview on the Microsoft pages. This page doesn’t use them, and the register
            holds them on Hold.
          </Callout>
        </div>
      </Section>
    </PageShell>
  );
}
