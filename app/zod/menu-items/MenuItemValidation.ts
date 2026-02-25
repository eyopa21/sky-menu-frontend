import { z } from 'zod'

export const MenuItemValidationSchema = z.object({
  name: z.string({ message: 'Name is required' }).min(3),
  description: z.string().optional(),
  price: z.coerce.number({ message: 'Price must be a number' }).positive(),
  vatIncluded: z.boolean().default(true),
  categoryId: z.coerce.number({ message: 'Category is required' }),
  calories: z.coerce.number().optional().nullable(),
  preparationTime: z.coerce.number().optional().nullable(),
  isAvailable: z.boolean().default(true),
})

export type TMenuItemValidationSchema = z.infer<typeof MenuItemValidationSchema>
