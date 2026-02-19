import type z from 'zod'
import type { ForgotPasswordValidationSchema } from '~/zod/ForgotPasswordValidation'

export type ForgotPasswordDto = z.infer<typeof ForgotPasswordValidationSchema>
