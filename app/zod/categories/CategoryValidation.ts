import { z } from 'zod'

export const CategoryValidationSchema = z.object({
  name: z.string({
    message: 'Name is required.',
  }).min(3, { message: 'Minimum 3 characters.' }),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
})

export type TCategoryValidationSchema = z.infer<typeof CategoryValidationSchema>
