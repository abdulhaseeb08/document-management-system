import { z } from 'zod';
import { UserRole } from '../../shared/enums/UserRole';

export const UserRegisterDto = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(12, { message: "Password must be at least 12 characters long" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[@$!%*?&#]/, { message: "Password must contain at least one special character" }),
  name: z.string(),
  userRole: z.nativeEnum(UserRole)
});

export const UserLoginDto = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(12, { message: "Password must be at least 12 characters long" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[@$!%*?&#]/, { message: "Password must contain at least one special character" })
});

export const UserUpdateDto = z.object({
  token: z.string(),
  userId: z.string().uuid({ message: "Invalid user ID" }),
  email: z.string().email({ message: "Invalid email address" }).optional(),
  password: z.string().min(12, { message: "Password must be at least 12 characters long" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[@$!%*?&#]/, { message: "Password must contain at least one special character" })
    .optional(),
  name: z.string().optional()
});

export const UserGetOrDeleteDto = z.object({
  token: z.string(),
  userId: z.string().uuid({ message: "Invalid user ID" })
});

export type UserRegisterDtoType = z.infer<typeof UserRegisterDto>;
export type UserLoginDtoType = z.infer<typeof UserLoginDto>;
export type UserUpdateDtoType = z.infer<typeof UserUpdateDto>;
export type UserGetOrDeleteDtoType = z.infer<typeof UserGetOrDeleteDto>;