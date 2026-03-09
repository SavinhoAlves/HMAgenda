import { createClient } from '@supabase/supabase-js';

// Como master user, utilize suas chaves do dashboard do Supabase
const supabaseUrl = 'https://yydcwtibjpdidneepnfa.supabase.co';
const supabaseAnonKey = 'sb_publishable_9-crSj9Pgk48QAk38g6-9w_6bFcoON_';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);