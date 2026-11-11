// Site-wide settings. Everything a page shows about the site itself comes from here.
export default {
  siteName: 'Landing Zone Explorer',
  edition: 'Contoso Bank · learning edition',
  rev: '2026.11',
  // Keep the example organisation fictional on any public site.
  orgDisclaimer: "Contoso Bank is fictional. Nothing here describes a real organisation's environment.",
  footer: 'Facts verified against Microsoft and HashiCorp documentation on the dates shown on each page.',
  // Prefix for anything kept in the viewer's browser (ticks, progress). Unchanged from
  // the first release so saved journey ticks survive the rebuild.
  storagePrefix: 'lze',
  home: {
    eyebrow: 'Landing Zone Explorer · Index',
    title: 'Learn Azure landing zones by changing them',
    deck: "Simulators, animated flows and dashboards for every idea behind a well-run Azure foundation, using a bank that doesn't exist.",
    meta: [
      { dt: 'Audience', dd: 'Architects and engineers new to Azure' },
      { dt: 'Example org', dd: 'Contoso Bank (fictional)' },
    ],
    intro: [
      "Each page explains one idea and lets you change it. Move a subscription and watch which policies follow it. Send a packet through the hub and see the firewall inspect it. Break a pipeline on purpose and read the error you'd get.",
      "Start with the adoption journey if you're new, or jump to any page below. Every page lists its sources and the date its facts were last checked, and anything simplified or made up for the example is labelled.",
    ],
    about: {
      title: 'About Contoso Bank',
      body: 'Contoso Bank is a fictional regional lender adopting Azure for the first time: about 100 IT staff, a small platform team, a regulator that expects change control, and usage that will stay steady for years. Names, numbers and subscriptions on these pages are invented.',
    },
    sources: ['lzOverview', 'accelerator', 'avm'],
  },
};
