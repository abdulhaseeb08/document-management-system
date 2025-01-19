import type { Permission } from "../entities/permission/Permisson";
import { DocumentRole } from "../../shared/enums/DocumentRole";
import { Result, matchRes } from "joji-ct-fp";
import {
    validateUUID,
    validateDate,
    validateEnum
} from "./Validatiors";

export const validatePermission = (permission: Permission): Result<boolean, Error> => {

    const res = validateUUID(permission.id)
        .flatMap(() => 
            validateUUID(permission.userId)
                .flatMap(() => 
                    validateUUID(permission.creatorId)
                        .flatMap(() => 
                            validateUUID(permission.documentId)
                                .flatMap(() => 
                                    validateDate(permission.createdAt)
                                        .flatMap(() => 
                                            validateEnum(permission.permissionType, DocumentRole)
                                        )
                                )
                        )
                )
        )

    return matchRes(res, {
        Ok: () => Result.Ok(true),
        Err: (err) => Result.Err(err)
    })
};