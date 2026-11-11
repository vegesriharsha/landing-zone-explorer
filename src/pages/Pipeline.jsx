import { useState } from 'react';
import { Section, Segmented, Pill, Callout } from '../components/ui.jsx';
import PageShell from '../components/PageShell.jsx';
import { FlowSection } from '../archetypes/Flow.jsx';
import flow from '../content/pipeline-flow.js';

const OWNER = 'contoso';
const OWNER_ID = '1048576';
const REPO_ID = '73400320';

export default function Pipeline() {
  // Subject comparison
  const [event, setEvent] = useState('none');
  const ENV = 'environment:alz-apply';
  const credName = `repo:${OWNER}/alz-platform:${ENV}`;
  const credImm = `repo:${OWNER}@${OWNER_ID}/alz-platform@${REPO_ID}:${ENV}`;
  const worlds = {
    none: {
      name: { token: credName, match: true, tone: 'good', text: 'Same repository, same name: the subjects match and Entra issues a token.' },
      imm: { token: credImm, match: true, tone: 'good', text: 'Same repository, same IDs: the subjects match and Entra issues a token.' },
    },
    renamed: {
      name: { token: `repo:${OWNER}@${OWNER_ID}/alz-platform-v2@${REPO_ID}:${ENV}`, match: false, tone: 'bad', text: 'The name changed and, after 15 July 2026, a renamed repository switches to the immutable format. The credential no longer matches.' },
      imm: { token: `repo:${OWNER}@${OWNER_ID}/alz-platform-v2@${REPO_ID}:${ENV}`, match: false, tone: 'bad', text: 'The IDs stay the same, but the subject still contains the name, so an exact credential stops matching. Plan renames: add the new credential first.' },
    },
    reused: {
      name: { token: credName, match: true, tone: 'bad', text: 'A different repository now has the old name. A subject made only of names can’t tell them apart, so the stranger’s workflow can match your credential.' },
      imm: { token: `repo:${OWNER}@${OWNER_ID}/alz-platform@99887766:${ENV}`, match: false, tone: 'good', text: 'The new repository has a new ID. IDs are never reused, so it can’t match a credential written for the original. This is what immutable subjects are for.' },
    },
  };
  const w = worlds[event];

  const header = {
    eyebrow: "Animated flow · Pipeline and identities",
    title: "Two identities, one approval, no secrets",
    deck: "Follow a change from pull request to apply. Then break it on purpose and read the error the way you would at 2 a.m.",
    meta: [
      { dt: 'Identities', dd: 'Plan, apply' },
      { dt: 'Secrets stored', dd: 'None (OIDC)' },
      { dt: 'Human gate', dd: 'Environment approval' },
    ],
  };

  return (
    <PageShell header={header} sources={['bootstrap', 'permissionsFaq', 'wif', 'ghOidc', 'ghImmutable', 'entraImmutable', 'ghEnvironments']}>

      <FlowSection data={flow} />

      <Section n={2} title="What the subject protects" intro="Entra trusts a token only if its subject matches a federated credential exactly. Compare a name-based credential with an immutable one when the repository changes.">
        <div className="max-w-[620px]">
          <Segmented
            label="What happens to the repository"
            value={event}
            onChange={setEvent}
            options={[
              { value: 'none', label: 'Nothing' },
              { value: 'renamed', label: 'Renamed' },
              { value: 'reused', label: 'Name reused' },
            ]}
          />
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {[
            ['Name-based credential', credName, w.name],
            ['Immutable credential', credImm, w.imm],
          ].map(([title, cred, r]) => (
            <div key={title} className="fade-in min-w-0 border border-rule bg-surface">
              <div className="flex items-center justify-between gap-2 border-b border-faint px-4 py-2.5">
                <p className="label !text-ink">{title}</p>
                <Pill tone={r.tone}>{r.match ? 'Token issued' : 'No match'}</Pill>
              </div>
              <div className="space-y-3 p-4">
                <div>
                  <p className="label">Credential subject</p>
                  <p className="mt-1 break-all font-mono text-[12.5px] text-ink">{cred}</p>
                </div>
                <div>
                  <p className="label">Token subject</p>
                  <p className={`mt-1 break-all font-mono text-[12.5px] ${r.match ? 'text-ink' : 'text-bad'}`}>{r.token}</p>
                </div>
                <p className="text-[13.5px] leading-[1.55] text-muted">{r.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Callout tone="gold" title="Dates and scope">
            On GitHub.com, repositories created, renamed or transferred after 15 July 2026 use the immutable format; existing
            repositories keep name-based subjects until you opt in at the organisation or repository. GitHub Enterprise Server
            doesn’t offer it. Microsoft Entra documents the migration: add the new credential, opt in, confirm a run, then delete
            the old one. New accelerator bootstraps already write immutable subjects with a custom claim template that adds the
            calling workflow (job_workflow_ref); the subjects here are simplified.
          </Callout>
        </div>
      </Section>

      <Section n={3} title="Who can do what" wide={false}>
        <div className="overflow-x-auto border-y border-rule">
          <table className="w-full min-w-[560px] text-left text-[14px]">
            <thead>
              <tr className="border-b border-rule">
                {['Identity', 'Trusted from', 'Azure role', 'State'].map((h) => (
                  <th key={h} className="label px-3 py-2.5 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-faint">
                <td className="px-3 py-2.5 font-mono text-[12.5px] text-ink">id-alz-plan</td>
                <td className="px-3 py-2.5 text-ink">alz-plan environment</td>
                <td className="px-3 py-2.5 text-ink">Reader on the intermediate root</td>
                <td className="px-3 py-2.5 text-muted">Storage Blob Data Contributor on the state container</td>
              </tr>
              <tr>
                <td className="px-3 py-2.5 font-mono text-[12.5px] text-ink">id-alz-apply</td>
                <td className="px-3 py-2.5 text-ink">alz-apply environment, after approval</td>
                <td className="px-3 py-2.5 text-ink">Owner on the intermediate root</td>
                <td className="px-3 py-2.5 text-muted">Storage Blob Data Contributor on the state container</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[13.5px] leading-[1.6] text-muted">
          The accelerator’s bootstrap creates both identities as user-assigned managed identities, their federated credentials, the
          two environments with an approver group, and the state storage account. Names here are illustrative.
        </p>
      </Section>
    </PageShell>
  );
}
