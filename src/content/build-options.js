// Decision data for the Build options page (rendered by DecisionSection inside a custom page).
// Each answer scores every option with [score, reason]; an empty reason is hidden.
export default {
  sectionTitle: 'Which fits you',
  maxScore: 11,
  options: [
    { id: 'clickops', name: 'Click-ops in the portal', blurb: 'Build it by hand from the portal. Fast for one subscription, impossible to repeat exactly.' },
    { id: 'custom', name: 'Your own Terraform or Bicep', blurb: 'Write every resource yourself. Full control, and every policy update is yours to make.' },
    { id: 'avm', name: 'AVM modules, wired by you', blurb: 'Use Microsoft’s verified pattern modules and assemble the pipelines, state and identities yourself.' },
    { id: 'accel', name: 'The ALZ IaC accelerator', blurb: 'Bootstraps repos, pipelines, identities and state, then deploys starter code built on the AVM modules.' },
  ],
  questions: [
    {
      id: 'scale',
      q: 'How many subscriptions in three years?',
      default: 'dozens',
      answers: {
        few: { label: 'A handful', s: { clickops: [1, 'Manageable by hand at this size'], custom: [0, 'Code pays off slowly at this size'], avm: [1, 'Modules still save design time'], accel: [2, 'Same setup effort whatever the size'] } },
        dozens: { label: 'Dozens', s: { clickops: [-2, 'Every new subscription is configured by hand'], custom: [1, 'Repeatable once written'], avm: [2, 'Vending module makes subscriptions repeatable'], accel: [2, 'Vending and pipelines included'] } },
        hundreds: { label: 'Hundreds', s: { clickops: [-3, 'Can’t keep hundreds consistent by hand'], custom: [1, 'Repeatable, but you maintain all of it'], avm: [2, 'Scales through the vending module'], accel: [3, 'Built for this, with vending as code'] } },
      },
    },
    {
      id: 'audit',
      q: 'Do changes need approvals and an audit trail?',
      default: 'regulated',
      answers: {
        regulated: { label: 'Yes, we’re regulated', s: { clickops: [-3, 'No review before a change; only the activity log after'], custom: [1, 'Possible, once you build the pipeline'], avm: [1, 'Possible, once you build the pipeline'], accel: [3, 'Pull requests, approvals and split plan/apply identities from day one'] } },
        light: { label: 'Nice to have', s: { clickops: [0, ''], custom: [1, 'Git history comes free'], avm: [1, 'Git history comes free'], accel: [1, 'Approvals are there if you want them'] } },
      },
    },
    {
      id: 'skills',
      q: 'How much Terraform experience does the team have?',
      default: 'some',
      answers: {
        none: { label: 'None yet', s: { clickops: [1, 'No new skills needed to start'], custom: [-3, 'Writing a platform from scratch is a steep first project'], avm: [-1, 'Wiring modules and pipelines needs experience'], accel: [1, 'Generates working code to learn from'] } },
        some: { label: 'Some', s: { clickops: [0, ''], custom: [-1, 'Large surface to get right alone'], avm: [1, 'Reasonable with good examples'], accel: [2, 'You change inputs, not the plumbing'] } },
        strong: { label: 'Strong', s: { clickops: [-1, 'Wastes the team’s skills'], custom: [2, 'The team can own it'], avm: [2, 'The team can own the wiring'], accel: [2, 'Fast start, still fully editable'] } },
      },
    },
    {
      id: 'design',
      q: 'How close is your design to the ALZ reference?',
      default: 'close',
      answers: {
        close: { label: 'Close', s: { clickops: [0, ''], custom: [-1, 'Rewrites what Microsoft already maintains'], avm: [1, 'Fits the modules'], accel: [3, 'The defaults are your design'] } },
        some: { label: 'Some changes', s: { clickops: [0, ''], custom: [0, ''], avm: [2, 'Modules take your overrides'], accel: [2, 'Library overrides and tfvars cover most changes'] } },
        far: { label: 'Very different', s: { clickops: [0, ''], custom: [2, 'Only code you write fits a design this different'], avm: [2, 'Use the modules you need, skip the rest'], accel: [0, 'You’d fight the starter module'] } },
      },
    },
  ],
  verdicts: {
    accel: 'The accelerator fits. Start with it even if you expect to customise: it is plain Terraform in your own repo, so nothing stops you editing it later.',
    avm: 'Assemble the AVM modules yourself. You keep Microsoft-maintained building blocks but own the pipelines, state and identities.',
    custom: 'Your own code fits a design this different, but budget for maintaining the policy set yourself; still borrow AVM resource modules where they fit.',
    clickops: 'Click-ops can work for a short trial. Plan the move to code before the second workload arrives; the Brownfield page shows what that costs.',
  },
  tones: { clickops: 'gold' },
};
