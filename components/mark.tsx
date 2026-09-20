export const MARK_PATH = "M18 18 H78 V32 H32 V42 H78 V78 H18 V64 H64 V54 H18 Z";

export default function Mark({
  size = 24,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 96 96"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <path d={MARK_PATH} fill="currentColor" />
      <rect x="64" y="42" width="14" height="12" fill="var(--accent)" />
    </svg>
  );
}
