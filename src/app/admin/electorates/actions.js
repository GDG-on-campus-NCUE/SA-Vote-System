'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// 批次匯入選舉人名冊
export async function importElectorates(formData) {
  const list = (formData.get('students') || '')
    .split(/\n|,|\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((student_id) => ({ student_id }))

  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name, options) {
          cookieStore.delete({ name, ...options })
        },
      },
    }
  )

  const { error } = await supabase.from('electorates').insert(list)

  if (error) {
    return { error: error.message }
  }
  return { success: true }
}
