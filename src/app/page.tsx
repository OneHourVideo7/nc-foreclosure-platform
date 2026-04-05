"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import PropertyDetail from "@/components/PropertyDetail";
import PricingModal from "@/components/PricingModal";
import type { Property } from "@/lib/supabase";
import type { ThemeKey } from "@/lib/constants";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filtered, setFiltered] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showPricing, setShowPricing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState<ThemeKey>("light");

  // Filters
  const [countyFilter, setCountyFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (countyFilter) params.set("county", countyFilter);
      if (typeFilter) params.set("property_type", typeFilter);
      if (sourceFilter) params.set("source", sourceFilter);
      if (searchQuery) params.set("search", searchQuery);

      const res = await fetch(`/api/properties?${params.toString()}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setProperties(data);
        setFiltered(data);
      }
    } catch (err) {
      console.error("Failed to fetch properties:", err);
    } finally {
      setLoading(false);
    }
  }, [countyFilter, typeFilter, sourceFilter, searchQuery]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const counties = [...new Set(properties.map((p) => p.county))].sort();
  const types = [...new Set(properties.map((p) => p.property_type).filter((t): t is string => Boolean(t)))].sort();
  const sources = [...new Set(properties.map((p) => p.source))].sort();

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header
        theme={theme}
        onThemeChange={setTheme}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
        propertyCount={filtered.length}
        onShowPricing={() => setShowPricing(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        {sidebarOpen && (
          <Sidebar
            properties={filtered}
            loading={loading}
            counties={counties}
            types={types}
            sources={sources}
            countyFilter={countyFilter}
            typeFilter={typeFilter}
            sourceFilter={sourceFilter}
            searchQuery={searchQuery}
            onCountyChange={setCountyFilter}
            onTypeChange={setTypeFilter}
            onSourceChange={setSourceFilter}
            onSearchChange={setSearchQuery}
            onSelectProperty={setSelectedProperty}
            selectedProperty={selectedProperty}
          />
        )}

        <div className="flex-1 relative">
          <MapView
            properties={filtered}
            theme={theme}
            selectedProperty={selectedProperty}
            onSelectProperty={setSelectedProperty}
          />
        </div>
      </div>

      {selectedProperty && (
        <PropertyDetail
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onUpgrade={() => setShowPricing(true)}
        />
      )}

      {showPricing && <PricingModal onClose={() => setShowPricing(false)} />}
    </div>
  );
}
"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import PropertyDetail from "@/components/PropertyDetail";
import PricingModal from "@/components/PricingModal";
import type { Property } from "@/lib/supabase";
import type { ThemeKey } from "@/lib/constanths";

const MapView = dynamic(() => import("@/compohnents/MapView"), { ssr: false });

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filtered, setFiltered] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showPricing, setShowPricing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState<ThemeKey>("light");

  // Filters
  const [countyFilter, setCountyFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (countyFilter) params.set("county", countyFilter);
      if (typeFilter) params.set("property_type", typeFilter);
      if (sourceFilter) params.set("source", sourceFilter);
      if (searchQuery) params.set("search", searchQuery);

      const res = await fetch(`/api/properties?${params.toString()}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setProperties(data);
        setFiltered(data);
      }
    } catch (err) {
      console.error("Failed to fetch properties:", err);
    } finally {
      setLoading(false);
    }
  }, [countyFilter, typeFilter, sourceFilter, searchQuery]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const counties = [...new Set(properties.map((p) => p.county))].sort();
  const types = [...new Set(properties.map((p) => p.property_type).filter((t): t is string => Boolean(t)))].sort();
  const sources = [...new Set(properties.map((p) => p.source))].sort();

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header
        theme={theme}
        onThemeChange={setTheme}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
        propertyCount={filtered.length}
        onShowPricing={() => setShowPricing(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        {sidebarOpen && (
          <Sidebar
            properties={filtered}
            loading={loading}
            counties={counties}
            types={types}
            sources={sources}
            countyFilter={countyFilter}
            typeFilter={typeFilter}
            sourceFilter={sourceFilter}
            searchQuery={searchQuery}
            onCountyChange={setCountyFilter}
            onTypeChange={setTypeFilter}
            onSourceChange={setSourceFilter}
            onSearchChange={setSearchQuery}
            onSelectProperty={setSelectedProperty}
            selectedProperty={selectedProperty}
          />
        )}

        <div className="flex-1 relative">
          <MapView
            properties={filtered}
            theme={theme}
            selectedProperty={selectedProperty}
            onSelectProperty={setSelectedProperty}
          />
        </div>
      </div>

      {selectedProperty && (
        <PropertyDetail
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onUpgrade={() => setShowPricing(true)}
        />
      )}

      {showPricing && <PricingModal onClose={() => setShowPricing(false)} />}
    </div>
  );
}
