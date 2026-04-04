"use client";

import { Property } from "@/lib/supabase";
import {
  PROPERTY_TYPE_COLORS,
  DEFAULT_PIN_COLOR,
  SOURCE_COLORS,
  getGISLink,
} from "@/lib/constants";

type Props = {
  property: Property;
  onClose: () => void;
  onUpgrade: () => void;
};

function formatCurrency(n: number | null): string {
  if (n == null) return "—";
  return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

function formatDate(d: string | null): string {
  if (!d) return "Not set";
  try {
    return new Date(d).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return d;
  }
}

export default function PropertyDetail({ property: p, onClose, onUpgrade }: Props) {
  const typeColor = p.property_type
    ? PROPERTY_TYPE_COLORS[p.property_type] || DEFAULT_PIN_COLOR
    : DEFAULT_PIN_COLOR;
  const sourceColor = SOURCE_COLORS[p.source] || "#6b7280";
  const gisLink = getGISLink(p.county, p.parcel_id);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col overflow-hidden animate-slide-in">
        {/* Header */}
        <div className="p-5 border-b border-slate-200">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold font-display text-slate-900 leading-tight">
                {p.address}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {p.county} County, NC
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="4" x2="14" y2="14" />
                <line x1="14" y1="4" x2="4" y2="14" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-2 mt-3">
            {p.property_type && (
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                style={{
                  color: typeColor,
                  backgroundColor: typeColor + "15",
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: typeColor }}
                />
                {p.property_type}
              </span>
            )}
            <span
              className="source-badge"
              style={{
                color: sourceColor,
                backgroundColor: sourceColor + "15",
              }}
            >
              {p.source}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Bids */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-50 rounded-xl p-3.5">
              <div className="text-[10px] uppercase tracking-wider text-emerald-600 font-semibold">
                Opening Bid
              </div>
              <div className="text-xl font-bold text-emerald-800 mt-1 font-display">
                {formatCurrency(p.opening_bid)}
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3.5">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                Current Bid
              </div>
              <div className="text-xl font-bold text-slate-800 mt-1 font-display">
                {formatCurrency(p.current_bid)}
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-2.5">
            <h3 className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Sale Information
            </h3>
            <div className="bg-slate-50 rounded-xl p-3.5 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Sale Date</span>
                <span className="font-medium text-slate-900">{formatDate(p.sale_date)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Close Date</span>
                <span className="font-medium text-slate-900">{formatDate(p.close_date)}</span>
              </div>
              {p.sale_status && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Status</span>
                  <span className="font-medium text-slate-900">{p.sale_status}</span>
                </div>
              )}
            </div>
          </div>

          {/* Court Info */}
          <div className="space-y-2.5">
            <h3 className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Court & Parcel
            </h3>
            <div className="bg-slate-50 rounded-xl p-3.5 space-y-2">
              {p.parcel_id && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Parcel #</span>
                  <span className="font-mono text-xs font-medium text-slate-900">
                    {p.parcel_id}
                  </span>
                </div>
              )}
              {p.court_file && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Court File</span>
                  <span className="font-mono text-xs font-medium text-slate-900">
                    {p.court_file}
                  </span>
                </div>
              )}
              {p.our_file && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Our File</span>
                  <span className="font-medium text-slate-900">{p.our_file}</span>
                </div>
              )}
            </div>
          </div>

          {/* GIS Link */}
          {gisLink !== "#" && (
            <a
              href={gisLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-blue-50 text-blue-700 rounded-xl text-sm font-semibold hover:bg-blue-100 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="2" width="12" height="12" rx="2" />
                <path d="M6 2v12M2 8h12" />
              </svg>
              Open County GIS Portal
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 9l6-6M5 3h4v4" />
              </svg>
            </a>
          )}

          {/* Premium data teaser */}
          <div className="border border-dashed border-amber-300 bg-amber-50/50 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="#d97706">
                  <path d="M8 1l2.5 5 5.5.8-4 3.9.9 5.3L8 13.3 3.1 16l.9-5.3-4-3.9 5.5-.8z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-800">
                  Unlock premium data
                </p>
                <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                  Get owner names, assessed values, acreage, zoning, and more with a Starter or Pro subscription.
                </p>
                <button
                  onClick={onUpgrade}
                  className="mt-2.5 px-3 py-1.5 bg-amber-600 text-white text-xs font-semibold rounded-lg hover:bg-amber-700 transition-colors"
                >
                  View Plans →
                </button>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes slide-in {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
          .animate-slide-in {
            animation: slide-in 0.3s ease-out;
          }
        `}</style>
      </div>
    </>
  );
}
