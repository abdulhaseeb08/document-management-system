import { Result } from "joji-ct-fp";
import { DocumentCreateDto, DocumentGetDto, DocumentUpdateDto, DownloadDocumentDto, DocumentDeleteDto } from "../../app/dtos/DocumentDtos";
import type { DocumentCreateDtoType, DocumentGetDtoType, DocumentUpdateDtoType, DownloadDocumentDtoType, DocumentDeleteDtoType } from "../../app/dtos/DocumentDtos";
import { ZodValidationError } from "../../app/errors/ZodValidationErrors";

export const validateDocumentCreateDto = (body: any): Result<DocumentCreateDtoType, Error> => {
    const document = DocumentCreateDto.safeParse(body);
    if (!document.success) {
        return Result.Err(new ZodValidationError(document.error));
    }
    return Result.Ok(document.data);
};

export const validateDocumentUpdateDto = (body: any): Result<DocumentUpdateDtoType, Error> => {
    const document = DocumentUpdateDto.safeParse(body);
    if (!document.success) {
        return Result.Err(new ZodValidationError(document.error));
    }
    return Result.Ok(document.data);
};

export const validateDocumentGetDto = (body: any): Result<DocumentGetDtoType, Error> => {
    const document = DocumentGetDto.safeParse(body);
    if (!document.success) {
        return Result.Err(new ZodValidationError(document.error));
    }
    return Result.Ok(document.data);
};

export const validateDownloadDocumentDto = (body: any): Result<DownloadDocumentDtoType, Error> => {
    const document = DownloadDocumentDto.safeParse(body);
    if (!document.success) {
        return Result.Err(new ZodValidationError(document.error));
    }
    return Result.Ok(document.data);
};

export const validateDeleteDocumentDto = (body: any): Result<DocumentDeleteDtoType, Error> => {
    const document = DocumentDeleteDto.safeParse(body);
    if (!document.success) {
        return Result.Err(new ZodValidationError(document.error));
    }
    return Result.Ok(document.data);
};