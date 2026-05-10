interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ eyebrow, title, description, actions }: Props) {
  return (
    <header
      className="border-b border-gray-border px-6 py-8 lg:px-10 lg:py-10"
      style={{ fontFamily: "var(--font-outfit)" }}
    >
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="min-w-0">
          {eyebrow && (
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-orange">
              {eyebrow}
            </div>
          )}
          <h1
            className="text-[28px] font-bold leading-[1.1] tracking-tight text-white sm:text-[32px]"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
          >
            {title}
          </h1>
          {description && (
            <p className="mt-2 max-w-[640px] text-[14px] leading-relaxed text-white-dim">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </header>
  );
}
