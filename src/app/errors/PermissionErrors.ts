import { ErrorCodes } from "../../shared/enums/ErrorCodes";
import type { CustomErrorObj } from "../../domain/errors/CustomErrorInterface";

export class PermissionError extends Error {
    private err: CustomErrorObj;

    constructor(message: string, err: CustomErrorObj) {
        super(message);
        this.name = "PermissionError";
        this.err = {code: err.code, details: err.details};
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class PermissionCreationError extends PermissionError {
    constructor(details: string) {
      super("Error occurred during permission creation", 
        {code: ErrorCodes.PERMISSION_CREATION_ERROR, details: details});
      this.name = "PermissionCreationError";
    }
}
  
export class PermissionDoesNotExistError extends PermissionError {
    constructor(details: string) {
      super("Permission does not exist", 
        {code: ErrorCodes.PERMISSION_DOES_NOT_EXIST_ERROR, details: details});
      this.name = "PermissionDoesNotExistError";
    }
}
  
export class PermissionDeleteError extends PermissionError {
    constructor(details: string) {
      super("Error occurred during permission deletion", 
        {code: ErrorCodes.PERMISSION_DELETE_ERROR, details: details});
      this.name = "PermissionDeleteError";
    }
}

export class PermissionAlreadyExistsError extends PermissionError {
    constructor(details: string) {
      super("Permission already exists", 
        {code: ErrorCodes.PERMISSION_ALREADY_EXISTS_ERROR, details: details});
      this.name = "PermissionAlreadyExistsError";
    }
}