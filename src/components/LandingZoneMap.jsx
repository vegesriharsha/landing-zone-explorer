import { boxes, chips, frames, bands, mapSize } from '../content/zone-map.js';
import { pageById } from '../content/registry.js';

// Hand-built SVG, tokens only. Each box is a hash link to its page; hover and keyboard
// focus outline it in navy. Nothing animates.
export default function LandingZoneMap() {
  const root = boxes.find((b) => b.page === 'policy-simulator');
  const rx = root.x + root.w / 2;
  const ry = root.y + root.h;
  const busY = ry + 18;
  const centres = frames.map(([x, , w]) => x + w / 2);
  return (
    <div className="overflow-x-auto border border-rule bg-surface">
      <svg
        viewBox={`0 0 ${mapSize.w} ${mapSize.h}`}
        className="block min-w-[760px] w-full"
        role="group"
        aria-label="Map of the landing zone: every page placed where its subject sits"
        fontFamily="var(--font-sans, Geist, system-ui, sans-serif)"
      >
        {bands.map((b) => (
          <text key={b.label} x={20} y={b.y} fontSize="11" letterSpacing="1.2" fill="var(--subtle)" style={{ textTransform: 'uppercase' }}>
            {b.label}
          </text>
        ))}

        <g fill="none" stroke="var(--rule)" strokeWidth="1.25">
          <path d={`M${rx} ${ry}V${busY}`} />
          <path d={`M${centres[0]} ${busY}H${centres[centres.length - 1]}`} />
          {frames.map(([x, y, w], i) => (
            <path key={x} d={`M${centres[i]} ${busY}V${y}`} />
          ))}
        </g>

        {frames.map(([x, y, w, h, title]) => (
          <g key={title}>
            <rect x={x} y={y} width={w} height={h} fill="var(--callout)" stroke="var(--rule)" strokeWidth="1.25" />
            <text x={x + 16} y={y + 22} fontSize="13" fontWeight="600" fill="var(--ink)">
              {title}
            </text>
          </g>
        ))}

        {chips.map((c) => (
          <g key={c.label}>
            <rect x={c.x} y={c.y} width={c.w} height={c.h} fill="var(--paper)" stroke="var(--faint)" strokeWidth="1" />
            <text x={c.x + c.w / 2} y={c.y + c.h / 2 + 4} fontSize="12" textAnchor="middle" fill="var(--muted)">
              {c.label}
            </text>
          </g>
        ))}

        {boxes.map((b) => {
          const p = pageById[b.page];
          const small = b.h < 30;
          return (
            <a key={b.page} href={`#${b.page}`} className="group">
              <title>{`${p.title}: ${p.blurb}`}</title>
              <rect
                x={b.x}
                y={b.y}
                width={b.w}
                height={b.h}
                fill="var(--surface)"
                strokeWidth="1.25"
                className="stroke-rule group-hover:stroke-navy group-focus-visible:stroke-navy"
              />
              <text x={b.x + 12} y={b.y + (small ? 14 : b.hint ? 21 : 27)} fontSize="13" fontWeight="600" fill="var(--ink)">
                {p.title}
              </text>
              {b.hint && !small && (
                <text x={b.x + 12} y={b.y + 39} fontSize="11" fill="var(--subtle)">
                  {b.hint}
                </text>
              )}
            </a>
          );
        })}
      </svg>
    </div>
  );
}
