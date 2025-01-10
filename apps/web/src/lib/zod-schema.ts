import { z } from 'zod'

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().nonempty("Password must not be empty").min(6, 'Password must be at least 6 characters long'),
})

export type SignInSchema = z.infer<typeof signInSchema>

export const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export type SignUpSchema = z.infer<typeof signUpSchema>

export const createRoomSchema = z.object({
  name: z
    .string()
    .min(3, "Room name must be at least 3 characters")
    .max(50, "Room name must be less than 50 characters"),
  hasPassword: z.boolean().default(false),
  password: z.string().optional()
}).refine(
  (data) => {
    // Only validate password if hasPassword is true
    if (data.hasPassword) {
      return data.password && data.password.length >= 6;
    }
    // If hasPassword is false, password validation is skipped
    return true;
  },
  {
    message: "Password must be at least 6 characters",
    path: ["password"], // This will show the error on the password field
  }
);

export type CreateRoomSchema = z.infer<typeof createRoomSchema>;