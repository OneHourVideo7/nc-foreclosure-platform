"use client";

import { ThemeKey, MAP_THEMES } from "@/lib/constants";

type HeaderProps = {
  theme: ThemeKey;
  onThemeChange: (t: ThemeKey) => void;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
  propertyCount: number;
  onShowPricing: () => void;
};

export default function Header({
  theme,
  onThemeChange,
  onToggleSidebar,
  sidebarOpen,
  propertyCount,
  onShowPricing,
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between z-50 shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            {sidebarOpen ? (
              <>
                <rect x="2" y="3" width="16" height="14" rx="2" />
                <line x1="7" y1="3" x2="7" y2="17" />
              </>
            ) : (
              <>
                <line x1="3" y1="5" x2="17" y2="5" />
                <line x1="3" y1="10" x2="17" y2="10" />
                <line x1="3" y1="15" x2="17" y2="15" />
              </>
            )}
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
              <path d="M8 1L2 6v8h4v-4h4v4h4V6L8 1z" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-bold font-display tracking-tight leading-none">
              NC Foreclosure Platform
            </h1>
            <p className="text-[10px] text-slate-400 leading-none mt-0.5">
              {propertyCount} properties · 26 counties
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Theme switcher */}
        <div className="hidden sm:flex items-center bg-slate-100 rounded-lg p-0.5 gap-0.5">
          {(Object.keys(MAP_THEMES) as ThemeKey[]).map((key) => (
            <button
              key={key}
              onClick={() => onThemeChange(key)}
              className={`px-2.5 py-1 text-xs rounded-md transition-all font-medium ${
                theme === key
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {MAP_THEMES[key].label}
            </button>
          ))}
        </div>

        <button
          onClick={onShowPricing}
          className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Upgrade
        </button>
      </div>
    </header>
  );
}
