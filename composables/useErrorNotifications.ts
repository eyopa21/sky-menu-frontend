import { useToast } from 'primevue/usetoast'

export function useErrorNotifications(error: unknown) {
  const toast = useToast()
  toast.add({ severity: 'error', summary: 'An error occurred.', life: 3000 })
}
