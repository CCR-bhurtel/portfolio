export default function SectionLabel({
  num,
  children,
  dark = false,
}: {
  num: string;
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <div data-rv className="mb-5 flex items-baseline gap-4">
      <span className="font-serif text-[34px] leading-none text-accent">
        {num}
      </span>
      <span
        className={`font-serif text-[26px] italic leading-none ${
          dark ? "text-ash" : "text-muted"
        }`}
      >
        {children}
      </span>
      <span
        className={`h-px flex-1 opacity-35 ${dark ? "bg-smoke" : "bg-ash"}`}
      />
    </div>
  );
}
