"use client";

import { Property } from "@/lib/supabase";
import { SOURCE_COLORS, PROPERTY_TYPE_COLORS, DEFAULT_PIN_COLOR } from "@/lib/constants";

type SidebarProps = {
  properties: Property[];
  loading: boolean;
  counties: string[];
  types: string[];
  sources: string[];
  countyFilter: string;
  typeFilter: string;
  sourceFilter: string;
  searchQuery: string;
  onCountyChange: (v: string) => void;
  onTypeChange: (v: string) => void;
  onSourceChange: (v: string) => void;
  onSearchChange: (v: string) => void;
  onSelectProperty: (p: Property) => void;
  selectedProperty: Property | null;
};

function formatCurrency(n: number | null): string {
  if (n == null) return "—";
  return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function formatDate(d: string | null): string {
  if (!d) return "Not set";
  try {
    const date = new Date(d);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return d;
  }
}

export default function Sidebar({
  properties,
  loading,
  counties,
  types,
  sources,
  countyFilter,
  typeFilter,
  sourceFilter,
  searchQuery,
  onCountyChange,
  onTypeChange,
  onSourceChange,
  onSearchChange,
  onSelectProperty,
  selectedProperty,
}: SidebarProps) {
  return (
    <aside className="w-[360px] bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-hidden">
      {/* Search */}
      <div className="p-3 border-b border-slate-100">
        <div className="relative">
          <svg
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="7" cy="7" r="5" />
            <line x1="11" y1="11" x2="14" y2="14" />
          </svg>
          <input
            type="text"
            placeholder="Search address, parcel, county, owner…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="p-3 border-b border-slate-100 flex flex-col gap-2">
        <div className="flex gap-2">
          <select
            value={countyFilter}
            onChange={(e) => onCountyChange(e.target.value)}
            className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          >
            <option value="">All Counties</option>
            {counties.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => onTypeChange(e.target.value)}
            className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          >
            <option value="">All Types</option>
            {types.map((t) => (
              <option key={t} value={t!}>{t}</option>
            ))}
          </select>
        </div>
        <select
          value={sourceFilter}
          onChange={(e) => onSourceChange(e.target.value)}
          className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
        >
          <option value="">All Sources</option>
          {sources.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <div className="px-3 py-2 text-xs text-slate-500 border-b border-slate-100 bg-slate-50/50">
        <span className="font-semibold text-slate-700">{properties.length}</span> properties found
      </div>

      {/* Property list */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-3 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="skeleton h-4 w-3/4" />
                <div className="skeleton h-3 w-1/2" />
                <div className="skeleton h-3 w-1/3" />
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            No properties match your filters.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {properties.map((p) => {
              const isSelected = selectedProperty?.id === p.id;
              const typeColor = p.property_type
                ? PROPERTY_TYPE_COLORS[p.property_type] || DEFAULT_PIN_COLOR
                : DEFAULT_PIN_COLOR;
              const sourceColor = SOURCE_COLORS[p.source] || "#6b7280";

              return (
                <button
                  key={p.id}
                  onClick={() => onSelectProperty(p)}
                  className={`property-card w-full text-left px-3 py-2.5 transition-colors ${
                    isSelected ? "bg-emerald-50 border-l-2 border-emerald-500" : "hover:bg-slate-50 border-l-2 border-transparent"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {p.address}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {p.county} County
                        {p.parcel_id && <span className="text-slate-400"> · #{p.parcel_id}</span>}
                      </p>
                    </div>
                    <span
                      className="source-badge shrink-0 mt-0.5"
                      style={{
                        color: sourceColor,
                        backgroundColor: sourceColor + "15",
                      }}
                    >
                      {p.source === "Kania Law Firm" ? "Kania" : p.source}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-3 text-xs">
                    {p.property_type && (
                      <span className="flex items-center gap-1">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: typeColor }}
                        />
                        <span className="text-slate-600">{p.property_type}</span>
                      </span>
                    )}
                    {p.opening_bid && (
                      <span className="text-emerald-700 font-semibold">
                        {formatCurrency(p.opening_bid)}
                      </span>
                    )}
                    <span className="text-slate-400">{formatDate(p.sale_date)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
