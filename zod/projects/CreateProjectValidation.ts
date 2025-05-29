import { z } from 'zod'

export const ACCEPTED_MIME_TYPES = {
  scannedDocument: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/pdf',
    'image/HEIF',
  ],
} as const satisfies Record<string, string[]>

export type T_ACCEPTED_MIME_TYPES = typeof ACCEPTED_MIME_TYPES[keyof typeof ACCEPTED_MIME_TYPES]

const MAX_FILE_SIZE = 10000000

export const CreateProjectValidationSchema = z.object({
  title: z.string({
    required_error: 'Title is required.',
  }).min(3, { message: 'Minimum 3 characters.' }).max(15, { message: 'Maximum 15 characters.' }),
  description: z
    .string({ required_error: 'Description is required' })
    .min(10, 'Minimum of 10 chars is required'),
  //   logo: z.string().url({
  //     message: 'Invalid logo url',
  //   }),
  //   coverImage: z.string().url({
  //     message: 'Invalid cover image url',

  //   }).optional(),

  logo: z.instanceof(File, { message: 'Please Select your Logo' })
    .refine(fileTypeRefinement(ACCEPTED_MIME_TYPES.scannedDocument), `Logo File must be one of [${ACCEPTED_MIME_TYPES.scannedDocument.join(', ')}]`)
    .refine(fileSizeRefinement(MAX_FILE_SIZE), `Logo file must not be larger than ${MAX_FILE_SIZE / 1e+6} MB`),

  coverImage: z.instanceof(File, { message: 'Please Select your Cover image' })
    .refine(fileTypeRefinement(ACCEPTED_MIME_TYPES.scannedDocument), `Cover image File must be one of [${ACCEPTED_MIME_TYPES.scannedDocument.join(', ')}]`)
    .refine(fileSizeRefinement(MAX_FILE_SIZE), `Cover image file must not be larger than ${MAX_FILE_SIZE / 1e+6} MB`)
    .optional(),

})

export type TCreateProjectValidationSchema = z.output<typeof CreateProjectValidationSchema>
