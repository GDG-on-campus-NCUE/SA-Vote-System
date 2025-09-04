import { supabaseServer } from '@/lib/supabase/server'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export default async function VotePage() {
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

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Elections</h1>
            <p>You must be logged in to view elections.</p>
        </div>
    )
  }

  const { data: elections, error } = await supabaseServer
    .from('elections')
    .select('*')
    .gt('end_time', new Date().toISOString())

  if (error) {
    console.error('Error fetching elections:', error)
    return <p className="p-4 text-red-500">Error loading elections.</p>
  }

  return (
    <div className="p-4 w-full max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">Active Elections</h1>
      {elections && elections.length > 0 ? (
        <ul>
          {elections.map((election) => (
            <li key={election.id} className="mb-2">
              <Link href={`/vote/${election.id}`} className="text-blue-500 hover:underline">
                {election.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No active elections at the moment.</p>
      )}
    </div>
  )
}
