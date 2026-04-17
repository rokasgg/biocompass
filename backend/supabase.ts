import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://twuxrlijnjmohhqqlwpu.supabase.co'
const supabaseAnonKey = 'sb_publishable_vQoYkgbwOje3Efr0no4k-A_czZwzGbz'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
})