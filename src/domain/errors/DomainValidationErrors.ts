export class DomainValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "DomainValidationError";
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
export class NotAStringError extends DomainValidationError {
    constructor() {
        super("Value is not a string");
        this.name = "NotAStringError";
    }
}

export class NotAnArrayError extends DomainValidationError {
    constructor() {
        super("Value is not an array");
        this.name = "NotAnArrayError";
    }
}

export class ExceedingExpectedCharacterError extends DomainValidationError {
    constructor(maxLength: number) {
        super(`Value exceeds the expected character limit of ${maxLength}`);
        this.name = "ExceedingExpectedCharacterError";
    }
}

export class InvalidDateError extends DomainValidationError {
    constructor() {
        super("Invalid date");
        this.name = "InvalidDateError";
    }
}

export class InvalidUUIDError extends DomainValidationError {
    constructor() {
        super("Invalid UUID");
        this.name = "InvalidUUIDError";
    }
}

export class InvalidEnumValueError extends DomainValidationError {
    constructor() {
        super("Invalid enum value");
        this.name = "InvalidEnumValueError";
    }
}

export class InvalidEmailError extends DomainValidationError {
    constructor() {
        super("Invalid email");
        this.name = "InvalidEmailError";
    }
}