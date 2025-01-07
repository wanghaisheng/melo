import { z } from 'zod'

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().nonempty("Password must not be empty").min(8, 'Password must be at least 8 characters long'),
})

export type SignInSchema = z.infer<typeof signInSchema>