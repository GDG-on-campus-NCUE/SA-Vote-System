'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

// 角色管理頁面，可將一般使用者提升為 admin
export default function UsersPage() {
  const [userId, setUserId] = useState('')
  const [role, setRole] = useState('admin')
  const [message, setMessage] = useState('')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // 呼叫 Edge Function 以更新使用者角色
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/set-user-role`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        },
        body: JSON.stringify({ user_id: userId, role }),
      }
    )
    const data = await res.json()
    if (res.ok) {
      setMessage('更新成功')
    } else {
      setMessage(data.error || '更新失敗')
    }
  }

  return (
    <div className="p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">角色管理</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="使用者 ID"
          className="border px-2 py-1"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border px-2 py-1"
        >
          <option value="admin">admin</option>
          <option value="user">user</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-2 py-1">指派角色</button>
      </form>
      {message && <p className="mt-2">{message}</p>}
    </div>
  )
}
