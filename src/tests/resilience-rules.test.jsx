import { describe, expect, it } from 'vitest';
import { outcome, failures, placements, stateInfo } from '../content/resilience.js';
import { src } from '../content/sources.js';

const base = { backup: false, immutable: false };

describe('resilience rules', () => {
  it('a zonal workload goes down in a zone outage; zone-redundant keeps running', () => {
    expect(outcome({ ...base, placement: 'zonal', failure: 'zone' }).state).toBe('down');
    expect(outcome({ ...base, placement: 'zr', failure: 'zone' }).state).toBe('up');
  });

  it('zones do not survive a region outage; only a second region recovers, by your failover', () => {
    expect(outcome({ ...base, placement: 'zr', failure: 'region' }).state).toBe('down');
    expect(outcome({ ...base, placement: 'multi', failure: 'region' }).state).toBe('manual');
  });

  it('data loss needs a backup, whatever the placement', () => {
    for (const p of placements) {
      expect(outcome({ ...base, placement: p.id, failure: 'data' }).state).toBe('lost');
      expect(outcome({ backup: true, immutable: false, placement: p.id, failure: 'data' }).state).toBe('restore');
    }
  });

  it('an immutable vault adds its source and mention of the lock', () => {
    const o = outcome({ backup: true, immutable: true, placement: 'zr', failure: 'data' });
    expect(o.src).toContain('immutableVault');
    expect(o.why).toMatch(/cannot be undone/);
  });

  it('every outcome names a state with a word and cites only known sources', () => {
    for (const p of placements) {
      for (const f of failures) {
        for (const backup of [false, true]) {
          const o = outcome({ placement: p.id, failure: f.id, backup, immutable: backup });
          expect(stateInfo[o.state].word.length).toBeGreaterThan(0);
          expect(o.src.length).toBeGreaterThan(0);
          for (const k of o.src) expect(src[k], k).toBeTruthy();
        }
      }
    }
  });
});
