// Flow data for the Pipeline page (rendered by FlowSection inside a custom page).
// Steps advance one column each; `stack: true` keeps a step in the previous column.
export default {
  sectionTitle: 'Run the pipeline',
  intro: 'Pick a scenario. The token travels across GitHub, Entra and Azure; the run log fills in as it goes.',
  logLabel: 'Run log · illustrative',
  statusLabels: { running: 'Running', failed: 'Failed', ok: 'Succeeded' },
  okText:
    'The pull-request job can only read: its identity has Reader. Only the apply job, after a person approves it in the alz-apply environment, gets an identity that can write. Neither job holds a password; each asks GitHub for a short-lived OIDC token and trades it with Entra.',
  lanes: [
    { id: 'gh', name: 'GitHub Actions' },
    { id: 'entra', name: 'Microsoft Entra ID' },
    { id: 'az', name: 'Azure' },
  ],
  steps: [
    { lane: 'gh', label: 'Pull request', log: 'Pull request #42 opened: add policy assignment to Internal (Corp)' },
    { lane: 'gh', label: 'Plan job', log: 'Job "plan" started in environment alz-plan; requesting OIDC token' },
    { lane: 'entra', label: 'Plan identity', stack: true, log: 'Token exchanged for id-alz-plan (Reader on the intermediate root)' },
    { lane: 'az', label: 'terraform plan', log: 'terraform plan: 1 to add, 0 to change, 0 to destroy' },
    { lane: 'gh', label: 'Review, merge', log: 'Plan posted to the pull request; approved by a reviewer and merged' },
    { lane: 'gh', label: 'Approval gate', gate: true, log: 'Job "apply" waiting: environment alz-apply needs platform-approvers' },
    { lane: 'gh', label: 'Apply job', log: 'Approved by a platform approver; requesting OIDC token' },
    { lane: 'entra', label: 'Apply identity', stack: true, log: 'Token exchanged for id-alz-apply (Owner on the intermediate root)' },
    { lane: 'az', label: 'terraform apply', log: 'terraform apply: 1 added, 0 changed, 0 destroyed' },
    { lane: 'gh', label: 'Done', log: 'Run succeeded. State saved with a lock and a new blob version' },
  ],
  scenarios: {
    ok: { label: 'Normal change', fail: null },
    renamed: {
      label: 'Repo was renamed',
      fail: 2,
      log: "AADSTS70021: No matching federated identity record found for presented assertion. Assertion Subject: 'repo:contoso@1048576/alz-platform-v2@73400320:environment:alz-plan'",
      why: 'Entra compares the token’s subject with the federated credential exactly. The repo is now alz-platform-v2, so the subject carries the new name (and, for renames after 15 July 2026, GitHub’s immutable format). It no longer matches, so no token is issued. Nothing in Azure was touched.',
      fix: 'Add a credential for the new subject before a rename, confirm a run signs in, then delete the old one. Section 2 shows what changes with immutable subjects.',
    },
    applyInPr: {
      label: 'Apply from the PR job',
      fail: 3,
      log: "AuthorizationFailed (403): id-alz-plan does not have authorization to perform action 'Microsoft.Authorization/policyAssignments/write'",
      why: 'Someone added terraform apply to the pull-request job. That job signs in as the plan identity, which only has Reader, so Azure refuses the write.',
      fix: 'This is the design working: code nobody has reviewed can read Azure but never change it. Keep the plan identity read-only.',
    },
    rejected: {
      label: 'Approver rejects',
      fail: 5,
      log: 'Deployment to alz-apply rejected by a platform approver; job "apply" skipped',
      why: 'The change was merged, but the apply job needs approval in the alz-apply environment. The approver rejected it, so it never ran.',
      fix: 'Fix the code in a new pull request. The approval gate is the last human check before the apply identity, with Owner, does anything.',
    },
  },
};
