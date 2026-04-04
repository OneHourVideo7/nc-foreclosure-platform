import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function GET(request: NextRequest) {
  const supabase = getSupabase();
  const { searchParams } = new URL(request.url);

  const county = searchParams.get("county");
  const propertyType = searchParams.get("property_type");
  const source = searchParams.get("source");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort") || "county";
  const order = searchParams.get("order") || "asc";

  let query = supabase.from("properties").select("*");

  if (county) {
    query = query.eq("county", county);
  }
  if (propertyType) {
    query = query.eq("property_type", propertyType);
  }
  if (source) {
    query = query.eq("source", source);
  }
  if (search) {
    query = query.or(
      `address.ilike.%${search}%,county.ilike.%${search}%,parcel_id.ilike.%${search}%,owner_name.ilike.%${search}%`
    );
  }

  query = query.order(sort, { ascending: order === "asc", nullsFirst: false });

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
