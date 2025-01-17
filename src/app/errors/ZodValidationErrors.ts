import { ZodError } from "zod";

export class ZodValidationError extends Error {
    private issues: ZodError["issues"];

    constructor(zodError: ZodError) {
        super("Validation error occurred");
        this.name = "ZodValidationError";
        this.issues = zodError.issues;
        Object.setPrototypeOf(this, new.target.prototype);
    }

    public getIssues() {
        return this.issues;
    }
}