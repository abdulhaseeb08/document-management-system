import { ErrorCodes } from "../../shared/enums/ErrorCodes";

export interface CustomErrorObj {
  code: ErrorCodes,
  details: string
}