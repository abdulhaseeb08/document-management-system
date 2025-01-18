import { ErrorCodes } from "../../shared/enums/ErrorCodes";
import type { CustomErrorObj } from "../../domain/errors/CustomErrorInterface";

export class DatabaseError extends Error {
    private err: CustomErrorObj;

    constructor(message: string, err: CustomErrorObj) {
        super(message);
        this.name = "DatabaseError";
        this.err = {code: err.code, details: err.details};
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class QueryError extends DatabaseError {
    constructor(details: string) {
      super("Error occurred during database query", 
        {code: ErrorCodes.QUERY_ERROR, details: details});
    }
}
  
export class CreateTableError extends DatabaseError {
    constructor(details: string) {
      super("Error occurred during table creation", 
        {code: ErrorCodes.CREATE_TABLE_ERROR, details: details});
    }
}
  
export class CreateSchemaError extends DatabaseError {
    constructor(details: string) {
      super("Error occurred during schema creation", 
        {code: ErrorCodes.CREATE_SCHEMA_ERROR, details: details});
    }
}