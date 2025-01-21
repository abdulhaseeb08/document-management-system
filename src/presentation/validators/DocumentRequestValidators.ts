import { Result } from "joji-ct-fp";
import { DocumentCreateDto, DocumentUpdateDto } from "../../app/dtos/DocumentDtos";
import type { DocumentCreateDtoType, DocumentUpdateDtoType } from "../../app/dtos/DocumentDtos";
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