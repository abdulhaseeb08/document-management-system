import type { DocumentRepository } from "../../../domain/entities/document/port/DocumentRepository";
import type { Document } from "../../../domain/entities/document/Document";
import { DocumentModel } from "../../database/typeorm/models/DocumentModel";
import { Repository} from "typeorm";
import { DataSource } from 'typeorm';
import type { UUID } from "../../../shared/types";
import type { DocumentMetadata } from "../../../domain/valueObjects/DocumentMetadata";
import { injectable, inject } from "inversify";
import { matchRes, Result } from "joji-ct-fp";
import { DocumentDoesNotExistError } from "../../../app/errors/DocumentErrors";
import { INVERIFY_IDENTIFIERS } from "../../di/inversify/inversify.types";
import type { DocumentEntity } from "../../../domain/entities/document/DocumentEntity";
import { UUIDSchema } from "../../../shared/types";
import type { UserModel } from "../../database/typeorm/models/UserModel";

@injectable()
export class TypeORMDocumnetRepository implements DocumentRepository {
    private repository: Repository<DocumentModel>;
    private dataSource: DataSource;

    constructor(@inject(INVERIFY_IDENTIFIERS.TypeORMDataSource) dataSource: DataSource) {
        this.dataSource = dataSource;
        this.repository = dataSource.getRepository(DocumentModel);
    }

    public async create(document: DocumentEntity): Promise<Result<Document, Error>> {
        const entity = this.toEntity(document);
        await this.repository.save(entity);
        return Result.Ok(this.toDomain(entity));
    }

    public async update(document: DocumentEntity): Promise<Result<Document, Error>> {
        const entity = this.toEntity(document);
        await this.repository.save(entity);
        return Result.Ok(this.toDomain(entity));
    }

    public async get(id: string): Promise<Result<Document, Error>> {
        const isUUID = UUIDSchema.safeParse(id).success;
        const entity = isUUID 
            ? await this.repository.findOne({ where: { id: id } ,relations: ['creator', 'updatedBy']})
            : await this.repository.findOne({ where: { name: id } ,relations: ['creator', 'updatedBy']});
        return entity ? Result.Ok(this.toDomain(entity)) : Result.Err(new DocumentDoesNotExistError("Document not found"));
    }

    public async getAll(userId: UUID): Promise<Result<Document[], Error>> {
        const entities = await this.repository.find({ where: { creator: { id: userId } }, relations: ['creator', 'updatedBy'] });
        return entities ? Result.Ok(this.toDomain(entities)) : Result.Err(new DocumentDoesNotExistError("Documents not found"));
    }

    public async delete(id: string): Promise<Result<boolean, Error>> {
        const res = await (await this.get(id))
            .flatMap(async () => Result.Ok(await this.repository.delete(id)))
        return matchRes(res, {
            Ok: () => Result.Ok(true),
            Err: (err) => Result.Err(err)
        });
    }

    public async search(metadata: Partial<DocumentMetadata>): Promise<Result<Document[], Error>> {
        const query = this.repository.createQueryBuilder('document')
            .leftJoinAndSelect('document.creator', 'creator')
            .leftJoinAndSelect('document.updatedBy', 'updatedBy');
        if (metadata.name) {
            query.andWhere("LOWER(document.name) LIKE :name", { name: `%${metadata.name.toLowerCase()}%` });
        }
        if (metadata.tags) {
            query.andWhere("document.tags ?| :tags", { tags: metadata.tags });
        }
        if (metadata.updatedAt) {
            query.andWhere("DATE(document.updatedAt) = :updatedAt", { updatedAt: metadata.updatedAt.toISOString().split('T')[0] });
        }
        if (metadata.documentFormat) {
            query.andWhere("document.documentFormat = :documentFormat", { documentFormat: metadata.documentFormat });
        }
        const res = await query.getMany();
        return res ? Result.Ok(this.toDomain(res)) : Result.Err(new DocumentDoesNotExistError("Documents not found"));
    }

    private toEntity(document: Document): DocumentModel {
        const entity = new DocumentModel();
        entity.id = document.id;
        entity.name = document.documentMetadata.name;
        entity.tags = document.documentMetadata.tags;
        entity.createdAt = document.createdAt;
        entity.filePath = document.filePath;
        entity.creator = {id: document.creatorId} as unknown as UserModel;
        entity.updatedAt = document.documentMetadata.updatedAt;
        entity.updatedBy = {id: document.documentMetadata.updatedBy} as unknown as UserModel;
        entity.documentFormat = document.documentMetadata.documentFormat;
        return entity;
    }

    private toDomain(entity: DocumentModel): Document;
    private toDomain(entity: DocumentModel[]): Document[];
    private toDomain(entity: DocumentModel | DocumentModel[]): Document | Document[] {
        if (Array.isArray(entity)) {
            return entity.map(singleEntity => ({
                id: singleEntity.id as UUID,
                creatorId: singleEntity.creator.id as UUID,
                createdAt: singleEntity.createdAt,
                filePath: singleEntity.filePath,
                documentMetadata: {
                    name: singleEntity.name,
                    tags: singleEntity.tags,
                    updatedAt: singleEntity.updatedAt,
                    updatedBy: singleEntity.updatedBy.id as UUID,
                    documentFormat: singleEntity.documentFormat
                }
            }));
        }
        return {
            id: entity.id as UUID,
            creatorId: entity.creator.id as UUID,
            createdAt: entity.createdAt,
            filePath: entity.filePath,
            documentMetadata: {
                name: entity.name,
                tags: entity.tags,
                updatedAt: entity.updatedAt,
                updatedBy: entity.updatedBy.id as UUID,
                documentFormat: entity.documentFormat
            }
        };
    }
}