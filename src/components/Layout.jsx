import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { groups } from '../pages/registry.js';

function Nav({ current, onNavigate }) {
  return (
    <nav aria-label="Pages" className="space-y-7">
      {groups.map((g) => (
        <div key={g.name}>
          <p className="label mb-2">{g.name}</p>
          <ul className="space-y-0.5">
            {g.pages.map((p) => {
              const active = p.id === current;
              return (
                <li key={p.id}>
                  <a
                    href={`#${p.id}`}
                    onClick={onNavigate}
                    aria-current={active ? 'page' : undefined}
                    className={`block border-l-2 py-1 pl-3 text-[14px] transition-colors ${
                      active ? 'border-navy font-medium text-ink' : 'border-transparent text-muted hover:border-rule hover:text-ink'
                    }`}
                  >
                    {p.title}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function Wordmark() {
  return (
    <a href="#home" className="block">
      <span className="block font-display text-[24px] font-semibold leading-[1.05] tracking-[-0.02em] text-ink">
        Landing Zone Explorer
      </span>
      <span className="label mt-1 block">Contoso Bank · learning edition</span>
    </a>
  );
}

export default function Layout({ current, children }) {
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [current]);

  return (
    <div className="min-h-screen bg-paper">
      {/* Mobile and tablet top bar */}
      <div
        className="gutter sticky z-20 flex items-center justify-between border-b border-rule bg-paper py-3 lg:hidden"
        style={{ top: 'env(safe-area-inset-top, 0px)' }}
      >
        <Wordmark />
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="inline-flex items-center gap-2 border border-rule px-2.5 py-1.5 text-[13px] text-ink"
        >
          {open ? <X size={16} /> : <Menu size={16} />}
          {open ? 'Close' : 'Pages'}
        </button>
      </div>
      {open && (
        <div
          id="mobile-nav"
          className="gutter border-b border-rule bg-paper py-6 lg:hidden"
        >
          <Nav current={current} onNavigate={() => setOpen(false)} />
        </div>
      )}

      <div className="lg:flex">
        <aside className="hidden lg:block lg:w-[260px] lg:shrink-0">
          <div className="sticky top-0 h-screen overflow-y-auto border-r border-rule px-7 py-10">
            <Wordmark />
            <div className="mt-10">
              <Nav current={current} />
            </div>
            <p className="mt-12 text-[12px] leading-[1.5] text-subtle">
              Contoso Bank is fictional. Nothing here describes a real organisation's environment.
            </p>
          </div>
        </aside>

        <main
          className="gutter min-w-0 flex-1 pb-24 pt-10 sm:pt-[72px] lg:px-14"
        >
          <div className="mx-auto max-w-[1080px] lg:mx-0">{children}</div>
          <p className="mx-auto mt-16 max-w-[1080px] border-t border-faint pt-4 text-[12px] text-subtle lg:mx-0">
            Landing Zone Explorer · Contoso Bank learning edition · rev 2026.11 · Facts verified against Microsoft and HashiCorp
            documentation on the dates shown on each page.
          </p>
        </main>
      </div>
    </div>
  );
}
