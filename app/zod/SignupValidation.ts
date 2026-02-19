import { z } from 'zod'

export const SignupValidationSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone_number: z.string().min(10, 'Phone number must be at least 10 characters'),
  date_of_birth: z.string().or(z.date()),
  sex: z.enum(['male', 'female', 'other'] as const),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

export type TSignupValidationSchema = z.infer<typeof SignupValidationSchema>
