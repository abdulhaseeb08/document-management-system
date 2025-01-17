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

export type UserRegisterDtoType = z.infer<typeof UserRegisterDto>;