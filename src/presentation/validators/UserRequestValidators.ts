import { Result } from "joji-ct-fp";
import { UserRegisterDto } from "../../app/dtos/UserDtos";
import type { UserRegisterDtoType } from "../../app/dtos/UserDtos";
import { ZodValidationError } from "../../app/errors/ZodValidationErrors";

export const validateUserRegisterDto = (body: any): Result<UserRegisterDtoType, Error> => {
    const user = UserRegisterDto.safeParse(body);
    if (!user.success) {
        return Result.Err(new ZodValidationError(user.error));
    }
    return Result.Ok(user.data);
}