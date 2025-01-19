import type { UUID } from "../../../shared/types";
import type { Document } from "../../../domain/entities/document/Document";
import type { DocumentRepository } from "../../../domain/entities/document/port/DocumentRepository";
import type { DocumentMetadata } from "../../../domain/valueObjects/DocumentMetadata";
import { DocumentEntity } from "../../../domain/entities/document/DocumentEntity";
import { injectable, inject } from "inversify";
import { INVERIFY_IDENTIFIERS } from "../../../infra/di/inversify/inversify.types";
import type { Logger } from "../../ports/logger/logger";
import { matchRes, Result } from "joji-ct-fp";
import type { DocumentCreateDtoType } from "../../dtos/DocumentDtos";
import { FileService } from "../file/fileService";
import { PermissionService } from "../permission/permissionService";
import { DocumentRole } from "../../../shared/enums/DocumentRole";
import { createSecretKey } from 'crypto';
import type { JWTAuth } from "../../ports/jwt/jwt";

@injectable()
export class DocumentService {
    constructor(
        @inject(INVERIFY_IDENTIFIERS.DocumentRepository) private documentRepository: DocumentRepository,
        @inject(INVERIFY_IDENTIFIERS.Logger) private logger: Logger,
        @inject(FileService) private fileService: FileService,
        @inject(PermissionService) private permissionService: PermissionService,
        @inject(INVERIFY_IDENTIFIERS.JWT) private jwtAdapter: JWTAuth
    ) {}

    public async createDocument(documentCreateDto: DocumentCreateDtoType): Promise<Result<Document, Error>> {
        this.logger.info("Starting document creation process");

        const secretKey = createSecretKey(new TextEncoder().encode(process.env.JWT_SECRET));
        const res = await (await this.jwtAdapter.verify(documentCreateDto.token, secretKey))
            .flatMap(async (payload) => {
                const creatorId = payload.userId as UUID;
                return (await this.fileService.uploadFile(documentCreateDto.file, documentCreateDto.name))
                    .flatMap(async (filePath) => {
                        this.logger.info(`File uploaded successfully: ${filePath}`);
                        return await DocumentEntity.create(creatorId, filePath, documentCreateDto.name, documentCreateDto.tags ?? [], documentCreateDto.documentFormat)
                            .flatMap(async (entity) => {
                                this.logger.info("Document entity created successfully");
                                return (await this.documentRepository.create(entity))
                                    .flatMap(async (doc) => (await this.permissionService.grantPermission({userId: creatorId, creatorId: creatorId, documentId: doc.id, permissionType: DocumentRole.CREATOR}))
                                        .flatMap(() => Result.Ok(doc)));
                            });
                    });
            });

        return matchRes(res, {
            Ok: (res) => {
                this.logger.info(`Document created successfully with ID: ${res.id}`);
                return Result.Ok(res);
            },
            Err: (err) => {
                this.logger.error(`Error occurred during document creation ${err}`);
                return Result.Err(err);
            }
        });
    }

    // public async updateDocument(updateDocumentDto: DocumentUpdateDtoType): Promise<Result<string, Error>> {
    //     const res = await this.documentRepository.update(updateDocumentDto.documentId, updateDocumentDto.name, updateDocumentDto.tags);
    //     return matchRes(res, {
    //         Ok: (id) => Result.Ok(id),
    //         Err: (err) => Result.Err(err)
    //     });
    // }

    // public async getDocument(id: string): Promise<Result<Document, Error>> {
    //     return await this.documentRepository.get(id);
    // }

    // public async deleteDocument(id: string): Promise<Result<boolean, Error>> {
    //     const res = await this.documentRepository.delete(id);
    //     return matchRes(res, {
    //         Ok: (success) => Result.Ok(success),
    //         Err: (err) => Result.Err(err)
    //     });
    // }

    // public async searchRepository(metadata: DocumentMetadata): Promise<Result<Document[], Error>> {
    //     return await this.documentRepository.search(metadata);
    // }
}