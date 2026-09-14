import { METRICS } from '@/constants/home';

export function MetricsSection() {
  return (
    <section className="border-y border-black/10 bg-white/60 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 divide-y divide-black/10 text-center md:grid-cols-4 md:divide-x md:divide-y-0">
          {METRICS.map((metric) => (
            <div key={metric.label} className="pt-4 md:pt-0">
              <div className="text-brand-dark text-3xl font-black sm:text-4xl lg:text-5xl">
                {metric.value}
              </div>
              <div className="text-brand-muted mt-1.5 text-xs font-medium sm:text-sm">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
