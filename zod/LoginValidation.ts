import { z } from 'zod'

export const LoginValidationSchema = z.object({
  email: z.string().email('Please insert a valid Email'),
  password: z.string()
    .min(3, { message: 'Minimum 3 characters.' })
    .max(8, { message: 'Maximum 8 characters.' }),
  //   .refine((value) => /[a-z]/.test(value), {
  //       message: 'Must have a lowercase letter.'
  //   })
  //   .refine((value) => /[A-Z]/.test(value), {
  //       message: 'Must have an uppercase letter.'
  //   })
  //   .refine((value) => /d/.test(value), {
  //       message: 'Must have a number.'
  //   })

})

export type TLoginValidationSchema = z.output<typeof LoginValidationSchema>
