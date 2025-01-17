import type { Document } from "../entities/document/Document";
import type { DocumentMetadata } from "../valueObjects/DocumentMetadata";
import { FileFormat } from "../../shared/enums/FileFormats";
import { Result, matchRes } from "joji-ct-fp";
import * as Errors from "../errors/DomainValidationErrors";

const validateString = (value: string, maxLength: number): Result<string, Error> => {
    if (typeof value !== 'string') {
        return Result.Err(new Errors.NotAStringError());
    }
    if (value.length > maxLength) {
        return Result.Err(new Errors.ExceedingExpectedCharacterError(maxLength));
    }
    return Result.Ok(value);
};

const validateArray = (array: string[], maxLength: number, errorMessage: string): Result<string[], Error> => {
    if (!Array.isArray(array) || array.some(item => typeof item !== 'string' || item.length > maxLength)) {
        return Result.Err(new DomainValidationError(errorMessage));
    }
    return Result.Ok(array);
};

const validateDate = (value: Date): Result<Date, Error> => {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
        return Result.Err(new DomainValidationError("Invalid date"));
    }
    return Result.Ok(value);
};

const validateUUID = (value: string): Result<string, Error> => {
    const uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(value)) {
        return Result.Err(new InvalidUUIDError());
    }
    return Result.Ok(value);
};

const validateEnum = (value: string, enumType: any): Result<string, Error>  => {
    if (!Object.values(enumType).includes(value)) {
        return Result.Err(new DomainValidationError("Invalid enum value"));
    }
    return Result.Ok(value);
};

export const validateDocumentMetadata = (data: DocumentMetadata): Result<boolean, Error> => {

    const nameResult = validateString(data.name, 100, "Name cannot exceed 100 characters")
        .flatMap(() => 
            validateArray(data.tags, 20, "Tag cannot exceed 20 characters")
                .flatMap(() => 
                    validateDate(data.updatedAt)
                        .flatMap(() => 
                            validateUUID(data.updatedBy)
                                .flatMap(() => 
                                    validateEnum(data.documentFormat, FileFormat)
                                )
                        )
                )
    )

    return matchRes(nameResult, {
        Ok: () => Result.Ok(true),
        Err: (err) => Result.Err(err)
    })
};

export const validateDocument = (data: Document): Result<boolean, string> => {

    const idResult = validateUUID(data.id)
        .flatMap(() => 
            validateUUID(data.creatorId)
                .flatMap(() => 
                    validateDate(data.createdAt)
                        .flatMap(() => 
                            validateDocumentMetadata(data.documentMetadata)
                        )
                )
        )

    return matchRes(idResult, {
        Ok: () => Result.Ok(true),
        Err: (err) => Result.Err(err.name)
    })
};