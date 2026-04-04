// County GIS portal URLs
export const COUNTY_GIS_LINKS: Record<string, { url: string; type: string }> = {
  Alexander: { url: "https://gis.alexandercountync.gov", type: "ConnectGIS" },
  Alleghany: { url: "https://gis.alleghanycounty-nc.gov", type: "ConnectGIS" },
  Anson: { url: "https://anson.connectgis.com/Map.aspx", type: "ConnectGIS" },
  Ashe: { url: "https://gis.ashecountygov.com", type: "ConnectGIS" },
  Burke: { url: "https://gis.burkenc.org/defaultext.htm", type: "Burke GIS" },
  Caldwell: { url: "https://caldwell.connectgis.com/Map.aspx", type: "ConnectGIS" },
  Catawba: { url: "https://catawba.connectgis.com/Map.aspx", type: "ConnectGIS" },
  Cherokee: { url: "https://cherokee.connectgis.com/Map.aspx", type: "ConnectGIS" },
  Clay: { url: "https://clay.connectgis.com/Map.aspx", type: "ConnectGIS" },
  Cleveland: { url: "https://cleveland.connectgis.com/Map.aspx", type: "ConnectGIS" },
  Davidson: { url: "https://davidson.connectgis.com/Map.aspx", type: "ConnectGIS" },
  Davie: { url: "https://davie.connectgis.com/Map.aspx", type: "ConnectGIS" },
  Harnett: { url: "https://harnett.connectgis.com/Map.aspx", type: "ConnectGIS" },
  Lincoln: { url: "https://lincoln.connectgis.com/Map.aspx", type: "ConnectGIS" },
  Madison: { url: "https://madison.connectgis.com/Map.aspx", type: "ConnectGIS" },
  Mecklenburg: {
    url: "https://polaris3g.mecklenburgcountync.gov",
    type: "Polaris3G",
  },
  Montgomery: { url: "https://montgomery.connectgis.com/Map.aspx", type: "ConnectGIS" },
  "New Hanover": { url: "https://nhcgov.maps.arcgis.com", type: "ArcGIS" },
  Person: { url: "https://person.connectgis.com/Map.aspx", type: "ConnectGIS" },
  Polk: { url: "https://polk.connectgis.com/Map.aspx", type: "ConnectGIS" },
  Rowan: { url: "https://rowan.connectgis.com/Map.aspx", type: "ConnectGIS" },
  Rutherford: { url: "https://rutherford.connectgis.com/Map.aspx", type: "ConnectGIS" },
  Stokes: { url: "https://stokes.connectgis.com/Map.aspx", type: "ConnectGIS" },
  Surry: { url: "https://surry.connectgis.com/Map.aspx", type: "ConnectGIS" },
  Transylvania: { url: "https://transylvania.connectgis.com/Map.aspx", type: "ConnectGIS" },
  Union: { url: "https://union.connectgis.com/Map.aspx", type: "ConnectGIS" },
};

export function getGISLink(county: string, parcelId?: string | null): string {
  if (county === "Mecklenburg" && parcelId) {
    const pid = String(parcelId).replace(/\D/g, "").padStart(8, "0");
    return `https://polaris3g.mecklenburgcountync.gov/pid/${pid}`;
  }
  const entry = COUNTY_GIS_LINKS[county];
  return entry?.url ?? "#";
}

// Map themes
export type ThemeKey = "light" | "dark" | "midnight" | "nature";

export const MAP_THEMES: Record<ThemeKey, { label: string; tile: string; attribution: string }> = {
  light: {
    label: "Light",
    tile: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
  },
  dark: {
    label: "Dark",
    tile: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
  },
  midnight: {
    label: "Midnight",
    tile: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia</a>',
  },
  nature: {
    label: "Nature",
    tile: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
  },
};

// Property type colors for map pins
export const PROPERTY_TYPE_COLORS: Record<string, string> = {
  "Residential Home": "#16a34a",
  "Residential Vacant Lot": "#2563eb",
  "Commercial Improved": "#d97706",
  "Commercial Vacant Lot": "#ea580c",
  Acreage: "#7c3aed",
  Mixed: "#db2777",
};

export const DEFAULT_PIN_COLOR = "#6b7280";

// Source badge colors
export const SOURCE_COLORS: Record<string, string> = {
  "Kania Law Firm": "#2563eb",
  RBCWB: "#7c3aed",
  "County Attorney": "#dc2626",
};

// Subscription tiers
export const SUBSCRIPTION_TIERS = {
  free: {
    name: "Free",
    price: 0,
    features: ["Address & location", "Opening bid", "Sale date", "Property type", "Map view"],
  },
  starter: {
    name: "Starter",
    price: 29,
    features: [
      "Everything in Free",
      "Owner names",
      "Assessed values",
      "Acreage & zoning",
      "GIS portal links",
      "Email alerts",
    ],
  },
  pro: {
    name: "Pro",
    price: 79,
    features: [
      "Everything in Starter",
      "CSV export",
      "Priority alerts",
      "Bulk data access",
      "API access (coming soon)",
    ],
  },
};
