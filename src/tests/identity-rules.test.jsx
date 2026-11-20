import { describe, expect, it } from 'vitest';
import { assess, reach, scopes, totalSubs, roles } from '../content/identity.js';
import { src } from '../content/sources.js';

describe('identity rules', () => {
  it('a role at the Contoso root reaches every subscription', () => {
    expect(reach('contoso')).toHaveLength(totalSubs);
  });

  it('inheritance follows the hierarchy', () => {
    expect(reach('platform').sort()).toEqual(['platform-connectivity', 'platform-management']);
    expect(reach('landingzones').sort()).toEqual(['payments-prod', 'portal-prod']);
    expect(reach('corp')).toEqual(['payments-prod']);
    expect(reach('payments-prod')).toEqual(['payments-prod']);
    expect(reach('local')).toEqual([]);
  });

  it('flags wide, permanent, power-to-grant assignments and passes a narrow eligible one', () => {
    expect(assess({ role: 'owner', scopeId: 'contoso', eligible: false, toGroup: true }).risky).toBe(true);
    expect(assess({ role: 'reader', scopeId: 'contoso', eligible: false, toGroup: true }).risky).toBe(false);
    expect(assess({ role: 'contributor', scopeId: 'payments-prod', eligible: true, toGroup: true }).risky).toBe(false);
  });

  it('every point cites sources that exist, for every combination', () => {
    for (const s of scopes) {
      for (const role of roles) {
        for (const eligible of [false, true]) {
          for (const toGroup of [false, true]) {
            const a = assess({ role: role.id, scopeId: s.id, eligible, toGroup });
            expect(a.points.length).toBeGreaterThan(2);
            for (const p of a.points) {
              expect(p.src.length).toBeGreaterThan(0);
              for (const k of p.src) expect(src[k], k).toBeTruthy();
            }
          }
        }
      }
    }
  });
});
