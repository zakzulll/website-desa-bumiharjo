import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    // Memaksa Supabase menggunakan sessionStorage. 
    // Pengecekan 'typeof window' wajib ada agar tidak terjadi error saat Next.js melakukan rendering di server.
    storage: typeof window !== 'undefined' ? window.sessionStorage : undefined,
  },
});
