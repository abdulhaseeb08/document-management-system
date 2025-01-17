import { Result } from "joji-ct-fp";
import * as Errors from "../errors/DomainValidationErrors";

export const validateString = (value: string, maxLength: number): Result<string, Error> => {
    if (typeof value !== 'string') {
        return Result.Err(new Errors.NotAStringError());
    }
    if (value.length > maxLength) {
        return Result.Err(new Errors.ExceedingExpectedCharacterError(maxLength));
    }
    return Result.Ok(value);
};

export const validateArray = (array: string[], maxLength: number): Result<string[], Error> => {
    if (!Array.isArray(array) ) {
        return Result.Err(new Errors.NotAnArrayError());
    }
    if (array.some(item => typeof item !== 'string' || item.length > maxLength)) {
        return Result.Err(new Errors.NotAStringError());
    }
    if (array.some(item => item.length > maxLength)){
        return Result.Err(new Errors.ExceedingExpectedCharacterError(maxLength));
    }
    return Result.Ok(array);
};

export const validateDate = (value: Date): Result<Date, Error> => {
    if (!(value instanceof Date)) {
        return Result.Err(new Errors.InvalidDateError());
    }
    return Result.Ok(value);
};

export const validateUUID = (value: string): Result<string, Error> => {
    const uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(value)) {
        return Result.Err(new Errors.InvalidUUIDError());
    }
    return Result.Ok(value);
};

export const validateEnum = (value: string, enumType: any): Result<string, Error>  => {
    if (!Object.values(enumType).includes(value)) {
        return Result.Err(new Errors.InvalidEnumValueError());
    }
    return Result.Ok(value);
};

export const validateEmail = (value: string): Result<string, Error> => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
        return Result.Err(new Errors.InvalidEmailError());
    }
    return Result.Ok(value);
};
