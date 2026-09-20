import { MARK_PATH } from "@/components/mark";

// Tool network drawn in a 2880×1800 space. Icons are authored on a 96-unit
// grid and scaled to their node's radius.
const HUB: [number, number] = [1440, 800];

const NODES: { c: [number, number]; r: number; d: string; ellipse?: boolean }[] =
  [
    { c: [500, 500], r: 54, d: "M18 26 H78 V70 H18 Z M18 26 L48 50 L78 26" },
    { c: [900, 320], r: 44, d: "M20 24 H76 V60 H44 L30 72 V60 H20 Z" },
    {
      c: [1250, 560],
      r: 70,
      ellipse: true,
      d: "M22 30 V66 C22 72 34 76 48 76 C62 76 74 72 74 66 V30 M22 48 C22 54 34 58 48 58 C62 58 74 54 74 48",
    },
    { c: [1650, 380], r: 50, d: "M36 28 L18 48 L36 68 M60 28 L78 48 L60 68" },
    {
      c: [2100, 560],
      r: 60,
      d: "M30 66 H68 C78 66 82 58 82 52 C82 44 74 40 68 42 C66 32 58 26 48 26 C38 26 30 34 30 44 C22 44 16 50 16 56 C16 62 22 66 30 66 Z",
    },
    {
      c: [2450, 380],
      r: 44,
      d: "M48 34 A14 14 0 1 0 48 62 A14 14 0 1 0 48 34 Z M48 16 V26 M48 70 V80 M16 48 H26 M70 48 H80 M25 25 L32 32 M64 64 L71 71 M25 71 L32 64 M64 32 L71 25",
    },
    {
      c: [700, 950],
      r: 48,
      d: "M28 18 H58 L70 30 V78 H28 Z M58 18 V30 H70 M38 46 H60 M38 58 H60 M38 70 H52",
    },
    { c: [1200, 1120], r: 56, d: "M54 14 L28 52 H48 L42 82 L68 44 H48 Z" },
    {
      c: [1800, 1080],
      r: 50,
      d: "M18 78 H78 M26 66 V46 M42 66 V30 M58 66 V52 M74 66 V22",
    },
    {
      c: [2300, 950],
      r: 44,
      d: "M18 22 H78 V74 H18 Z M18 40 H78 M18 57 H78 M38 22 V74 M58 22 V74",
    },
    {
      c: [2650, 800],
      r: 40,
      d: "M30 30 H66 V66 H30 Z M40 40 H56 V56 H40 Z M48 14 V30 M48 66 V82 M14 48 H30 M66 48 H82 M36 14 V30 M60 14 V30 M36 66 V82 M60 66 V82 M14 36 H30 M14 60 H30 M66 36 H82 M66 60 H82",
    },
  ];

const EDGES = [
  "M500 500 L900 320",
  "M900 320 L1250 560",
  "M1250 560 L1650 380",
  "M1650 380 L2100 560",
  "M2100 560 L2450 380",
  "M500 500 L700 950",
  "M700 950 L1200 1120",
  "M1200 1120 L1800 1080",
  "M1800 1080 L2300 950",
  "M2300 950 L2650 800",
  "M1250 560 L1440 800",
  "M1440 800 L1200 1120",
  "M1440 800 L1800 1080",
  "M1650 380 L1440 800",
  "M2100 560 L2300 950",
];

// [path, duration (s), delay (s)]
const SIGNALS: [string, number, number][] = [
  ["M500 500 L900 320", 6, -1.3],
  ["M1250 560 L900 320", 8, -2.6],
  ["M1250 560 L1650 380", 5, -3.9],
  ["M2100 560 L1650 380", 7, -5.2],
  ["M2100 560 L2450 380", 4, -6.5],
  ["M700 950 L500 500", 6, -0.8],
  ["M700 950 L1200 1120", 8, -2.1],
  ["M1800 1080 L1200 1120", 5, -3.4],
  ["M1800 1080 L2300 950", 7, -4.7],
  ["M2650 800 L2300 950", 4, -6.0],
  ["M1250 560 L1440 800", 6, -0.3],
  ["M1200 1120 L1440 800", 8, -1.6],
  ["M1440 800 L1800 1080", 5, -2.9],
  ["M1440 800 L1650 380", 7, -4.2],
  ["M2100 560 L2300 950", 4, -5.5],
];

const ECHOES: [string, number, number][] = [
  ["M1650 380 L1250 560", 9, -0.3],
  ["M500 500 L700 950", 8, -0.6],
  ["M2300 950 L1800 1080", 7, -0.9],
  ["M1440 800 L1200 1120", 6, -1.2],
  ["M2300 950 L2100 560", 9, -1.5],
];

const stroke = {
  fill: "none",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function Traveler({
  path,
  dur,
  delay,
  r,
  fill,
}: {
  path: string;
  dur: number;
  delay: number;
  r: number;
  fill: string;
}) {
  return (
    <circle
      r={r}
      fill={fill}
      className="traveler"
      style={{
        offsetPath: `path('${path}')`,
        animationDuration: `${dur}s`,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

export default function HeroNetwork() {
  return (
    <svg
      viewBox="0 0 2880 1800"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 block h-full w-full"
      aria-hidden="true"
    >
      <rect width="2880" height="1800" fill="#0B0D0E" />
      <g transform="translate(0,-230)">
        <circle cx={HUB[0]} cy={HUB[1]} r="520" fill="#11161A" />
        <circle cx={HUB[0]} cy={HUB[1]} r="340" fill="#161C21" />

        {EDGES.map((d) => (
          <path key={d} d={d} stroke="#2C3237" strokeWidth="2" {...stroke} />
        ))}

        {NODES.map(({ c: [cx, cy], r, d, ellipse }) => {
          const s = r * 0.01198;
          return (
            <g key={`${cx}-${cy}`}>
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill="#0B0D0E"
                stroke="#2C3237"
                strokeWidth="3"
              />
              <g
                transform={`translate(${cx - 48 * s} ${cy - 48 * s}) scale(${s})`}
                stroke="#F7F7F4"
                strokeWidth="5"
              >
                {ellipse && (
                  <ellipse cx="48" cy="30" rx="26" ry="10" fill="none" />
                )}
                <path d={d} {...stroke} />
              </g>
            </g>
          );
        })}

        <circle cx={HUB[0]} cy={HUB[1]} r="118" fill="#F7F7F4" />
        <circle
          cx={HUB[0]}
          cy={HUB[1]}
          r="150"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="3"
          strokeDasharray="10 14"
          className="spin-slow"
        />
        <g transform="translate(1368 728) scale(1.5)">
          <path d={MARK_PATH} fill="#0B0D0E" />
          <rect x="64" y="42" width="14" height="12" fill="var(--accent)" />
        </g>

        {SIGNALS.map(([path, dur, delay]) => (
          <Traveler
            key={path}
            path={path}
            dur={dur}
            delay={delay}
            r={7}
            fill="var(--accent)"
          />
        ))}
        {ECHOES.map(([path, dur, delay]) => (
          <Traveler
            key={path}
            path={path}
            dur={dur}
            delay={delay}
            r={5}
            fill="rgba(169,172,168,.5)"
          />
        ))}
      </g>
    </svg>
  );
}
