import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import * as process from 'process';

@Injectable()
export class SupabaseService {
  getClient() {
    return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
      auth: {
        persistSession: false,
      },
    });
  }
}
