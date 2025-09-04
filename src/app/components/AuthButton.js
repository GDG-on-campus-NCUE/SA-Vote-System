'use client'

import { createClientComponentClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AuthButton() {
  const [user, setUser] = useState(null)
  const router = useRouter()
  const supabase = createClientComponentClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
    setUser(null)
  }

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.email}!
      <button onClick={handleSignOut} className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
        Logout
      </button>
    </div>
  ) : (
    <Link
      href="/login"
      className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
    >
      Login
    </Link>
  )
}
