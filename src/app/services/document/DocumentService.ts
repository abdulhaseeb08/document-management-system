import type { UUID } from "../../../shared/types";
import type { Document } from "../../../domain/entities/document/Document";
import type { DocumentRepository } from "../../../domain/entities/document/port/DocumentRepository";
import type { DocumentMetadata } from "../../../domain/valueObjects/DocumentMetadata";
import { DocumentEntity } from "../../../domain/entities/document/DocumentEntity";
import { injectable, inject } from "inversify";
import { INVERIFY_IDENTIFIERS } from "../../../infra/di/inversify/inversify.types";
import type { Logger } from "../../ports/logger/logger";
import { matchRes, Result } from "joji-ct-fp";
import type { DocumentCreateDtoType, DocumentDeleteDtoType, DocumentGetDtoType, DocumentUpdateDtoType, DownloadDocumentDtoType } from "../../dtos/DocumentDtos";
import { FileService } from "../file/fileService";
import { PermissionService } from "../permission/permissionService";
import { DocumentRole } from "../../../shared/enums/DocumentRole";
import { createSecretKey } from 'crypto';
import type { JWTAuth } from "../../ports/jwt/jwt";
import { DocumentAlreadyExistsError, DocumentDoesNotExistError } from "../../errors/DocumentErrors";
import type { DatabaseManager } from "../../ports/database/database";

@injectable()
export class DocumentService {
    constructor(
        @inject(INVERIFY_IDENTIFIERS.DocumentRepository) private documentRepository: DocumentRepository,
        @inject(INVERIFY_IDENTIFIERS.Logger) private logger: Logger,
        @inject(FileService) private fileService: FileService,
        @inject(PermissionService) private permissionService: PermissionService,
        @inject(INVERIFY_IDENTIFIERS.JWT) private jwtAdapter: JWTAuth,
        @inject(INVERIFY_IDENTIFIERS.DatabaseManager) private databaseManager: DatabaseManager
    ) {}

    public async createDocument(documentCreateDto: DocumentCreateDtoType): Promise<Result<Document, Error>> {
        this.logger.info("Starting document creation process");

        const secretKey = createSecretKey(new TextEncoder().encode(process.env.JWT_SECRET));
        const res = await (await this.jwtAdapter.verify(documentCreateDto.token, secretKey))
            .flatMap(async (payload) => {
                const creatorId = payload.userId as UUID;
                return (await this.documentRepository.getAll(creatorId))
                    .flatMap(async (documents) => {
                        for (const document of documents) {
                            if (document.documentMetadata.name === documentCreateDto.name) {
                                this.logger.warn("Document with name already exists: " + documentCreateDto.name);
                                return Result.Err(new DocumentAlreadyExistsError("Document with this name already exists"));
                            }
                        }
                        return Result.Ok(documents)
                            .flatMap(async () => {
                                return (await this.fileService.uploadFile(documentCreateDto.file, documentCreateDto.name, creatorId))
                                    .flatMap(async (filePath) => {
                                        this.logger.info(`File uploaded successfully: ${filePath}`);
                                        return await DocumentEntity.create(creatorId, filePath, documentCreateDto.name, documentCreateDto.tags ?? [], documentCreateDto.documentFormat)
                                            .flatMap(async (entity) => {
                                                this.logger.info("Document entity created successfully");
                                                return (await this.documentRepository.create(entity))
                                                    .flatMap(async (doc) => 
                                                        (await this.permissionService.grantPermission({
                                                            userId: creatorId, 
                                                            creatorId: creatorId, 
                                                            documentId: doc.id, 
                                                            permissionType: DocumentRole.CREATOR
                                                        }))
                                                        .flatMap(() => Result.Ok(doc))
                                                    );
                                            });
                                    });
                            })
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

    public async updateDocument(updateDocumentDto: DocumentUpdateDtoType): Promise<Result<Document, Error>> {
        this.logger.info("Starting document update process");

        const secretKey = createSecretKey(new TextEncoder().encode(process.env.JWT_SECRET));
        const res = await (await this.jwtAdapter.verify(updateDocumentDto.token, secretKey))
            .flatMap(async (payload) => {
                const userId = payload.userId as UUID;
                return (await this.permissionService.getPermissions(userId))
                    .flatMap(async (permissions) => {
                        const hasPermission = permissions.some(permission => 
                            (permission.documentId === updateDocumentDto.documentId && 
                            (permission.permissionType === DocumentRole.EDITOR || 
                            permission.permissionType === DocumentRole.CREATOR))
                        );

                        if (!hasPermission) {
                            this.logger.warn(`User ID: ${userId} does not have permission to update document ID: ${updateDocumentDto.documentId}`);
                            return Result.Err(new DocumentDoesNotExistError("Document does not exist or access denied"));
                        }

                        return (await this.documentRepository.get(updateDocumentDto.documentId))
                            .flatMap(async (document) => {
                                const oldFilePath = document.filePath;
                                const newFilePath = oldFilePath.replace(document.documentMetadata.name, updateDocumentDto.name ?? document.documentMetadata.name);

                                document.documentMetadata.name = updateDocumentDto.name ?? document.documentMetadata.name;
                                document.filePath = newFilePath;

                                document.documentMetadata.tags = updateDocumentDto.tags ?? document.documentMetadata.tags;

                                return (await this.fileService.renameFile(oldFilePath, newFilePath))
                                    .flatMap(async() => {
                                        return (await DocumentEntity.create(document.creatorId, document.filePath, document.documentMetadata.name, document.documentMetadata.tags, document.documentMetadata.documentFormat, document.id, document.createdAt, userId))
                                            .flatMap(async (entity) => {
                                                return (await this.documentRepository.update(entity))
                                                    .flatMap(() => Result.Ok(entity));
                                            });
                                    })
                            });
                    });
            });

        return matchRes(res, {
            Ok: (id) => Result.Ok(id),
            Err: (err) => Result.Err(err)
        });
    }

    public async get(getDocumentDto: DocumentGetDtoType): Promise<Result<Document[], Error>> {
        this.logger.info("Retrieving documents");
        const secretKey = createSecretKey(new TextEncoder().encode(process.env.JWT_SECRET));
        const res = await (await this.jwtAdapter.verify(getDocumentDto.token, secretKey))
            .flatMap(async (payload) => {
                const extractedUserId = payload.userId as UUID;
                return (await this.permissionService.getPermissions(extractedUserId))
                    .flatMap(async (permissions) => {
                        const documentIds = permissions
                            .filter(permission => 
                                permission.permissionType === DocumentRole.CREATOR || 
                                permission.permissionType === DocumentRole.EDITOR || 
                                permission.permissionType === DocumentRole.VIEWER
                            )
                            .map(permission => permission.documentId);

                        if (documentIds.length === 0) {
                            return Result.Err(new DocumentDoesNotExistError("No documents found"));
                        }

                        const documents = await Promise.all(documentIds.map(id => this.documentRepository.get(id)));
                        const successfulDocuments = documents.filter(result => result.isOk()).map(result => result.unwrap());
                        return Result.Ok(successfulDocuments);
                    });
            });

        return matchRes(res, {
            Ok: (documents) => Result.Ok(documents),
            Err: (err) => Result.Err(err)
        });
    }

    public async downloadDocument(downloadDocumentDto: DownloadDocumentDtoType): Promise<Result<Document, Error>> {
        this.logger.info("Downloading document");
        const secretKey = createSecretKey(new TextEncoder().encode(process.env.JWT_SECRET));
        const res = await (await this.jwtAdapter.verify(downloadDocumentDto.token, secretKey))
            .flatMap(async (payload) => {
                const extractedUserId = payload.userId as UUID;
                return (await this.permissionService.getPermissions(extractedUserId))
                    .flatMap(async (permissions) => {
                        const hasPermission = permissions.some(permission => 
                            permission.documentId === downloadDocumentDto.documentId && 
                            (permission.permissionType === DocumentRole.CREATOR || 
                             permission.permissionType === DocumentRole.EDITOR || 
                             permission.permissionType === DocumentRole.VIEWER)
                        );

                        if (!hasPermission) {
                            return Result.Err(new DocumentDoesNotExistError("Document does not exist or access denied"));
                        }

                        return (await this.documentRepository.get(downloadDocumentDto.documentId))
                            .flatMap(async (document) => {
                                if (!document) {
                                    return Result.Err(new DocumentDoesNotExistError("Document not found"));
                                }

                                const filePath = document.filePath;
                                return (await this.fileService.downloadFile(filePath, String(process.env.DOWNLOAD_FOLDER)))
                                    .flatMap(() => Result.Ok(document));
                            });
                    });
            });

        return matchRes(res, {
            Ok: (res) => Result.Ok(res),
            Err: (err) => Result.Err(err)
        });
    }

    public async deleteDocument(deleteDocumentDto: DocumentDeleteDtoType): Promise<Result<boolean, Error>> {
        this.logger.info("Deleting document");
        const secretKey = createSecretKey(new TextEncoder().encode(process.env.JWT_SECRET));
        const res = await (await this.jwtAdapter.verify(deleteDocumentDto.token, secretKey))
            .flatMap(async (payload) => {
                const extractedUserId = payload.userId as UUID;
                return (await this.permissionService.getPermissions(extractedUserId))
                    .flatMap(async (permissions) => {
                        const hasPermission = permissions.some(permission => 
                            permission.documentId === deleteDocumentDto.documentId && 
                            permission.permissionType === DocumentRole.CREATOR
                        );

                        if (!hasPermission) {
                            return Result.Err(new DocumentDoesNotExistError("Document does not exist or access denied"));
                        }

                        return (await this.documentRepository.get(deleteDocumentDto.documentId))
                            .flatMap(async (document) => {
                                const filePath = document.filePath;
                                return (await this.fileService.deleteFile(filePath))
                                    .flatMap(async () => {
                                        return (await this.documentRepository.delete(deleteDocumentDto.documentId))
                                            .flatMap(() => Result.Ok(true));
                                    });
                            });
                    });
            });

        return matchRes(res, {
            Ok: (res) => Result.Ok(res),
            Err: (err) => Result.Err(err)
        });
    }

    public async searchRepository(metadata: DocumentMetadata): Promise<Result<Document[], Error>> {
        return await this.documentRepository.search(metadata);
    }
}