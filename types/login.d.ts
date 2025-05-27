export type AuthSessionSchema  = {
    accessToken: string
    refreshToken: string
    user: User
  }
  
  export type User =  {
    id: number
    full_name: string
    date_of_birth: Date
    phone_number: string
    sex: 'male' | 'female'
    email: string
    createdAt: string
    updatedAt: string
    deletedAt: any
  }
  