import { PermissionService } from "../../app/services/permission/permissionService";
import { inject, injectable } from "inversify";
import { validateGrantPermissionDto, validateRevokePermissionDto } from "../validators/PermissionRequestValidators";
import type { Logger } from "../../app/ports/logger/logger";
import { INVERIFY_IDENTIFIERS } from "../../infra/di/inversify/inversify.types";
import { matchRes, Result } from "joji-ct-fp";

@injectable()
export class PermissionController {

    constructor(
        @inject(PermissionService) private permissionService: PermissionService,
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

    public async grantPermissionHandler(request: Request): Promise<Response> {
        this.logger.info("Handling permission grant request");

        const res = await (await this.parseRequestUrl(request))
            .flatMap(async (queryParams) => (await this.parseRequestBody(request))
                .flatMap((body) => {
                    const combinedParams = Object({ ...queryParams, ...body });
                    return validateGrantPermissionDto(combinedParams)
                        .flatMap(async (grantPermissionDto) => {
                            this.logger.info("Granting permission");
                            return await this.permissionService.grantPermission(grantPermissionDto);
                        });
                }));

        return matchRes(res, {
            Ok: (permission) => {
                this.logger.info("Permission granted successfully");
                return new Response(JSON.stringify(permission), { status: 201 });
            },
            Err: (error) => {
                this.logger.error(`Error occurred during permission grant: ${error}`);
                return new Response(JSON.stringify(error), { status: 400 });
            }
        });
    }

    public async revokePermissionHandler(request: Request): Promise<Response> {
        this.logger.info("Handling permission revoke request");

        const res = await (await this.parseRequestUrl(request))
            .flatMap(async (queryParams) => (await this.parseRequestBody(request))
                .flatMap((body) => {
                    const combinedParams = Object({ ...queryParams, ...body });
                    return validateRevokePermissionDto(combinedParams)
                        .flatMap(async (revokePermissionDto) => {
                            this.logger.info("Revoking permission");
                            return await this.permissionService.revokePermission(revokePermissionDto);
                        });
                }));

        return matchRes(res, {
            Ok: () => {
                this.logger.info("Permission revoked successfully");
                return new Response(JSON.stringify({ success: true }), { status: 200 });
            },
            Err: (error) => {
                this.logger.error(`Error occurred during permission revoke: ${error}`);
                return new Response(JSON.stringify(error), { status: 400 });
            }
        });
    }
}
