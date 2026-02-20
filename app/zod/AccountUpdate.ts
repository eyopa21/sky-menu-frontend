import { z } from 'zod'

export const phoneNumberRegex = /^(09|07)\d{8}$|^(?:\+251|251)(9|7)\d{8}$/

const SEX = {
  MALE: 'male',
  FEMALE: 'female',
} as const

export const UpdateAccountValidationSchema = z.object({
  full_name: z.string().min(3, 'Minimum 3 characters.').max(15, 'Maximum 15 characters.'),
  phone_number: z
    .string()
    .min(1, 'Phone number is required')
    .regex(
      phoneNumberRegex,
      'Phone number must start with +251, 251, 09, or 07',
    ),
  sex: z.nativeEnum(SEX),
  date_of_birth: z.preprocess((val) => {
    if (typeof val === 'string' || val instanceof Date) return new Date(val)
    return val
  }, z.date().min(new Date('1900-01-01'), { message: 'Age limit exceeded.' }).max(new Date('2010-01-01'), { message: 'Must be at least 14 years old.' })),
})

export type TUpdateAccountValidationSchema = z.output<typeof UpdateAccountValidationSchema>
