import type z from 'zod'
import type { SignupValidationSchema } from '~/zod/SignupValidation'

export type SignupDto = z.infer<typeof SignupValidationSchema>
