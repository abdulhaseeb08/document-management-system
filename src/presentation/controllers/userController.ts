import { UserService } from "../../app/services/user/UserService";
import { inject, injectable } from "inversify";
import { validateUserRegisterDto, validateUserLoginDto, validateUserUpdateDto, validateUserGetOrDeleteDto } from "../validators/UserRequestValidators";
import type { Logger } from "../../app/ports/logger/logger";
import { INVERIFY_IDENTIFIERS } from "../../infra/di/inversify/inversify.types";
import { matchRes, Result } from "joji-ct-fp";

@injectable()
export class UserController {

    constructor(@inject(UserService) private userService: UserService,
                @inject(INVERIFY_IDENTIFIERS.Logger) private logger: Logger
            ) {}

    public async parseRequestBody(request: Request): Promise<Result<any, Error>> {
        this.logger.info("Parsing request body");
        const body = await request.json().catch(() => null);
        if (!body) {
            this.logger.error("Failed to parse request body: Missing payload");
            return Result.Err(new Error("Missing payload"));
        }
        this.logger.info("Successfully parsed request body");
        return Result.Ok(body);
    }

    public async parseRequestUrl(request: Request): Promise<Result<Object, Error>> {
        this.logger.info("Parsing request URL");
        const url = new URL(request.url);
        const queryParams = Object.fromEntries(url.searchParams.entries());
        const authToken = request.headers.get('Authorization');
        if (!authToken || !authToken.startsWith("Bearer ")) {
            this.logger.error("Missing or invalid Authorization header");
            return Result.Err(new Error("Missing or invalid Authorization header"));
        }
        queryParams.token = authToken.substring(7);
        this.logger.info("Successfully parsed request URL");
        return Result.Ok(queryParams);
    }

    public async createUserHandler(request: Request): Promise<Response> {
        this.logger.info("Handling user creation request");
        const res = await (await this.parseRequestBody(request))
            .flatMap((body) => {
                this.logger.info("Validating user registration DTO");
                return validateUserRegisterDto(body);
            })
            .flatMap(async (registerDto) => {
                this.logger.info("Registering user");
                return await this.userService.registerUser(registerDto);
            });

        return matchRes(res, {
            Ok: (user) => {
                this.logger.info("User created successfully");
                return new Response(JSON.stringify(user), {status: 201});
            },
            Err: (error) => {
                this.logger.error(`Error occurred during user creation: ${error}`);
                return new Response(JSON.stringify(error), {status: 400});
            }
        });
    }

    public async loginUserHandler(request: Request): Promise<Response> {
        this.logger.info("Handling user login request");
        const res = await (await this.parseRequestBody(request))
            .flatMap((body) => {
                this.logger.info("Validating user login DTO");
                return validateUserLoginDto(body);
            })
            .flatMap(async (loginDto) => {
                this.logger.info("Logging in user");
                return await this.userService.login(loginDto);
            });

        return matchRes(res, {
            Ok: (user) => {
                this.logger.info("User logged in successfully");
                return new Response(JSON.stringify(user), {status: 200});
            },
            Err: (error) => {
                this.logger.error(`Error occurred during user login: ${error}`);
                return new Response(JSON.stringify(error), {status: 401});
            }
        });
    }

    public async updateUserHandler(request: Request): Promise<Response> {
        this.logger.info("Handling user update request");
        const res = await (await this.parseRequestUrl(request))
            .flatMap(async (queryParams) => (await this.parseRequestBody(request))
                .flatMap((body) => {
                    this.logger.info("Validating user update DTO");
                    const combinedParams = { ...queryParams, ...body };
                    return validateUserUpdateDto(combinedParams);
                })
                    .flatMap(async (updateDto) => {
                        this.logger.info("Updating user");
                        return await this.userService.updateUser(updateDto);
                    }));

        return matchRes(res, {
            Ok: (user) => {
                this.logger.info("User updated successfully");
                return new Response(JSON.stringify(user), {status: 200});
            },
            Err: (error) => {
                this.logger.error(`Error occurred during user update: ${error}`);
                return new Response(JSON.stringify(error), {status: 400});
            }
        });
    }

    public async getUserHandler(request: Request): Promise<Response> {
        this.logger.info("Handling get user request");

        const res = await (await this.parseRequestUrl(request))
        .flatMap((queryParams) => {
            this.logger.info("Validating user get DTO");
            return validateUserGetOrDeleteDto(queryParams);
        })
        .flatMap(async (getDto) => {
            this.logger.info("Getting user");
            return await this.userService.getUser(getDto);
        });

        return matchRes(res, {
            Ok: (user) => {
                this.logger.info("User retrieved successfully");
                return new Response(JSON.stringify(user), { status: 200 });
            },
            Err: (error) => {
                this.logger.error(`Error occurred during user retrieval: ${error}`);
                return new Response(JSON.stringify(error), { status: 404 });
            }
        });
    }

    public async deleteUserHandler(request: Request): Promise<Response> {
        this.logger.info("Handling delete user request");
        const res = await (await this.parseRequestUrl(request))
        .flatMap(async (queryParams) => (await this.parseRequestBody(request))
            .flatMap((body) => {
                this.logger.info("Validating user delete DTO");
                const combinedParams = { ...queryParams, ...body };
                return validateUserGetOrDeleteDto(combinedParams);
            })
            .flatMap(async (deleteDto) => {
                this.logger.info("Deleting user");
                return await this.userService.deleteUser(deleteDto);
            }));

        return matchRes(res, {
            Ok: () => {
                this.logger.info("User deleted successfully");
                return new Response(JSON.stringify({ success: true }), {status: 204});
            },
            Err: (error) => {
                this.logger.error(`Error occurred during user deletion: ${error}`);
                return new Response(JSON.stringify(error), {status: 400});
            }
        });
    }
}
