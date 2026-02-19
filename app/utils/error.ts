import type { FetchError } from '../types/fetchError'

export function getErrorMessage(err: unknown): string {
  // Check if it's a H3/Nuxt FetchError
  const fetchError = err as any
  
  if (fetchError?.data) {
    // If the backend returned a structured error
    const data = fetchError.data as FetchError
    if (data.message) {
      return Array.isArray(data.message) ? data.message[0] : data.message
    }
  }

  // Fallback to the generic error message
  if (fetchError?.message) {
    // Check if it's the "Fetch failed" generic message and try to be more specific
    if (fetchError.message.includes('fetch failed')) {
      return 'Could not connect to the server.'
    }
    return fetchError.message
  }

  return 'An unexpected error occurred.'
}