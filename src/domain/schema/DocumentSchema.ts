import type { Document } from "../entities/document/Document";
import type { DocumentMetadata } from "../valueObjects/DocumentMetadata";
import { FileFormat } from "../../shared/enums/FileFormats";
import { Result, matchRes } from "joji-ct-fp";
import {
    validateString,
    validateArray,
    validateDate,
    validateUUID,
    validateEnum
} from "./Validatiors";


export const validateDocumentMetadata = (data: DocumentMetadata): Result<boolean, Error> => {

    const nameResult = validateString(data.name, 100)
        .flatMap(() => 
            validateArray(data.tags, 20)
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

export const validateDocument = (data: Document): Result<boolean, Error> => {

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
        Err: (err) => Result.Err(err)
    })
};