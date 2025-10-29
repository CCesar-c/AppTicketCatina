import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://drzmymddimysftxmxyeh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyem15bWRkaW15c2Z0eG14eWVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3NTc1NzksImV4cCI6MjA3NzMzMzU3OX0.O2ANNhWUEzUCRR_4X0qpzNflUiNeyJLjiUrlgRFAO40'
export const supabase = createClient(supabaseUrl, supabaseKey)