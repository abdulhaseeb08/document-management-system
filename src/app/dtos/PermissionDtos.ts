import { z } from 'zod';
import { DocumentRole } from '../../shared/enums/DocumentRole';

export const GrantPermissionDto = z.object({
  token: z.string(),
  userId: z.string().uuid({ message: "Invalid user ID" }),
  documentId: z.string().uuid({ message: "Invalid document ID" }),
  permissionType: z.nativeEnum(DocumentRole)
});

export const RevokePermissionDto = z.object({
  token: z.string(),
  userId: z.string().uuid({ message: "Invalid user ID" }),
  documentId: z.string().uuid({ message: "Invalid document ID" }),
  permissionType: z.nativeEnum(DocumentRole)
});

export type GrantPermissionDtoType = z.infer<typeof GrantPermissionDto>;
export type RevokePermissionDtoType = z.infer<typeof RevokePermissionDto>;

