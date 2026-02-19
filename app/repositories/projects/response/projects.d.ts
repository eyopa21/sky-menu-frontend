export type Project = {
  id: number
  userId: number
  title: string
  description: string
  logo: string
  coverImage: string | null
  createdAt: Date
  updatedAt: Date
  deletedAt: Date
}
