#!/usr/bin/env node

/**
 * Seed script — loads property data from seed-data.json into Supabase.
 *
 * Usage:
 *   1. Copy .env.example to .env and fill in your keys
 *   2. Run: node scripts/seed.mjs
 *
 * Requires: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Load .env manually (no dotenv dependency needed in Node 20+)
const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");

// Try to load .env
try {
  const envFile = readFileSync(join(rootDir, ".env"), "utf-8");
  for (const line of envFile.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) {
      process.env[key] = val;
    }
  }
} catch {
  // .env might not exist; that's okay if env vars are set elsewhere
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "❌ Missing env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env"
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// Load seed data
const seedPath = join(rootDir, "seed-data.json");
const rawData = JSON.parse(readFileSync(seedPath, "utf-8"));

console.log(`📦 Loaded ${rawData.length} properties from seed-data.json`);

// Transform for Supabase insert (remove the local id, let DB auto-increment)
const records = rawData.map((p) => ({
  county: p.county,
  address: p.address,
  parcel_id: p.parcel_id || null,
  sale_date: p.sale_date || null,
  opening_bid: p.opening_bid || null,
  current_bid: p.current_bid || null,
  close_date: p.close_date || null,
  property_type: p.property_type || null,
  court_file: p.court_file || null,
  our_file: p.our_file || null,
  sale_status: p.sale_status || null,
  source: p.source || "Kania Law Firm",
  owner_name: p.owner_name || null,
  state: p.state || "NC",
  latitude: null,
  longitude: null,
  assessed_value: null,
  acreage: null,
  year_built: null,
  zoning: null,
}));

async function seed() {
  console.log("🗑️  Clearing existing properties…");
  const { error: deleteError } = await supabase
    .from("properties")
    .delete()
    .neq("id", 0); // delete all rows

  if (deleteError) {
    console.error("❌ Failed to clear table:", deleteError.message);
    process.exit(1);
  }

  // Insert in batches of 50
  const BATCH_SIZE = 50;
  let inserted = 0;

  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE);
    const { data, error } = await supabase
      .from("properties")
      .insert(batch)
      .select("id");

    if (error) {
      console.error(`❌ Batch ${i / BATCH_SIZE + 1} failed:`, error.message);
      console.error("   First record in batch:", JSON.stringify(batch[0], null, 2));
      process.exit(1);
    }

    inserted += data.length;
    console.log(
      `  ✅ Batch ${Math.floor(i / BATCH_SIZE) + 1}: inserted ${data.length} (${inserted}/${records.length})`
    );
  }

  // Log the scrape run
  await supabase.from("scrape_runs").insert({
    source: "seed-script",
    status: "completed",
    record_count: inserted,
    completed_at: new Date().toISOString(),
    metadata: { file: "seed-data.json", version: "2026-04-01_Revised_rev2" },
  });

  console.log(`\n🎉 Done! Inserted ${inserted} properties into Supabase.`);

  // Quick verification
  const { count } = await supabase
    .from("properties")
    .select("*", { count: "exact", head: true });
  console.log(`📊 Verification: ${count} rows in properties table`);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
