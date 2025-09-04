import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import React from 'react'

// 管理後台的版面配置，僅允許 superadmin 進入
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // 建立與 Supabase 的伺服器端連線，並帶入使用者的 Cookie
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

  // 取得目前登入的使用者並檢查權限
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 若未登入或角色不是 superadmin，則拒絕存取
  if (!user || user.app_metadata?.role !== 'superadmin') {
    redirect('/')
  }

  return <>{children}</>
}

