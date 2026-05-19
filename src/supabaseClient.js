import { createClient } from '@supabase/supabase-js';

// 1. Core connection endpoints for your dedicated Supabase backend instance
const supabaseUrl = 'https://jncbcvuoaiwxgmogjrof.supabase.co';

// 2. Client-side safe public anonymity token (Anon Key)
// Note: Safe for client distribution; table security is enforced via Row-Level Security (RLS) rules.
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuY2JjdnVvYWl3eGdtb2dqcm9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwNzM5MzksImV4cCI6MjA5MzY0OTkzOX0.onxEZHpgpALvcV47hJL5UpgIvz0_r3bmuxVueWeSS48';

// 3. Initialize and export a single persistent instance of the database client orchestration channel
export const supabase = createClient(supabaseUrl, supabaseKey);
