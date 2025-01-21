import { Result } from "joji-ct-fp";
import { GrantPermissionDto, RevokePermissionDto } from "../../app/dtos/PermissionDtos";
import type { GrantPermissionDtoType, RevokePermissionDtoType } from "../../app/dtos/PermissionDtos";
import { ZodValidationError } from "../../app/errors/ZodValidationErrors";

export const validateGrantPermissionDto = (body: any): Result<GrantPermissionDtoType, Error> => {
    const permission = GrantPermissionDto.safeParse(body);
    if (!permission.success) {
        return Result.Err(new ZodValidationError(permission.error));
    }
    return Result.Ok(permission.data);
};

export const validateRevokePermissionDto = (body: any): Result<RevokePermissionDtoType, Error> => {
    const permission = RevokePermissionDto.safeParse(body);
    if (!permission.success) {
        return Result.Err(new ZodValidationError(permission.error));
    }
    return Result.Ok(permission.data);
};
