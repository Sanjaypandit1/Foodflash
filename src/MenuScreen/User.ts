export interface User {
  uid: string
   email: string | null 
  displayName: string | null
  name?: string
  photoURL?: string | null
  emailVerified: boolean
}