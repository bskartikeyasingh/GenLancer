import { createClient } from '@supabase/supabase-js';

// Environment variables configured via Vite (.env or environment)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mjousyabcftwlbaegbaq.supabase.co';
// Never hardcode or fallback to private Gemini API keys
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Detect if a syntactically valid JWT anon key is configured
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseAnonKey.startsWith('eyJ')
);

// Fallback to a non-crashing mock/stub client if unconfigured so components don't crash on boot
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient(
      supabaseUrl,
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.unconfigured-placeholder'
    );
