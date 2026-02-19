export function useErrorNotifications(error: unknown) {
  const toast = useToast()
  toast.add({ 
    title: 'An error occurred.', 
    description: typeof error === 'string' ? error : (error as any)?.message || 'Something went wrong.',
    color: 'error'
  })
}
