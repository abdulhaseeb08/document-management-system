import type { UUID } from "../../../shared/types";
import type { UserMetadata } from "../../valueObjects/UserMetadata";

export interface User {
  readonly id: UUID; // uuid of user
  readonly createdAt: Date;
  email: string;
  userMetadata: UserMetadata;
  updatedBy: UUID; // uuid of user who updated
}

