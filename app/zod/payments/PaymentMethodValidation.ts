import { z } from 'zod'

export const PaymentMethodValidationSchema = z.object({
  projectId: z.number({
    error: 'Project is required.',
  }).int().positive(),
  type: z.string({
    error: 'Payment type is required.',
  }).min(2, 'At least 2 characters required.'),
  accountName: z.string({
    error: 'Account name is required.',
  }).min(3, 'Minimum 3 characters required.'),
  accountNumber: z.string({
    error: 'Account number is required.',
  }).min(5, 'Minimum 5 characters required.'),
  qrCode: z.string().optional(),
  isActive: z.boolean().default(true),
})

export type TPaymentMethodValidationSchema = z.output<typeof PaymentMethodValidationSchema>
