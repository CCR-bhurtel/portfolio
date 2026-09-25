// Architecture diagrams for the featured projects, drawn in the hero's
// language: the same 96-unit glyph grid, the same #2C3237 edges and node
// strokes, the same accent packets. Every shape here describes what the system
// actually does, so the graphic carries information rather than decoration.

const GLYPH: Record<string, { d: string; ellipse?: boolean }> = {
  device: {
    d: "M30 30 H66 V66 H30 Z M40 40 H56 V56 H40 Z M48 14 V30 M48 66 V82 M14 48 H30 M66 48 H82 M36 14 V30 M60 14 V30 M36 66 V82 M60 66 V82 M14 36 H30 M14 60 H30 M66 36 H82 M66 60 H82",
  },
  queue: { d: "M54 14 L28 52 H48 L42 82 L68 44 H48 Z" },
  cloud: {
    d: "M30 66 H68 C78 66 82 58 82 52 C82 44 74 40 68 42 C66 32 58 26 48 26 C38 26 30 34 30 44 C22 44 16 50 16 56 C16 62 22 66 30 66 Z",
  },
  db: {
    d: "M22 30 V66 C22 72 34 76 48 76 C62 76 74 72 74 66 V30 M22 48 C22 54 34 58 48 58 C62 58 74 54 74 48",
    ellipse: true,
  },
  doc: {
    d: "M28 18 H58 L70 30 V78 H28 Z M58 18 V30 H70 M38 46 H60 M38 58 H60 M38 70 H52",
  },
  chat: { d: "M20 24 H76 V60 H44 L30 72 V60 H20 Z" },
  mail: { d: "M18 26 H78 V70 H18 Z M18 26 L48 50 L78 26" },
  chart: { d: "M18 78 H78 M26 66 V46 M42 66 V30 M58 66 V52 M74 66 V22" },
};

type Node = { x: number; y: number; r: number; g: keyof typeof GLYPH };
type Spec = {
  nodes: Node[];
  /** index pairs; `soft` draws the dashed, secondary relationship */
  edges: [number, number, ("soft" | undefined)?][];
};

const SPECS: Record<string, Spec> = {
  // An agent at the centre, reaching customer records, documents,
  // conversations and the replies it drafts.
  "Spacebrain.ai": {
    nodes: [
      { x: 300, y: 210, r: 64, g: "device" },
      { x: 104, y: 92, r: 40, g: "db" },
      { x: 496, y: 92, r: 40, g: "doc" },
      { x: 104, y: 328, r: 40, g: "chat" },
      { x: 496, y: 328, r: 40, g: "mail" },
    ],
    edges: [
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
    ],
  },
  // The device logs with no signal; a replay queue holds the sets until the
  // API is reachable again.
  Liftrava: {
    nodes: [
      { x: 84, y: 210, r: 50, g: "device" },
      { x: 232, y: 210, r: 38, g: "queue" },
      { x: 400, y: 210, r: 46, g: "cloud" },
      { x: 536, y: 210, r: 38, g: "db" },
    ],
    edges: [
      [0, 1],
      [1, 2, "soft"],
      [2, 3],
    ],
  },
  // An entry goes to the model, and comes back as a mood signal over time.
  "Tranquil.AI": {
    nodes: [
      { x: 96, y: 210, r: 48, g: "doc" },
      { x: 300, y: 210, r: 58, g: "device" },
      { x: 504, y: 210, r: 48, g: "chart" },
    ],
    edges: [
      [0, 1],
      [1, 2],
    ],
  },
  // Two peers talk directly; the server only brokers the handshake.
  ShareDirect: {
    nodes: [
      { x: 140, y: 266, r: 54, g: "device" },
      { x: 460, y: 266, r: 54, g: "device" },
      { x: 300, y: 96, r: 40, g: "cloud" },
    ],
    edges: [
      [0, 1],
      [2, 0, "soft"],
      [2, 1, "soft"],
    ],
  },
};

export const hasDiagram = (name: string) => name in SPECS;

/** Shorten an edge so it meets the node rings instead of the node centres. */
function edgePath(a: Node, b: Node) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const gap = 8;
  return `M${(a.x + ux * (a.r + gap)).toFixed(1)} ${(a.y + uy * (a.r + gap)).toFixed(1)} L${(b.x - ux * (b.r + gap)).toFixed(1)} ${(b.y - uy * (b.r + gap)).toFixed(1)}`;
}

export default function ArchDiagram({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const spec = SPECS[name];
  if (!spec) return null;
  const id = name.replace(/[^a-z0-9]/gi, "");

  return (
    <svg
      viewBox="0 0 600 420"
      className={className}
      aria-hidden="true"
      role="presentation"
    >
      <defs>
        <radialGradient id={`glow-${id}`} cx="50%" cy="50%" r="58%">
          <stop offset="0%" stopColor="#161C21" />
          <stop offset="100%" stopColor="#0B0D0E" />
        </radialGradient>
      </defs>
      <rect width="600" height="420" fill={`url(#glow-${id})`} />

      {spec.edges.map(([a, b, soft]) => {
        const d = edgePath(spec.nodes[a], spec.nodes[b]);
        return (
          <path
            key={d}
            d={d}
            fill="none"
            stroke="#2C3237"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={soft ? "6 10" : undefined}
          />
        );
      })}

      {spec.nodes.map((n) => {
        const s = n.r * 0.01198;
        const glyph = GLYPH[n.g];
        return (
          <g key={`${n.x}-${n.y}`}>
            <circle
              cx={n.x}
              cy={n.y}
              r={n.r}
              fill="#0B0D0E"
              stroke="#2C3237"
              strokeWidth="3"
            />
            <g
              transform={`translate(${n.x - 48 * s} ${n.y - 48 * s}) scale(${s})`}
              fill="none"
              stroke="#F7F7F4"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {glyph.ellipse && (
                <ellipse cx="48" cy="30" rx="26" ry="10" fill="none" />
              )}
              <path d={glyph.d} />
            </g>
          </g>
        );
      })}

      {spec.edges.map(([a, b], i) => {
        const d = edgePath(spec.nodes[a], spec.nodes[b]);
        return (
          <circle
            key={`packet-${d}`}
            r="6"
            fill="var(--accent)"
            className="traveler"
            style={{
              offsetPath: `path('${d}')`,
              animationDuration: "3s",
              animationDelay: `${-3 + i * 0.6}s`,
            }}
          />
        );
      })}
    </svg>
  );
}
