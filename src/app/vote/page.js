import { createServer, supabaseAdmin } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function VotePage() {
  const supabase = createServer()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Elections</h1>
            <p>You must be logged in to view elections.</p>
        </div>
    )
  }

  const { data: elections, error } = await supabaseAdmin
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
