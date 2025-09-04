'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { castVoteAction } from '@/app/actions'

const initialState = {
  error: null,
  success: null,
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      aria-disabled={pending}
      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
    >
      {pending ? 'Casting Vote...' : 'Cast Vote'}
    </button>
  )
}

export default function VoteForm({ electionId, candidates }) {
  const [state, formAction] = useFormState(castVoteAction, initialState)

  return (
    <form action={formAction} className="p-4 border rounded-md">
      <input type="hidden" name="electionId" value={electionId} />

      <fieldset>
        <legend className="font-bold mb-2">Select a candidate:</legend>

        {candidates.map((candidate) => (
          <div key={candidate.id} className="flex items-center mb-2">
            <input
              type="radio"
              id={`candidate-${candidate.id}`}
              name="candidateId"
              value={candidate.id}
              required
              className="mr-2"
            />
            <label htmlFor={`candidate-${candidate.id}`}>{candidate.name}</label>
          </div>
        ))}
      </fieldset>

      <SubmitButton />

      {state?.success && <p className="mt-2 text-green-600">{state.success}</p>}
      {state?.error && <p className="mt-2 text-red-600">{state.error}</p>}
    </form>
  )
}
