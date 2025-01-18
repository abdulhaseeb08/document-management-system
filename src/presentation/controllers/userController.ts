import { UserService } from "../../app/services/user/UserService";
import { inject, injectable } from "inversify";
import { validateUserRegisterDto } from "../validators/UserRequestValidators";
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

}
