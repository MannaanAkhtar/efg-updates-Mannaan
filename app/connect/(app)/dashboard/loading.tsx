import { Skeleton } from "../_Skeleton";

export default function Loading() {
  return (
    <div style={{ fontFamily: "var(--font-outfit)" }}>
      <header className="border-b border-gray-border px-6 py-8 lg:px-10 lg:py-10">
        <Skeleton width={80} height={10} className="mb-3" />
        <Skeleton width={320} height={32} />
      </header>
      <div className="space-y-10 px-6 py-10 lg:px-10">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-gray-border bg-black-card p-5">
              <Skeleton width={90} height={10} className="mb-3" />
              <Skeleton width={80} height={28} />
            </div>
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-3 lg:col-span-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-border bg-black-card p-4"
              >
                <Skeleton width={120} height={10} className="mb-2" />
                <Skeleton width="80%" height={18} className="mb-1" />
                <Skeleton width="40%" height={10} />
              </div>
            ))}
          </div>
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-border bg-black-card p-4"
              >
                <Skeleton width={90} height={10} className="mb-2" />
                <Skeleton width="100%" height={14} className="mb-1" />
                <Skeleton width="70%" height={12} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
