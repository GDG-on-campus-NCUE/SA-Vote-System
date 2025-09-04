import { supabaseAdmin } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import VoteForm from './VoteForm'

export default async function ElectionPage({ params }) {
  const { electionId } = params

  const { data: election, error: electionError } = await supabaseAdmin
    .from('elections')
    .select('*')
    .eq('id', electionId)
    .single()

  if (electionError || !election) {
    notFound()
  }

  const { data: candidates, error: candidatesError } = await supabaseAdmin
    .from('candidates')
    .select('*')
    .eq('election_id', electionId)

  if (candidatesError) {
    console.error('Error fetching candidates:', candidatesError)
    return <p className="p-4 text-red-500">Error loading candidates.</p>
  }

  return (
    <div className="p-4 w-full max-w-4xl">
      <h1 className="text-2xl font-bold mb-2">{election.name}</h1>
      <p className="text-gray-600 mb-4">{election.bulletin_url && <a href={election.bulletin_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Bulletin</a>}</p>

      <VoteForm electionId={election.id} candidates={candidates || []} />
    </div>
  )
}
