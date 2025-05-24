export type AuthSessionSchema  = {
    accessToken: string
    refreshToken: string
    user: User
  }
  
  export type User =  {
    id: number
    full_name: string
    date_of_birth: string
    phone_number: string
    sex: string
    email: string
    createdAt: string
    updatedAt: string
    deletedAt: any
  }
  