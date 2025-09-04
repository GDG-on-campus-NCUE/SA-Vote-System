'use server'

import { supabaseServer } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export async function castVoteAction(formData) {
  const electionId = formData.get('electionId')
  const candidateId = formData.get('candidateId')

  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        // 取得指定 Cookie 的值
        get(name) {
          return cookieStore.get(name)?.value
        },
        // 設定或更新 Cookie
        set(name, value, options) {
          cookieStore.set({ name, value, ...options })
        },
        // 移除指定 Cookie
        remove(name, options) {
          cookieStore.delete({ name, ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to vote.' }
  }

  // 資料庫中的「cast_vote」函式會處理檢查使用者是否已投票
  // 並確認選舉是否仍在進行。此函式需要 student_id，假設存在於使用者的
  // metadata 中。提示中提到透過觸發器由 auth.users 建立 users 資料表列，
  // 因此我們假定 student_id 可從 user_metadata 取得。
  const { data, error } = await supabaseServer.rpc('cast_vote', {
    p_election_id: electionId,
    p_candidate_id: candidateId,
    p_user_id: user.id
  })

  if (error) {
    console.error('Error casting vote:', error)
    // 提供較為友善的錯誤訊息
    if (error.message.includes('ALREADY_VOTED')) {
        return { error: '您已經在此選舉中投過票。' }
    }
    if (error.message.includes('ELECTION_ENDED')) {
        return { error: '此選舉已經結束。' }
    }
    return { error: '發生預期外的錯誤，請再試一次。' }
  }

  return { success: 'Your vote has been cast successfully!' }
}
