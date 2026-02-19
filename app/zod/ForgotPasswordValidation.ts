import { z } from 'zod'

export const ForgotPasswordValidationSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export type TForgotPasswordValidationSchema = z.infer<typeof ForgotPasswordValidationSchema>
