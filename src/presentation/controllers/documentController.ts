import { DocumentService } from "../../app/services/document/DocumentService";
import { inject, injectable } from "inversify";
import { validateDocumentCreateDto, validateDocumentGetDto, validateDocumentUpdateDto, validateDownloadDocumentDto, validateDeleteDocumentDto, validateDocumentSearchDto } from "../validators/DocumentRequestValidators";
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
                .flatMap((formData) => {
                    const combinedParams = Object({ ...queryParams, ...formData });
                    if (typeof combinedParams.tags === 'string') {
                        combinedParams.tags = JSON.parse(combinedParams.tags);
                    }
                    return (validateDocumentCreateDto(combinedParams))
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

    public async updateDocumentHandler(request: Request): Promise<Response> {
        this.logger.info("Handling document update request");

        const res = await (await this.parseRequestUrl(request))
            .flatMap(async (queryParams) => (await this.parseRequestBody(request))
                .flatMap((body) => {
                    const combinedParams = Object({ ...queryParams, ...body });
                    return (validateDocumentUpdateDto(combinedParams))
                    .flatMap(async (updateDocumentDto) => {
                        this.logger.info("Updating document");
                        return await this.documentService.updateDocument(updateDocumentDto);
                    });
                }));

        return matchRes(res, {
            Ok: (document) => {
                this.logger.info("Document updated successfully");
                return new Response(JSON.stringify(document), { status: 200 });
            },
            Err: (error) => {
                this.logger.error(`Error occurred during document update: ${error}`);
                return new Response(JSON.stringify(error), { status: 400 });
            }
        });
    }
    
    public async getDocumentHandler(request: Request): Promise<Response> {
        this.logger.info("Handling document retrieval request");

        const res = await (await this.parseRequestUrl(request))
            .flatMap((queryParams) => {
                const combinedParams = Object({ ...queryParams });
                return (validateDocumentGetDto(combinedParams))
                .flatMap(async (getDocumentDto) => {
                    this.logger.info("Retrieving document");
                    return await this.documentService.get(getDocumentDto);
                });
            });

        return matchRes(res, {
            Ok: (documents) => {
                this.logger.info("Documents retrieved successfully");
                return new Response(JSON.stringify(documents), { status: 200 });
            },
            Err: (error) => {
                this.logger.error(`Error occurred during document retrieval: ${error}`);
                return new Response(JSON.stringify(error), { status: 400 });
            }
        });
    }


    public async downloadDocumentHandler(request: Request): Promise<Response> {
        this.logger.info("Handling document download request");

        const res = await (await this.parseRequestUrl(request))
            .flatMap((queryParams) => {
                const combinedParams = Object({ ...queryParams });
                return (validateDownloadDocumentDto(combinedParams))
                .flatMap(async (downloadDocumentDto) => {
                    this.logger.info("Downloading document");
                    return await this.documentService.downloadDocument(downloadDocumentDto);
                });
            });

        return matchRes(res, {
            Ok: (filePath) => {
                this.logger.info("Document downloaded successfully");
                return new Response(JSON.stringify({ filePath }), { status: 200 });
            },
            Err: (error) => {
                this.logger.error(`Error occurred during document download: ${error}`);
                return new Response(JSON.stringify(error), { status: 400 });
            }
        });
    }

    public async deleteDocumentHandler(request: Request): Promise<Response> {
        this.logger.info("Handling document deletion request");

        const res = await (await this.parseRequestUrl(request))
            .flatMap((queryParams) => {
                const combinedParams = Object({ ...queryParams });
                return (validateDeleteDocumentDto(combinedParams))
                .flatMap(async (deleteDocumentDto) => {
                    this.logger.info("Deleting document");
                    return await this.documentService.deleteDocument(deleteDocumentDto);
                });
            });

        return matchRes(res, {
            Ok: () => {
                this.logger.info("Document deleted successfully");
                return new Response(JSON.stringify({ success: true }), { status: 200 });
            },
            Err: (error) => {
                this.logger.error(`Error occurred during document deletion: ${error}`);
                return new Response(JSON.stringify(error), { status: 400 });
            }
        });
    }

    public async searchDocumentHandler(request: Request): Promise<Response> {
        this.logger.info("Handling document search request");
        const res = await (await this.parseRequestBody(request))
            .flatMap(async (body) => {
                return (await this.parseRequestUrl(request))
                    .flatMap((queryParams) => {
                        const combinedParams = Object({ ...queryParams, ...body });
                        return validateDocumentSearchDto(combinedParams)
                            .flatMap(async (documentSearchDto) => {
                                this.logger.info("Searching documents");
                                return await this.documentService.searchRepository(documentSearchDto);
                            });
                    });
            });

        return matchRes(res, {
            Ok: (documents) => {
                this.logger.info("Documents found successfully");
                return new Response(JSON.stringify(documents), { status: 200 });
            },
            Err: (error) => {
                this.logger.error(`Error occurred during document search: ${error}`);
                return new Response(JSON.stringify(error), { status: 400 });
            }
        });
    }


}
