import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import LandingZoneMap from '../components/LandingZoneMap.jsx';
import { allPages } from '../content/registry.js';
import { boxes } from '../content/zone-map.js';

describe('Landing zone map', () => {
  it('places every page except Overview exactly once', () => {
    const ids = boxes.map((b) => b.page).sort();
    const expected = allPages.filter((p) => p.id !== 'home').map((p) => p.id).sort();
    expect(ids).toEqual(expected);
  });

  it('renders a link to each page', () => {
    const { container } = render(<LandingZoneMap />);
    const hrefs = [...container.querySelectorAll('a')].map((a) => a.getAttribute('href'));
    expect(hrefs).toHaveLength(boxes.length);
    expect(hrefs).toContain('#policy-simulator');
  });

  it('keeps every box inside the viewBox without overlapping another box', () => {
    for (const b of boxes) {
      expect(b.x + b.w).toBeLessThanOrEqual(1000);
      expect(b.y + b.h).toBeLessThanOrEqual(640);
    }
    for (let i = 0; i < boxes.length; i += 1) {
      for (let j = i + 1; j < boxes.length; j += 1) {
        const a = boxes[i];
        const c = boxes[j];
        const overlap = a.x < c.x + c.w && c.x < a.x + a.w && a.y < c.y + c.h && c.y < a.y + a.h;
        expect(overlap, `${a.page} overlaps ${c.page}`).toBe(false);
      }
    }
  });
});
