import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NC Foreclosure Platform — Find Investment Properties",
  description:
    "Search foreclosure properties across 26 North Carolina counties. Interactive map, sale dates, bid amounts, and county GIS links.",
  openGraph: {
    title: "NC Foreclosure Platform",
    description: "Find foreclosure investment properties across North Carolina",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
