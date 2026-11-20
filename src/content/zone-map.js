// Layout data for the Home map. Labels for linked boxes come from the page registry, so
// only page ids and positions live here; each page appears once. Coordinates are in the
// viewBox below. `page` is checked by scripts/check-content.mjs against the real page ids.
export const mapSize = { w: 1000, h: 640 };

// Boxes that open a page. `hint` is a second line saying where the page's subject sits.
export const boxes = [
  // Plan
  { page: 'journey', x: 20, y: 40, w: 225, h: 44 },
  { page: 'sequencer', x: 265, y: 40, w: 225, h: 44 },
  { page: 'design-areas', x: 510, y: 40, w: 225, h: 44 },
  { page: 'glossary', x: 755, y: 40, w: 225, h: 44 },
  // Management group hierarchy: the simulator owns the tree, the rest hang off it.
  { page: 'policy-simulator', x: 300, y: 130, w: 400, h: 46, hint: 'Contoso intermediate root' },
  { page: 'network-flow', x: 36, y: 296, w: 408, h: 52, hint: 'Hub, firewall and spokes' },
  { page: 'vending', x: 490, y: 296, w: 150, h: 52, hint: 'Creates subscriptions' },
  { page: 'resource-groups', x: 652, y: 296, w: 130, h: 52, hint: 'Inside one' },
  { page: 'naming', x: 490, y: 356, w: 292, h: 20, hint: '' },
  { page: 'lab-cost', x: 822, y: 296, w: 140, h: 52, hint: 'Free credits' },
  // Build
  { page: 'build-options', x: 20, y: 440, w: 235, h: 44 },
  { page: 'pipeline', x: 265, y: 440, w: 235, h: 44 },
  { page: 'state-backends', x: 510, y: 440, w: 235, h: 44 },
  { page: 'brownfield', x: 755, y: 440, w: 225, h: 44 },
  // Operate
  { page: 'observability', x: 20, y: 560, w: 184, h: 44 },
  { page: 'guardrails', x: 214, y: 560, w: 184, h: 44 },
  { page: 'billing', x: 408, y: 560, w: 184, h: 44 },
  { page: 'paved-paths', x: 602, y: 560, w: 184, h: 44 },
  { page: 'register', x: 796, y: 560, w: 184, h: 44 },
];

// Management groups drawn as plain labels (they are the subject of the hierarchy page).
export const chips = [
  { label: 'Security', x: 36, y: 246, w: 94, h: 34 },
  { label: 'Management', x: 140, y: 246, w: 94, h: 34 },
  { label: 'Connectivity', x: 244, y: 246, w: 94, h: 34 },
  { label: 'Identity', x: 348, y: 246, w: 96, h: 34 },
  { label: 'Corp', x: 490, y: 246, w: 94, h: 34 },
  { label: 'Online', x: 594, y: 246, w: 94, h: 34 },
  { label: 'Local', x: 698, y: 246, w: 84, h: 34 },
  { label: 'Sandbox', x: 822, y: 246, w: 140, h: 34 },
];

// Frames group the boxes: [x, y, w, h, title]. The intermediate root connects to each.
export const frames = [
  [20, 206, 440, 176, 'Platform'],
  [474, 206, 320, 176, 'Workload landing zones'],
  [808, 206, 172, 176, 'Sandbox'],
];

// Row captions: y of the rule and its label.
export const bands = [
  { y: 22, label: 'Plan' },
  { y: 112, label: 'Management group hierarchy' },
  { y: 422, label: 'Build' },
  { y: 542, label: 'Operate' },
];
