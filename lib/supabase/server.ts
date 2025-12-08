import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _supabaseAdmin: SupabaseClient | null = null;

// Server-side Supabase client with service role key (full access)
export function createServerSupabaseClient(): SupabaseClient {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error('Missing Supabase environment variables');
    }

    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}

// Lazy-loaded singleton for Supabase admin client
export const supabaseAdmin = {
    get client(): SupabaseClient {
        if (!_supabaseAdmin) {
            _supabaseAdmin = createServerSupabaseClient();
        }
        return _supabaseAdmin;
    },
    from(table: string) {
        return this.client.from(table);
    },
    storage: {
        from(bucket: string) {
            if (!_supabaseAdmin) {
                _supabaseAdmin = createServerSupabaseClient();
            }
            return _supabaseAdmin.storage.from(bucket);
        }
    },
    rpc(fn: string, params: Record<string, unknown>) {
        return this.client.rpc(fn, params);
    }
};
