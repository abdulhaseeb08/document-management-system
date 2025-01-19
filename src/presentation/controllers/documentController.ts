import { DocumentService } from "../../app/services/document/DocumentService";
import { inject, injectable } from "inversify";
import { validateDocumentCreateDto } from "../validators/DocumentRequestValidators";
import type { Logger } from "../../app/ports/logger/logger";
import { INVERIFY_IDENTIFIERS } from "../../infra/di/inversify/inversify.types";
import { matchRes, Result } from "joji-ct-fp";

@injectable()
export class DocumentController {

    constructor(
        @inject(DocumentService) private documentService: DocumentService,
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

    public async parseFormDataToObject(formData: FormData): Promise<Result<Record<string, File | string>, Error>> {
        const result: Record<string, File | string> = {};

        formData.forEach((value, key) => {
          if (value instanceof File) {
            result[key] = value;
          } else {
            result[key] = value.toString();
          }
        });
      
        return Result.Ok(result);
      }
      

    public async createDocumentHandler(request: Request): Promise<Response> {
        this.logger.info("Handling document creation request");
        const formData = await request.formData();

        const res = await (await this.parseRequestUrl(request))
            .flatMap(async (queryParams) => (await this.parseFormDataToObject(formData))
                .flatMap(async (formData) => {
                    const combinedParams = Object({ ...queryParams, ...formData });
                    if (typeof combinedParams.tags === 'string') {
                        combinedParams.tags = JSON.parse(combinedParams.tags);
                    }
                    console.log(combinedParams);
                    return (await validateDocumentCreateDto(combinedParams))
                    .flatMap(async (createDocumentDto) => {
                        this.logger.info("Creating document");
                        return await this.documentService.createDocument(createDocumentDto);
                    });
                }));

        return matchRes(res, {
            Ok: (document) => {
                this.logger.info("Document created successfully");
                return new Response(JSON.stringify(document), { status: 201 });
            },
            Err: (error) => {
                this.logger.error(`Error occurred during document creation: ${error}`);
                return new Response(JSON.stringify(error), { status: 400 });
            }
        });
    }
}
