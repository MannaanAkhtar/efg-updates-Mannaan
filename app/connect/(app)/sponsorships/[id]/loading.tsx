import { Skeleton } from "../../_Skeleton";

export default function Loading() {
  return (
    <div style={{ fontFamily: "var(--font-outfit)" }}>
      <header className="border-b border-gray-border bg-black-card px-6 py-12 lg:px-10 lg:py-16">
        <Skeleton width={140} height={12} className="mb-4" />
        <Skeleton width="60%" height={36} className="mb-3" />
        <Skeleton width={200} height={14} />
      </header>
      <div className="space-y-10 px-6 py-10 lg:px-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-gray-border bg-black-card p-4">
              <Skeleton width={70} height={10} className="mb-2" />
              <Skeleton width={90} height={20} />
            </div>
          ))}
        </div>
        <div>
          <Skeleton width={200} height={20} className="mb-4" />
          <Skeleton width="100%" height={6} className="mb-6 rounded-full" />
          <div className="rounded-2xl border border-gray-border bg-black-card">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="border-b border-gray-border p-4 last:border-b-0">
                <Skeleton width="60%" height={14} className="mb-2" />
                <Skeleton width="40%" height={12} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
