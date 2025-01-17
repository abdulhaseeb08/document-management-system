import { z } from "zod";
import { UserRole } from "../../shared/enums/UserRole";
import { UUIDSchema } from "./UUIDSchema";

export const UserMetadataSchema = z.object({
    name: z.string().max(50, "Name cannot exceed 50 characters"),
    updatedAt: z.date(),
    userRole: z.nativeEnum(UserRole)
}).strict();

export const UserSchema = z.object({
    id: UUIDSchema,
    createdAt: z.date(),
    email: z.string().email(),
    password: z.string(),
    updatedBy: UUIDSchema,
    userMetadata: UserMetadataSchema
}).strict();