import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://drzmymddimysftxmxyeh.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
export const subapase = createClient(supabaseUrl, supabaseKey)