'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// 共用函式：建立帶有 Cookie 的 Supabase 伺服器端客戶端
function getClient() {
  const cookieStore = cookies()
  return createServerClient(
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
}

// 建立新的選舉
export async function createElection(formData) {
  const supabase = getClient()
  const name = formData.get('name')
  const type = formData.get('type')
  const start_time = formData.get('start_time')
  const end_time = formData.get('end_time')
  const threshold = Number(formData.get('threshold'))

  const { error } = await supabase.from('elections').insert({
    name,
    type,
    start_time,
    end_time,
    threshold,
  })

  if (error) {
    return { error: error.message }
  }
  return { success: true }
}

// 更新未開始的選舉
export async function updateElection(formData) {
  const supabase = getClient()
  const id = formData.get('id')
  const name = formData.get('name')
  const type = formData.get('type')
  const start_time = formData.get('start_time')
  const end_time = formData.get('end_time')
  const threshold = Number(formData.get('threshold'))

  const { error } = await supabase
    .from('elections')
    .update({ name, type, start_time, end_time, threshold })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }
  return { success: true }
}

// 新增候選人
export async function addCandidate(formData) {
  const supabase = getClient()
  const election_id = formData.get('election_id')
  const name = formData.get('name')

  const { error } = await supabase.from('candidates').insert({
    election_id,
    name,
  })

  if (error) {
    return { error: error.message }
  }
  return { success: true }
}

// 移除候選人
export async function removeCandidate(formData) {
  const supabase = getClient()
  const id = formData.get('id')

  const { error } = await supabase.from('candidates').delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }
  return { success: true }
}
