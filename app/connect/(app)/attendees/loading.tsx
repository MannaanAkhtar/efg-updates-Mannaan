import { Skeleton } from "../_Skeleton";

export default function Loading() {
  return (
    <div style={{ fontFamily: "var(--font-outfit)" }}>
      <header className="border-b border-gray-border px-6 py-8 lg:px-10 lg:py-10">
        <Skeleton width={120} height={10} className="mb-3" />
        <Skeleton width={300} height={32} />
      </header>
      <div className="space-y-6 px-6 py-8 lg:px-10">
        <div className="flex flex-wrap gap-2">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} width={180} height={36} className="rounded-full" />
          ))}
        </div>
        <div className="rounded-2xl border border-gray-border bg-black-card p-5">
          <Skeleton width="100%" height={40} className="mb-4" />
          <div className="grid gap-4 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} width="100%" height={80} />
            ))}
          </div>
        </div>
        <Skeleton width="100%" height={400} />
      </div>
    </div>
  );
}
