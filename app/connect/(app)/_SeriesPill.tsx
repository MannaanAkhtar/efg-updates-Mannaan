import type { Series } from "@/lib/connect/types";
import { SERIES_LABEL, SERIES_COLOR } from "@/lib/connect/types";

export function SeriesPill({ series }: { series: Series }) {
  const color = SERIES_COLOR[series];
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.14em]"
      style={{ color, fontFamily: "var(--font-outfit)" }}
    >
      <span
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ background: color }}
      />
      {SERIES_LABEL[series]}
    </span>
  );
}
