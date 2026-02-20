import { z } from 'zod'

export const UpdateProjectValidationSchema = z.object({
  title: z.string({
    message: 'Title is required.',
  }).min(3, { message: 'Minimum 3 characters.' }).max(15, { message: 'Maximum 15 characters.' }),
  description: z
    .string({ message: 'Description is required' })
    .min(10, 'Minimum of 10 chars is required'),
  currency: z.string().length(3).optional(),
  address: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  website: z.string().url().nullable().optional(),
  isPublished: z.boolean().optional(),
  primaryColor: z.string().nullable().optional(),
  accentColor: z.string().nullable().optional(),
})

export type TUpdateProjectValidationSchema = z.output<typeof UpdateProjectValidationSchema>
