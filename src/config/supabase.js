const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Environment variable SUPABASE_URL dan SUPABASE_ANON_KEY wajib diisi. ' +
      'Salin file .env.example menjadi .env lalu isi kredensial Supabase Anda.'
  );
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;