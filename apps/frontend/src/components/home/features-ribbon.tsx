import { FEATURES } from '@/constants/home';

export function FeaturesRibbon() {
  return (
    <section className="border-y border-black/10 bg-white py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="flex items-center gap-4 rounded-xl p-3">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white shadow-sm ${feature.color}`}
                >
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-brand-dark">{feature.title}</h4>
                  <p className="text-xs text-brand-muted">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
