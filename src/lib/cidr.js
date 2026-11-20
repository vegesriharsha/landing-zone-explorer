// Small IPv4 CIDR helpers for the IP planner. Addresses are unsigned 32-bit numbers.

/** Parse "a.b.c.d/n" into { start, end, size, prefix } or null when it is not a valid block. */
export function parseCidr(text) {
  const m = /^\s*(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})\s*$/.exec(text ?? '');
  if (!m) return null;
  const octets = m.slice(1, 5).map(Number);
  const prefix = Number(m[5]);
  if (octets.some((o) => o > 255) || prefix > 32) return null;
  const addr = ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0;
  const size = 2 ** (32 - prefix);
  const start = Math.floor(addr / size) * size; // a block starts on a multiple of its size
  return { start, end: start + size - 1, size, prefix, aligned: start === addr };
}

export function formatIp(n) {
  return [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');
}

export const formatCidr = (start, size) => `${formatIp(start)}/${32 - Math.log2(size)}`;

export const overlaps = (a, b) => a.start <= b.end && b.start <= a.end;

/**
 * Lay blocks out inside a supernet, largest first, each on a boundary that is a multiple of
 * its own size. Returns the placed blocks and the ones that did not fit.
 */
export function allocate(supernet, requests) {
  const placed = [];
  const failed = [];
  let cursor = supernet.start;
  const ordered = [...requests].sort((a, b) => b.size - a.size);
  for (const r of ordered) {
    const start = Math.ceil(cursor / r.size) * r.size;
    if (start + r.size - 1 > supernet.end) {
      failed.push(r);
      continue;
    }
    placed.push({ ...r, start, end: start + r.size - 1 });
    cursor = start + r.size;
  }
  return { placed, failed, freeFrom: cursor };
}

// Ranges the Virtual Network FAQ and the CAF IP addressing page say you can't add (vnetFaq, cafIp).
export const blockedRanges = [
  { cidr: '224.0.0.0/4', why: 'multicast' },
  { cidr: '255.255.255.255/32', why: 'broadcast' },
  { cidr: '127.0.0.0/8', why: 'loopback' },
  { cidr: '169.254.0.0/16', why: 'link local' },
  { cidr: '168.63.129.16/32', why: 'Azure internal DNS' },
];

// Private ranges the FAQ names: RFC 1918, plus RFC 6598 shared space, which Azure treats as private.
export const privateRanges = ['10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16', '100.64.0.0/10'];

/** Classify a block: blocked, private, or other (the FAQ says other ranges may have side effects). */
export function classify(block) {
  for (const r of blockedRanges) if (overlaps(block, parseCidr(r.cidr))) return { kind: 'blocked', why: r.why };
  if (privateRanges.some((r) => {
    const p = parseCidr(r);
    return block.start >= p.start && block.end <= p.end;
  })) return { kind: 'private' };
  return { kind: 'other' };
}

/** Azure reserves the first four addresses and the last one in every subnet (vnetFaq). */
export const RESERVED_PER_SUBNET = 5;
export const usableInSubnet = (size) => Math.max(0, size - RESERVED_PER_SUBNET);
