import { PageHeader } from "./_PageHeader";

interface Props {
  eyebrow: string;
  title: string;
  description: string;
  features: string[];
  shipDate: string;
}

export function ComingSoon({ eyebrow, title, description, features, shipDate }: Props) {
  return (
    <div>
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <div className="px-6 py-10 lg:px-10" style={{ fontFamily: "var(--font-outfit)" }}>
        <div className="max-w-[720px] rounded-3xl border border-gray-border bg-black-card p-10">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-orange">
            Roadmap
          </div>
          <h2
            className="mb-3 text-[22px] font-bold tracking-tight text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Shipping {shipDate}
          </h2>
          <p className="mb-6 text-[14px] leading-relaxed text-white-dim">
            We&apos;re building this in the open with our design partners. Here&apos;s what
            you&apos;ll see when this zone goes live:
          </p>
          <ul className="space-y-3">
            {features.map((f) => (
              <li key={f} className="flex gap-3 text-[13.5px] text-white-dim">
                <span className="mt-1.5 inline-block h-1 w-3 shrink-0 rounded-full bg-orange/60" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
