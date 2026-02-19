import { z } from 'zod'

export const ResetPasswordValidationSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

export type TResetPasswordValidationSchema = z.infer<typeof ResetPasswordValidationSchema>
