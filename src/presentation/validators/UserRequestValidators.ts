import { Result } from "joji-ct-fp";
import { UserRegisterDto, UserLoginDto, UserUpdateDto, UserGetOrDeleteDto } from "../../app/dtos/UserDtos";
import type { UserRegisterDtoType, UserLoginDtoType, UserUpdateDtoType, UserGetOrDeleteDtoType } from "../../app/dtos/UserDtos";
import { ZodValidationError } from "../../app/errors/ZodValidationErrors";

export const validateUserRegisterDto = (body: any): Result<UserRegisterDtoType, Error> => {
    const user = UserRegisterDto.safeParse(body);
    if (!user.success) {
        return Result.Err(new ZodValidationError(user.error));
    }
    return Result.Ok(user.data);
};

export const validateUserLoginDto = (body: any): Result<UserLoginDtoType, Error> => {
    const user = UserLoginDto.safeParse(body);
    if (!user.success) {
        return Result.Err(new ZodValidationError(user.error));
    }
    return Result.Ok(user.data);
};

export const validateUserUpdateDto = (body: any): Result<UserUpdateDtoType, Error> => {
    const user = UserUpdateDto.safeParse(body);
    if (!user.success) {
        return Result.Err(new ZodValidationError(user.error));
    }
    return Result.Ok(user.data);
};

export const validateUserGetOrDeleteDto = (body: any): Result<UserGetOrDeleteDtoType, Error> => {
    const user = UserGetOrDeleteDto.safeParse(body);
    if (!user.success) {
        return Result.Err(new ZodValidationError(user.error));
    }
    return Result.Ok(user.data);
};