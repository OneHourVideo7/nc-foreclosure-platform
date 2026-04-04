"use client";

import { useEffect, useRef, useMemo } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import { Property } from "@/lib/supabase";
import {
  ThemeKey,
  MAP_THEMES,
  PROPERTY_TYPE_COLORS,
  DEFAULT_PIN_COLOR,
  SOURCE_COLORS,
} from "@/lib/constants";
import { getGISLink } from "@/lib/constants";

type MapViewProps = {
  properties: Property[];
  theme: ThemeKey;
  selectedProperty: Property | null;
  onSelectProperty: (p: Property) => void;
};

// NC center coordinates
const NC_CENTER: [number, number] = [35.55, -80.0];
const NC_ZOOM = 7;

// Approximate county center coordinates for properties without lat/lng
const COUNTY_COORDS: Record<string, [number, number]> = {
  Alexander: [35.92, -81.18],
  Alleghany: [36.49, -81.13],
  Anson: [35.0, -80.1],
  Ashe: [36.45, -81.5],
  Burke: [35.75, -81.7],
  Caldwell: [35.95, -81.55],
  Catawba: [35.67, -81.22],
  Cherokee: [35.15, -84.05],
  Clay: [35.05, -83.75],
  Cleveland: [35.33, -81.55],
  Davidson: [35.8, -80.2],
  Davie: [35.82, -80.55],
  Harnett: [35.37, -78.87],
  Lincoln: [35.47, -81.23],
  Madison: [35.85, -82.7],
  Mecklenburg: [35.23, -80.84],
  Montgomery: [35.33, -79.92],
  "New Hanover": [34.2, -77.87],
  Person: [36.4, -78.97],
  Polk: [35.27, -82.17],
  Rowan: [35.63, -80.52],
  Rutherford: [35.37, -81.92],
  Stokes: [36.4, -80.23],
  Surry: [36.42, -80.68],
  Transylvania: [35.2, -82.8],
  Union: [34.97, -80.53],
};

function jitter(base: number, index: number): number {
  // Spread markers slightly so they don't stack
  const offset = ((index * 7 + 13) % 100) / 100 * 0.06 - 0.03;
  return base + offset;
}

function formatCurrency(n: number | null): string {
  if (n == null) return "—";
  return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function formatDate(d: string | null): string {
  if (!d) return "Not set";
  try {
    return new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return d;
  }
}

// Theme updater sub-component
function ThemeUpdater({ theme }: { theme: ThemeKey }) {
  const map = useMap();
  const tileRef = useRef<L.TileLayer | null>(null);

  useEffect(() => {
    if (tileRef.current) {
      map.removeLayer(tileRef.current);
    }
    const t = MAP_THEMES[theme];
    tileRef.current = L.tileLayer(t.tile, { attribution: t.attribution }).addTo(map);
  }, [theme, map]);

  return null;
}

// Fly to selected property
function FlyToSelected({ property }: { property: Property | null }) {
  const map = useMap();
  useEffect(() => {
    if (property) {
      const coords = property.latitude && property.longitude
        ? [property.latitude, property.longitude]
        : COUNTY_COORDS[property.county] || NC_CENTER;
      map.flyTo(coords as [number, number], 12, { duration: 0.8 });
    }
  }, [property, map]);
  return null;
}

export default function MapView({
  properties,
  theme,
  selectedProperty,
  onSelectProperty,
}: MapViewProps) {
  // Assign positions to properties
  const positioned = useMemo(() => {
    const countyCounters: Record<string, number> = {};
    return properties.map((p) => {
      if (p.latitude && p.longitude) {
        return { ...p, lat: p.latitude, lng: p.longitude };
      }
      const county = p.county || "Mecklenburg";
      countyCounters[county] = (countyCounters[county] || 0) + 1;
      const base = COUNTY_COORDS[county] || NC_CENTER;
      return {
        ...p,
        lat: jitter(base[0], countyCounters[county]),
        lng: jitter(base[1], countyCounters[county]),
      };
    });
  }, [properties]);

  return (
    <MapContainer
      center={NC_CENTER}
      zoom={NC_ZOOM}
      className="w-full h-full z-0"
      zoomControl={true}
      attributionControl={true}
    >
      <ThemeUpdater theme={theme} />
      <FlyToSelected property={selectedProperty} />

      {positioned.map((p) => {
        const color = p.property_type
          ? PROPERTY_TYPE_COLORS[p.property_type] || DEFAULT_PIN_COLOR
          : DEFAULT_PIN_COLOR;
        const isSelected = selectedProperty?.id === p.id;
        const sourceColor = SOURCE_COLORS[p.source] || "#6b7280";
        const gisLink = getGISLink(p.county, p.parcel_id);

        return (
          <CircleMarker
            key={p.id}
            center={[p.lat, p.lng]}
            radius={isSelected ? 10 : 7}
            pathOptions={{
              color: isSelected ? "#ffffff" : color,
              fillColor: color,
              fillOpacity: isSelected ? 1 : 0.8,
              weight: isSelected ? 3 : 1.5,
            }}
            eventHandlers={{
              click: () => onSelectProperty(p),
            }}
          >
            <Popup>
              <div style={{ fontFamily: "var(--font-body)", minWidth: 260 }}>
                <div
                  style={{
                    padding: "12px 14px",
                    borderBottom: "1px solid #e2e8f0",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                      gap: 8,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: 14,
                          color: "#0f172a",
                          lineHeight: 1.3,
                        }}
                      >
                        {p.address}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "#64748b",
                          marginTop: 2,
                        }}
                      >
                        {p.county} County, NC
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: sourceColor,
                        background: sourceColor + "15",
                        padding: "2px 6px",
                        borderRadius: 99,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {p.source === "Kania Law Firm" ? "Kania" : p.source}
                    </span>
                  </div>
                </div>
                <div style={{ padding: "10px 14px" }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "6px 16px",
                      fontSize: 12,
                    }}
                  >
                    <div>
                      <div style={{ color: "#94a3b8", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        Opening Bid
                      </div>
                      <div style={{ fontWeight: 600, color: "#166534" }}>
                        {formatCurrency(p.opening_bid)}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: "#94a3b8", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        Current Bid
                      </div>
                      <div style={{ fontWeight: 600, color: "#0f172a" }}>
                        {formatCurrency(p.current_bid)}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: "#94a3b8", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        Sale Date
                      </div>
                      <div style={{ color: "#334155" }}>{formatDate(p.sale_date)}</div>
                    </div>
                    <div>
                      <div style={{ color: "#94a3b8", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        Type
                      </div>
                      <div style={{ color: "#334155", display: "flex", alignItems: "center", gap: 4 }}>
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: color,
                            display: "inline-block",
                          }}
                        />
                        {p.property_type || "—"}
                      </div>
                    </div>
                  </div>
                  {p.parcel_id && (
                    <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #f1f5f9" }}>
                      <div style={{ fontSize: 11, color: "#64748b" }}>
                        Parcel: {p.parcel_id}
                        {gisLink !== "#" && (
                          <>
                            {" · "}
                            <a
                              href={gisLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: "#2563eb", textDecoration: "underline" }}
                            >
                              GIS Lookup ↗
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
