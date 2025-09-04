'use server'

import { supabaseServer } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/ssr'

export async function castVoteAction(formData) {
  const electionId = formData.get('electionId')
  const candidateId = formData.get('candidateId')

  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to vote.' }
  }

  // The 'cast_vote' function in the database will handle the logic
  // of checking if the user has already voted and if the election is still active.
  // It requires student_id, which we assume is on the user's metadata.
  // The prompt states a trigger creates a 'users' table row from 'auth.users'.
  // We'll assume the student_id is available in user_metadata.
  const { data, error } = await supabaseServer.rpc('cast_vote', {
    p_election_id: electionId,
    p_candidate_id: candidateId,
    p_user_id: user.id
  })

  if (error) {
    console.error('Error casting vote:', error)
    // Provide a more user-friendly error message
    if (error.message.includes('ALREADY_VOTED')) {
        return { error: 'You have already voted in this election.' }
    }
    if (error.message.includes('ELECTION_ENDED')) {
        return { error: 'This election has ended.' }
    }
    return { error: 'An unexpected error occurred. Please try again.' }
  }

  return { success: 'Your vote has been cast successfully!' }
}
