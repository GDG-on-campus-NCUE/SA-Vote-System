import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import React from 'react'
import { createElection, updateElection, addCandidate, removeCandidate } from './actions'

// 選舉與候選人管理頁面
export default async function ElectionsPage() {
  // 取得所有選舉與其候選人
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

  const { data: elections } = await supabase
    .from('elections')
    .select('*, candidates(*)')
    .order('id')

  return (
    <div className="flex flex-col gap-6 p-4">
      <h1 className="text-2xl font-bold">選舉管理</h1>
      {/* 建立新選舉的表單 */}
      <form action={createElection} className="flex flex-col gap-2 max-w-md">
        <input name="name" placeholder="選舉名稱" className="border px-2 py-1" />
        <input name="type" placeholder="類型" className="border px-2 py-1" />
        <input type="datetime-local" name="start_time" className="border px-2 py-1" />
        <input type="datetime-local" name="end_time" className="border px-2 py-1" />
        <input name="threshold" placeholder="門檻" className="border px-2 py-1" />
        <button type="submit" className="bg-green-600 text-white px-2 py-1">建立選舉</button>
      </form>

      {elections?.map((e) => {
        const canEdit = e.start_time ? new Date(e.start_time) > new Date() : true
        return (
          <div key={e.id} className="border p-4 flex flex-col gap-2">
            <h2 className="font-semibold">{e.name}</h2>
            {canEdit && (
              // 只有尚未開始的選舉可以編輯
              <form action={updateElection} className="flex flex-col gap-2">
                <input type="hidden" name="id" value={e.id} />
                <input name="name" defaultValue={e.name} className="border px-2 py-1" />
                <input name="type" defaultValue={e.type} className="border px-2 py-1" />
                <input type="datetime-local" name="start_time" defaultValue={e.start_time?.slice(0,16)} className="border px-2 py-1" />
                <input type="datetime-local" name="end_time" defaultValue={e.end_time?.slice(0,16)} className="border px-2 py-1" />
                <input name="threshold" defaultValue={e.threshold} className="border px-2 py-1" />
                <button type="submit" className="bg-blue-600 text-white px-2 py-1">更新</button>
              </form>
            )}

            <div className="mt-2">
              <h3 className="font-medium">候選人</h3>
              <ul className="list-disc pl-5">
                {e.candidates?.map((c) => (
                  <li key={c.id} className="flex items-center gap-2">
                    <span>{c.name}</span>
                    <form action={removeCandidate}>
                      <input type="hidden" name="id" value={c.id} />
                      <button type="submit" className="text-red-600">移除</button>
                    </form>
                  </li>
                ))}
              </ul>
              <form action={addCandidate} className="flex gap-2 mt-2">
                <input type="hidden" name="election_id" value={e.id} />
                <input name="name" placeholder="候選人名稱" className="border px-2 py-1" />
                <button type="submit" className="bg-purple-600 text-white px-2 py-1">新增候選人</button>
              </form>
            </div>
          </div>
        )
      })}
    </div>
  )
}
