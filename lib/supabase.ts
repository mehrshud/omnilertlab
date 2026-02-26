import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || "";

// Server-side client with service role key (for API routes only)
export const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

export interface OrderRecord {
  project_type: string;
  project_name: string;
  description: string;
  budget: string;
  timeline: string;
  client_name: string;
  client_email: string;
  client_linkedin?: string;
  created_at?: string;
}

export async function insertOrder(order: OrderRecord) {
  if (!supabase) {
    console.warn("Supabase not configured — skipping order storage");
    return null;
  }

  const { data, error } = await supabase
    .from("orders")
    .insert([order])
    .select()
    .single();

  if (error) {
    console.error("Supabase insert error:", error);
    return null;
  }

  return data;
}
