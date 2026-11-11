import { useEffect, useState } from 'react';
import Layout from './components/Layout.jsx';
import { pageById } from './pages/registry.js';
import Home from './pages/Home.jsx';
import Journey from './pages/Journey.jsx';
import Glossary from './pages/Glossary.jsx';
import DesignAreas from './pages/DesignAreas.jsx';
import PolicySimulator from './pages/PolicySimulator.jsx';
import NetworkFlow from './pages/NetworkFlow.jsx';
import ResourceGroups from './pages/ResourceGroups.jsx';
import Naming from './pages/Naming.jsx';
import BuildOptions from './pages/BuildOptions.jsx';
import Pipeline from './pages/Pipeline.jsx';
import StateBackends from './pages/StateBackends.jsx';
import Vending from './pages/Vending.jsx';
import Brownfield from './pages/Brownfield.jsx';
import Observability from './pages/Observability.jsx';
import Guardrails from './pages/Guardrails.jsx';
import Billing from './pages/Billing.jsx';
import PavedPaths from './pages/PavedPaths.jsx';
import LabCost from './pages/LabCost.jsx';
import Register from './pages/Register.jsx';

const components = {
  home: Home,
  journey: Journey,
  glossary: Glossary,
  'design-areas': DesignAreas,
  'policy-simulator': PolicySimulator,
  'network-flow': NetworkFlow,
  'resource-groups': ResourceGroups,
  naming: Naming,
  'build-options': BuildOptions,
  pipeline: Pipeline,
  'state-backends': StateBackends,
  vending: Vending,
  brownfield: Brownfield,
  observability: Observability,
  guardrails: Guardrails,
  billing: Billing,
  'paved-paths': PavedPaths,
  'lab-cost': LabCost,
  register: Register,
};

const readHash = () => {
  const id = window.location.hash.replace(/^#\/?/, '');
  return components[id] ? id : 'home';
};

export default function App() {
  const [page, setPage] = useState(readHash);

  useEffect(() => {
    const onHash = () => {
      setPage(readHash());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    const p = pageById[page];
    document.title = p && page !== 'home' ? `${p.title} · Landing Zone Explorer` : 'Landing Zone Explorer';
  }, [page]);

  const Page = components[page];
  return (
    <Layout current={page}>
      <Page />
    </Layout>
  );
}
