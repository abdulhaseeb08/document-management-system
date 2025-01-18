import { ErrorCodes } from "../../shared/enums/ErrorCodes";
import type { CustomErrorObj } from "../../domain/errors/CustomErrorInterface";

export class DocumentError extends Error {
    private err: CustomErrorObj;

    constructor(message: string, err: CustomErrorObj) {
        super(message);
        this.name = "DocumentError";
        this.err = {code: err.code, details: err.details};
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class DocumentCreationError extends DocumentError {
    constructor(details: string) {
      super("Error occurred during document creation", 
        {code: ErrorCodes.DOCUMENT_CREATION_ERROR, details: details});
      this.name = "DocumentCreationError";
    }
}
  
export class DocumentUpdateError extends DocumentError {
    constructor(details: string) {
      super("Error occurred during document update", 
        {code: ErrorCodes.DOCUMENT_UPDATE_ERROR, details: details});
      this.name = "DocumentUpdateError";
    }
}
  
export class DocumentDoesNotExistError extends DocumentError {
    constructor(details: string) {
      super("Document does not exist", 
        {code: ErrorCodes.DOCUMENT_DOES_NOT_EXIST_ERROR, details: details});
      this.name = "DocumentDoesNotExistError";
    }
}
  
export class DocumentDeleteError extends DocumentError {
    constructor(details: string) {
      super("Error occurred during document deletion", 
        {code: ErrorCodes.DOCUMENT_DELETE_ERROR, details: details});
      this.name = "DocumentDeleteError";
    }
}