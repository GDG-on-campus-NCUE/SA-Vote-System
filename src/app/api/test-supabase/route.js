import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function GET() {
  try {
    // Perform a simple query to test the connection.
    // We query a non-existent table to see if we get a proper response from Supabase.
    const { data, error } = await supabaseServer.from('test_table_for_connection').select('*').limit(1);

    // PostgREST error 'PGRST205' (Not Found) indicates the table doesn't exist, which is expected.
    // This confirms the connection and authentication are working.
    if (error && error.code !== 'PGRST205') {
      console.error('Supabase connection test error:', error);
      return NextResponse.json({ status: 'error', message: 'Failed to connect to Supabase.', error: error.message }, { status: 500 });
    }

    // If we get here, it means we successfully communicated with the Supabase API.
    return NextResponse.json({ status: 'ok', message: 'Supabase connection successful.' });
  } catch (e) {
    console.error('Supabase connection test exception:', e);
    return NextResponse.json({ status: 'error', message: 'An exception occurred while testing Supabase connection.', error: e.message }, { status: 500 });
  }
}
