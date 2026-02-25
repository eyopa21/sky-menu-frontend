export type MenuItem = {
  id: number
  menuId: number
  categoryId: number
  name: string
  images: string[]
  price: number
  vatIncluded: boolean
  description: string | null
  isAvailable: boolean
  sortOrder: number
  calories: number | null
  preparationTime: number | null
  discount: number | null
  tags: string[] | null
  allergens: string[] | null
  createdAt: string
  updatedAt: string
}
