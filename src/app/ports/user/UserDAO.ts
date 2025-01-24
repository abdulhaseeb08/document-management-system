import type { UUID } from "../../../shared/types";
import { Result } from "joji-ct-fp";

export interface UserDAO {
  getUserPassword(userId: UUID): Promise<Result<string, Error>>;
}
