import { describe, expect, it } from 'vitest';
import { parseCidr, formatCidr, formatIp, overlaps, allocate, classify, usableInSubnet } from '../lib/cidr.js';
import { resolve, ipRecommendations, dnsRecommendations, overlapFacts, sizes, initialBlocks, REGION_BLOCK } from '../content/ipdns.js';
import { src } from '../content/sources.js';

describe('cidr helpers', () => {
  it('parses blocks and rejects bad input', () => {
    const b = parseCidr('10.20.0.0/16');
    expect(b.size).toBe(65536);
    expect(formatIp(b.end)).toBe('10.20.255.255');
    expect(parseCidr('10.20.0.0/33')).toBeNull();
    expect(parseCidr('300.1.1.1/24')).toBeNull();
    expect(parseCidr('hello')).toBeNull();
    expect(parseCidr('10.20.0.5/24').aligned).toBe(false);
  });

  it('finds overlap and non-overlap', () => {
    expect(overlaps(parseCidr('10.20.0.0/20'), parseCidr('10.20.4.0/22'))).toBe(true);
    expect(overlaps(parseCidr('10.20.0.0/24'), parseCidr('10.20.1.0/24'))).toBe(false);
  });

  it('allocates largest first on aligned boundaries and reports what does not fit', () => {
    const sup = parseCidr('10.0.0.0/21');
    const { placed, failed } = allocate(sup, [
      { id: 'a', size: 256 },
      { id: 'b', size: 1024 },
      { id: 'c', size: 256 },
    ]);
    expect(placed.map((p) => p.id)).toEqual(['b', 'a', 'c']);
    expect(placed.every((p) => p.start % p.size === 0)).toBe(true);
    expect(failed).toHaveLength(0);
    expect(allocate(parseCidr('10.0.0.0/22'), [{ id: 'x', size: 1024 }, { id: 'y', size: 256 }]).failed.map((f) => f.id)).toEqual(['y']);
    expect(formatCidr(placed[0].start, placed[0].size)).toBe('10.0.0.0/22');
  });

  it('classifies blocked, private and other ranges as the FAQ says', () => {
    expect(classify(parseCidr('169.254.1.0/24')).kind).toBe('blocked');
    expect(classify(parseCidr('168.63.129.16/32')).kind).toBe('blocked');
    expect(classify(parseCidr('10.1.0.0/16')).kind).toBe('private');
    expect(classify(parseCidr('100.64.0.0/16')).kind).toBe('private');
    expect(classify(parseCidr('8.8.8.0/24')).kind).toBe('other');
  });

  it('Azure keeps five addresses in every subnet', () => {
    expect(usableInSubnet(256)).toBe(251);
    expect(usableInSubnet(8)).toBe(3);
  });

  it('the default plan fits in the regional block', () => {
    const reqs = initialBlocks.map((b) => ({ id: b.id, size: sizes.find((s) => s.id === b.size).size }));
    expect(allocate(parseCidr(REGION_BLOCK), reqs).failed).toHaveLength(0);
  });
});

describe('private endpoint DNS rules', () => {
  it('an Azure client needs the zone linked to its network', () => {
    expect(resolve({ client: 'azure', linkedSpoke: true }).ok).toBe(true);
    expect(resolve({ client: 'azure', linkedSpoke: false }).ok).toBe(false);
  });

  it('an on-premises client needs the forwarder and the hub link', () => {
    expect(resolve({ client: 'onprem', forwarder: true, linkedHub: true }).ok).toBe(true);
    expect(resolve({ client: 'onprem', forwarder: true, linkedHub: false }).ok).toBe(false);
    expect(resolve({ client: 'onprem', forwarder: false, linkedHub: true }).ok).toBe(false);
  });

  it('every rule cites sources that exist', () => {
    const all = [];
    for (const client of ['azure', 'onprem']) {
      for (const a of [false, true]) for (const b of [false, true]) for (const c of [false, true]) all.push(resolve({ client, linkedSpoke: a, linkedHub: b, forwarder: c }));
    }
    for (const r of all) for (const k of r.src) expect(src[k], k).toBeTruthy();
    for (const r of [...ipRecommendations, ...dnsRecommendations, ...overlapFacts]) for (const k of r.src) expect(src[k], k).toBeTruthy();
  });
});
