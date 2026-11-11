import { ArrowRight } from 'lucide-react';
import { PageHeader, Section, Prose, Callout, Pill, Sources } from '../components/ui.jsx';
import { groups } from './registry.js';
import { VERIFIED, src } from '../data/sources.js';

export default function Home() {
  return (
    <article>
      <PageHeader
        eyebrow="Landing Zone Explorer · Index"
        title="Learn Azure landing zones by changing them"
        deck="Simulators, animated flows and dashboards for every idea behind a well-run Azure foundation, using a bank that doesn't exist."
        meta={[
          { dt: 'Audience', dd: 'Architects and engineers new to Azure' },
          { dt: 'Example org', dd: 'Contoso Bank (fictional)' },
          { dt: 'Pieces', dd: `${groups.reduce((n, g) => n + g.pages.length, 0) - 1} interactive pages` },
          { dt: 'Last verified', dd: VERIFIED },
        ]}
      />

      <Section n={1} title="How to use this site" wide={false}>
        <Prose>
          <p>
            Each page explains one idea and lets you change it. Move a subscription and watch which policies follow it. Send a
            packet through the hub and see the firewall inspect it. Break a pipeline on purpose and read the error you'd get.
          </p>
          <p>
            Start with the <a className="text-navy underline underline-offset-4" href="#journey">adoption journey</a> if you're new,
            or jump to any page below. Every page lists its sources and the date its facts were last checked, and anything
            simplified or made up for the example is labelled.
          </p>
        </Prose>
        <div className="mt-6">
          <Callout title="About Contoso Bank">
            Contoso Bank is a fictional regional lender adopting Azure for the first time: about 100 IT staff, a small platform
            team, a regulator that expects change control, and usage that will stay steady for years. Names, numbers and
            subscriptions on these pages are invented.
          </Callout>
        </div>
      </Section>

      {groups.map((g, gi) => (
        <Section key={g.name} n={gi + 2} title={g.name}>
          <ul className="grid gap-px border border-rule bg-rule sm:grid-cols-2">
            {g.pages
              .filter((p) => p.id !== 'home')
              .map((p) => (
                <li key={p.id} className="bg-paper">
                  <a href={`#${p.id}`} className="group flex h-full flex-col gap-2 p-5 transition-colors hover:bg-surface">
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-display text-[22px] font-semibold leading-[1.1] tracking-[-0.015em] text-ink">
                        {p.title}
                      </span>
                      <ArrowRight size={16} className="shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-navy" />
                    </span>
                    <Pill tone="navy" className="self-start">
                      {p.kind}
                    </Pill>
                    <span className="text-[14px] leading-[1.55] text-muted">{p.blurb}</span>
                  </a>
                </li>
              ))}
            {g.pages.filter((p) => p.id !== 'home').length % 2 === 1 && <li className="hidden bg-paper sm:block" aria-hidden="true" />}
          </ul>
        </Section>
      ))}

      <Sources verified={VERIFIED} items={[src.lzOverview, src.accelerator, src.avm]} />
    </article>
  );
}
