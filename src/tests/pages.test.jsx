import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import Billing from '../pages/Billing.jsx';
import BuildOptions from '../pages/BuildOptions.jsx';
import Guardrails from '../pages/Guardrails.jsx';
import LabCost from '../pages/LabCost.jsx';
import NetworkFlow from '../pages/NetworkFlow.jsx';
import Observability from '../pages/Observability.jsx';
import StateBackends from '../pages/StateBackends.jsx';
import Resilience from '../pages/Resilience.jsx';
import Identity from '../pages/Identity.jsx';

// Smoke tests: each simulator page mounts and shows a heading. They lock current
// behaviour (no crash, a title, no NaN in the text) before any refactor.
const pages = { Billing, BuildOptions, Guardrails, LabCost, NetworkFlow, Observability, StateBackends, Resilience, Identity };

describe.each(Object.entries(pages))('%s', (_name, Page) => {
  it('renders a title and no NaN or undefined text', () => {
    const { container } = render(<Page />);
    expect(container.querySelector('h1')?.textContent.length).toBeGreaterThan(0);
    expect(container.textContent).not.toMatch(/NaN|undefined/);
  });
});
