import { z } from 'zod'

export const phoneNumberRegex = /^(09|07)\d{8}$|^(?:\+251|251)(9|7)\d{8}$/

const SEX = {
    MALE: 'male', 
    FEMALE: 'female'
} as const


export const UpdateAccountValidationSchema = z.object({
  full_name: z.string({
    required_error: 'Full name is required.'
  }).min(3, { message: 'Minimum 3 characters.' })
  .max(15, { message: 'Maximum 15 characters.' }),
  phone_number: z
      .string({ required_error: 'Phone number is required' })
      .min(1, 'Phone number is required')
      .regex(
        phoneNumberRegex,
        'Phone number must start with +251, 251, 09, or 07',
      ),
      sex: z.nativeEnum(SEX, {
        errorMap: () => {
          return { message: 'Please select your Gender' }
        },
      }),
      date_of_birth: z.date({
        required_error: 'Please Enter Date of Birth',
        invalid_type_error: 'That\'s not a date!',
      }).min(new Date('1900-01-01'), { message: 'Unfortunately, you exceed the maximum age limit for this service.' }).max(new Date('2010-01-01'), { message: 'You must be at least 14 years old to proceed.' }),

})

export type TUpdateAccountValidationSchema = z.output<typeof UpdateAccountValidationSchema>
