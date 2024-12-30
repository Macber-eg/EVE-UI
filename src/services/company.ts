import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database/types';
import { CompanySchema } from '../types/company';
import { AppError } from '../utils/error-handling';

type Company = Database['public']['Tables']['companies']['Row'];
type CompanyInsert = Database['public']['Tables']['companies']['Insert'];

// Rest of the file remains unchanged...