import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database/types';
import { EVE } from '../types/eve';
import { KnowledgeBase } from '../lib/knowledge-base';

type EVEAction = Database['public']['Tables']['eve_actions']['Row'];

// Rest of the file remains unchanged...