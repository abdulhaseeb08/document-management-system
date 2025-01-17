import { UserRole } from "../../shared/enums/UserRole";
import type { User } from "../entities/user/User";
import type { UserMetadata } from "../valueObjects/UserMetadata";
import { Result, matchRes } from "joji-ct-fp";
import {
    validateString,
    validateDate,
    validateUUID,
    validateEnum,
    validateEmail
} from "./Validatiors";

export const validateUserMetadata = (userMetadata: UserMetadata): Result<boolean, Error> => {

    const res = validateString(userMetadata.name, 50)
        .flatMap(() => 
            validateDate(userMetadata.updatedAt)
                .flatMap(() => 
                    validateEnum(userMetadata.userRole, UserRole)
                )
        )

    return matchRes(res, {
        Ok: () => Result.Ok(true),
        Err: (err) => Result.Err(err)
    })
};

export const validateUser = (user: User): Result<boolean, string> => {

    const res = validateUUID(user.id!)
        .flatMap(() => 
            validateDate(user.createdAt!)
                .flatMap(() => 
                    validateEmail(user.email)
                        .flatMap(() => 
                            validateString(user.password, 100) // Assuming max length for password
                                .flatMap(() => 
                                    validateUUID(user.updatedBy!)
                                        .flatMap(() => 
                                            validateUserMetadata(user.userMetadata)
                                        )
                                )
                        )
                )
        )

    return matchRes(res, {
        Ok: () => Result.Ok(true),
        Err: (err) => Result.Err(err.name)
    })
};