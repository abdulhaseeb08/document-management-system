import type { UUID } from "../../../shared/types";
import { PermissionType } from "../../../shared/enums/PermissionType";

export interface Permission {
  readonly id: UUID; // uuid of permission
  readonly userId: UUID; //uuid of the user to whom permission is granted
  readonly creatorId: UUID; //uuid of the user who granted the permission
  readonly documentId: UUID; //uuid of the granted document
  readonly createdAt: Date;
  readonly permissionType: PermissionType //the type of permission
}