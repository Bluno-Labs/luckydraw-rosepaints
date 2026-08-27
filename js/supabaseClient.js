// js/supabaseClient.js

const SUPABASE_URL = "https://txqarnhnkesdpgapeatf.supabase.co/";
const SUPABASE_ANON_KEY = "sb_publishable_tTKrsdV9RoQXvQuf6wZgOg_LtUNS1Bg";

export const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);