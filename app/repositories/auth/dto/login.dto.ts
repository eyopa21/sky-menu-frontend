import type z from 'zod'
import type { LoginValidationSchema } from '~/zod/LoginValidation'

export type LoginDto = z.infer<typeof LoginValidationSchema>
