import { PermissionType } from "../../shared/enums/PermissionType";
import { z } from "zod";
import { UUIDSchema } from "./UUIDSchema";

export const PermissionSchema = z.object({
    id: UUIDSchema,
    userId: UUIDSchema,
    creatorId: UUIDSchema,
    documentId: UUIDSchema,
    createdAt: z.date(),
    permissionType: z.nativeEnum(PermissionType)
}).strict();