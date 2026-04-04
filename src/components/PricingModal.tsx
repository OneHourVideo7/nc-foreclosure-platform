"use client";

import { SUBSCRIPTION_TIERS } from "@/lib/constants";

type Props = {
  onClose: () => void;
};

export default function PricingModal({ onClose }: Props) {
  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 pb-4 border-b border-slate-100">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold font-display text-slate-900">
                  Choose Your Plan
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Unlock premium foreclosure data to find better deals
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="4" y1="4" x2="14" y2="14" />
                  <line x1="14" y1="4" x2="4" y2="14" />
                </svg>
              </button>
            </div>
          </div>

          {/* Tiers */}
          <div className="p-6 grid md:grid-cols-3 gap-4">
            {(["free", "starter", "pro"] as const).map((key) => {
              const tier = SUBSCRIPTION_TIERS[key];
              const isPopular = key === "starter";

              return (
                <div
                  key={key}
                  className={`relative rounded-xl border-2 p-5 flex flex-col ${
                    isPopular
                      ? "border-emerald-500 shadow-lg shadow-emerald-500/10"
                      : "border-slate-200"
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-emerald-500 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                      Most Popular
                    </div>
                  )}

                  <h3 className="text-lg font-bold font-display text-slate-900">
                    {tier.name}
                  </h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-bold font-display text-slate-900">
                      ${tier.price}
                    </span>
                    {tier.price > 0 && (
                      <span className="text-sm text-slate-500">/month</span>
                    )}
                  </div>

                  <ul className="mt-4 space-y-2 flex-1">
                    {tier.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <svg
                          className="w-4 h-4 mt-0.5 shrink-0"
                          viewBox="0 0 16 16"
                          fill={isPopular ? "#16a34a" : "#94a3b8"}
                        >
                          <path d="M6.5 12.5l-4-4 1.4-1.4 2.6 2.6 5.6-5.6 1.4 1.4z" />
                        </svg>
                        <span className="text-slate-600">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`mt-5 w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                      isPopular
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : key === "free"
                        ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        : "bg-slate-900 text-white hover:bg-slate-800"
                    }`}
                  >
                    {key === "free" ? "Current Plan" : "Coming Soon"}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="px-6 pb-6 text-center">
            <p className="text-xs text-slate-400">
              Stripe payment integration coming soon. All plans include 14-day free trial.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
