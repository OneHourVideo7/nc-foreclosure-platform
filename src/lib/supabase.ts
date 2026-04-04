import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Property = {
  id: number;
  county: string;
  address: string;
  parcel_id: string | null;
  sale_date: string | null;
  opening_bid: number | null;
  current_bid: number | null;
  close_date: string | null;
  property_type: string | null;
  court_file: string | null;
  our_file: string | null;
  sale_status: string | null;
  source: string;
  owner_name: string | null;
  state: string;
  latitude: number | null;
  longitude: number | null;
  assessed_value: number | null;
  acreage: number | null;
  year_built: number | null;
  zoning: string | null;
  created_at: string;
  updated_at: string;
};
