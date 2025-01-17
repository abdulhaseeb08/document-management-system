import type { CustomErrorObj } from "./CustomErrorInterface";
import { ErrorCodes } from "../../shared/enums/ErrorCodes";

export class DomainValidationError extends Error {
    private err: CustomErrorObj;

    constructor(message: string, err: CustomErrorObj) {
        super(message);
        this.name = "DomainValidationError";
        this.err.code = err.code;
        this.err.details = err.details;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class NotAStringError extends DomainValidationError {
    constructor() {
        super("Value is not a string", 
            { code: ErrorCodes.NOT_A_STRING_ERROR, details: "Value is not a string" });
        this.name = "NotAStringError";
    }
}

export class NotAnArrayError extends DomainValidationError {
    constructor() {
        super("Value is not an array", { code: ErrorCodes.NOT_AN_ARRAY_ERROR, details: "Value is not an array" });
        this.name = "NotAnArrayError";
    }
}

export class ExceedingExpectedCharacterError extends DomainValidationError {
    constructor(maxLength: number) {
        super(`Value exceeds the expected character limit of ${maxLength}`, { code: ErrorCodes.EXCEEDING_CHARACTER_LIMIT_ERROR, details: `Value exceeds the expected character limit of ${maxLength}` });
        this.name = "ExceedingExpectedCharacterError";
    }
}

export class InvalidDateError extends DomainValidationError {
    constructor() {
        super("Invalid date", { code: ErrorCodes.INVALID_DATE_ERROR, details: "Invalid date" });
        this.name = "InvalidDateError";
    }
}

export class InvalidUUIDError extends DomainValidationError {
    constructor() {
        super("Invalid UUID", { code: ErrorCodes.INVALID_UUID_ERROR, details: "Invalid UUID" });
        this.name = "InvalidUUIDError";
    }
}

export class InvalidEnumValueError extends DomainValidationError {
    constructor() {
        super("Invalid enum value", { code: ErrorCodes.INVALID_ENUM_VALUE_ERROR, details: "Invalid enum value" });
        this.name = "InvalidEnumValueError";
    }
}

export class InvalidEmailError extends DomainValidationError {
    constructor() {
        super("Invalid email", { code: ErrorCodes.INVALID_EMAIL_ERROR, details: "Invalid email" });
        this.name = "InvalidEmailError";
    }
}