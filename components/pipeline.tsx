// The services pipeline drawn in the hero's own language: nodes on the same
// 96-unit glyph grid, #2C3237 edges, accent packets travelling between them.
// The glyphs are quoted from hero-network.tsx so the page reads as one system.

const R = 54;
const Y = 104;
const XS = [125, 375, 625, 875];

const GLYPHS: { d: string; ellipse?: boolean }[] = [
  // Build: code brackets
  { d: "M36 28 L18 48 L36 68 M60 28 L78 48 L60 68" },
  // Ground: a database
  {
    d: "M22 30 V66 C22 72 34 76 48 76 C62 76 74 72 74 66 V30 M22 48 C22 54 34 58 48 58 C62 58 74 54 74 48",
    ellipse: true,
  },
  // Harden: measurement
  { d: "M18 78 H78 M26 66 V46 M42 66 V30 M58 66 V52 M74 66 V22" },
  // Ship: cloud
  {
    d: "M30 66 H68 C78 66 82 58 82 52 C82 44 74 40 68 42 C66 32 58 26 48 26 C38 26 30 34 30 44 C22 44 16 50 16 56 C16 62 22 66 30 66 Z",
  },
];

const EDGES = XS.slice(0, -1).map(
  (x, i) => `M${x + R + 8} ${Y} L${XS[i + 1] - R - 8} ${Y}`
);

export default function Pipeline() {
  const s = R * 0.01198;
  return (
    <svg
      viewBox="0 0 1000 208"
      className="block w-full"
      aria-hidden="true"
      role="presentation"
    >
      <defs>
        <radialGradient id="pipeGlow" cx="50%" cy="52%" r="62%">
          <stop offset="0%" stopColor="#161C21" />
          <stop offset="100%" stopColor="#0B0D0E" />
        </radialGradient>
      </defs>
      <rect width="1000" height="208" fill="url(#pipeGlow)" />

      {EDGES.map((d) => (
        <path
          key={d}
          d={d}
          fill="none"
          stroke="#2C3237"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ))}

      {XS.map((cx, i) => (
        <g key={cx}>
          <circle
            cx={cx}
            cy={Y}
            r={R}
            fill="#0B0D0E"
            stroke="#2C3237"
            strokeWidth="3"
          />
          <g
            transform={`translate(${cx - 48 * s} ${Y - 48 * s}) scale(${s})`}
            fill="none"
            stroke="#F7F7F4"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {GLYPHS[i].ellipse && (
              <ellipse cx="48" cy="30" rx="26" ry="10" fill="none" />
            )}
            <path d={GLYPHS[i].d} />
          </g>
        </g>
      ))}

      {/* One packet per edge, offset so the flow reads left to right and the
          three never line up. */}
      {EDGES.map((d, i) => (
        <circle
          key={`packet-${d}`}
          r="6"
          fill="var(--accent)"
          className="traveler"
          style={{
            offsetPath: `path('${d}')`,
            animationDuration: "2.4s",
            animationDelay: `${-2.4 + i * 0.7}s`,
          }}
        />
      ))}
    </svg>
  );
}
