import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lymocsphywduxncdssgk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5bW9jc3BoeXdkdXhuY2Rzc2drIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3NjU0NDksImV4cCI6MjA2MTM0MTQ0OX0.SmB0JhINsPxF2yQj2LxAxMzyqtrS6nQSadlHR2VInFQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
