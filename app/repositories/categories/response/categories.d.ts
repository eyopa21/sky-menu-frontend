export type Category = {
  id: number
  projectId: number
  imageUrl: string | null
  name: string
  description: string | null
  sortOrder: number
  isVisible: boolean
  createdAt: string
  updatedAt: string
}
