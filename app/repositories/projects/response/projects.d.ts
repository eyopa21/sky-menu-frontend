export type Project = {
  id: number
  userId: number
  title: string
  slug: string
  description: string
  logo: string
  coverImage: string | null
  currency: string
  primaryColor: string | null
  accentColor: string | null
  isPublished: boolean
  address: string | null
  phone: string | null
  website: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}
