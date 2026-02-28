import type { Menu } from '~/repositories/menus/response/menus'
import type { Category } from '~/repositories/categories/response/categories'
import type { MenuItem } from '~/repositories/menu-items/response/menu-items'

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
  menuUIType: 'one' | 'two' | 'three'
  isPublished: boolean
  address: string | null
  phone: string | null
  website: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  menu?: Menu & { menuItems?: MenuItem[] }
  categories?: Category[]
}
