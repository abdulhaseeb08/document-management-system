import { ErrorCodes } from "../../shared/enums/ErrorCodes";
import type { CustomErrorObj } from "../../domain/errors/CustomErrorInterface";

export class UserError extends Error {
    private err: CustomErrorObj;

    constructor(message: string, err: CustomErrorObj) {
        super(message);
        this.name = "UserError";
        this.err = {code: err.code, details: err.details};
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class UserCreationError extends UserError {
    constructor(details: string) {
      super("Error occurred during user creation", 
        {code: ErrorCodes.USER_CREATION_ERROR, details: details});
      this.name = "UserCreationError";
    }
}
  
export class UserUpdateError extends UserError {
    constructor(details: string) {
      super("Error occurred during user update", 
        {code: ErrorCodes.USER_UPDATE_ERROR, details: details});
      this.name = "UserUpdateError";
    }
}
  
export class UserDoesNotExistError extends UserError {
    constructor(details: string) {
      super("User does not exist", 
        {code: ErrorCodes.USER_DOES_NOT_EXIST_ERROR, details: details});
      this.name = "UserDoesNotExistError";
    }
}
  
export class UserDeleteError extends UserError {
    constructor(details: string) {
      super("Error occurred during user deletion", 
        {code: ErrorCodes.USER_DELETE_ERROR, details: details});
      this.name = "UserDeleteError";
    }
}

export class UserAlreadyExistsError extends UserError {
    constructor(details: string) {
      super("User already exists", 
        {code: ErrorCodes.USER_ALREADY_EXISTS_ERROR, details: details});
      this.name = "UserAlreadyExistsError";
    }
}

export class IncorrectPasswordError extends UserError {
    constructor(details: string) {
      super("Incorrect password", 
        {code: ErrorCodes.INCORRECT_PASSWORD_ERROR, details: details});
      this.name = "IncorrectPasswordError";
    }
}
