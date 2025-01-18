import { ErrorCodes } from "../../shared/enums/ErrorCodes";
import type { CustomErrorObj } from "../../domain/errors/CustomErrorInterface";

export class AuthError extends Error {
    private err: CustomErrorObj;

    constructor(message: string, err: CustomErrorObj) {
        super(message);
        this.name = "AuthError";
        this.err.code = err.code;
        this.err.details = err.details;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class InvalidTokenError extends AuthError {
    constructor(details: string) {
      super("Invalid token provided", 
        {code: ErrorCodes.INVALID_TOKEN_ERROR, details: details});
      this.name = "InvalidTokenError";
    }
}

export class UnauthorizedAccessError extends AuthError {
    constructor(details: string) {
      super("Unauthorized access", 
        {code: ErrorCodes.UNAUTHORIZED_ACCESS_ERROR, details: details});
      this.name = "UnauthorizedAccessError";
    }
}

