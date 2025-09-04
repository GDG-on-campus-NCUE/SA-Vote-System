'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [view, setView] = useState('sign-in')
  const router = useRouter()
  const supabase = createClient()

  const handleSignUp = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) {
      alert('Error signing up: ' + error.message)
    } else {
      setView('check-email')
    }
  }

  const handleSignIn = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      alert('Error signing in: ' + error.message)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      {view === 'check-email' ? (
        <p className="text-center">
          Check <span className="font-bold">{email}</span> to continue signing up
        </p>
      ) : (
        <form
          className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
          onSubmit={view === 'sign-in' ? handleSignIn : handleSignUp}
        >
          <label className="text-md" htmlFor="email">
            Email
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="you@example.com"
          />
          <label className="text-md" htmlFor="password">
            Password
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            type="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="••••••••"
          />
          {view === 'sign-in' ? (
            <>
              <button className="bg-green-700 rounded px-4 py-2 text-white mb-2">
                Sign In
              </button>
              <p className="text-sm text-center">
                Don't have an account?
                <button
                  className="ml-1 underline"
                  onClick={() => setView('sign-up')}
                >
                  Sign Up Now
                </button>
              </p>
            </>
          ) : (
            <>
              <button className="bg-green-700 rounded px-4 py-2 text-white mb-2">
                Sign Up
              </button>
              <p className="text-sm text-center">
                Already have an account?
                <button
                  className="ml-1 underline"
                  onClick={() => setView('sign-in')}
                >
                  Sign In Now
                </button>
              </p>
            </>
          )}
        </form>
      )}
    </div>
  )
}
