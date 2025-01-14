import type { DocumentRepository } from "../../../domain/entities/document/port/DocumentRepository";
import type { Document } from "../../../domain/entities/document/Document";
import { DocumentModel } from "../../database/typeorm/models/DocumentModel";
import { Repository} from "typeorm";
import { DataSource } from 'typeorm';
import type { CommandResult, UUID } from "../../../shared/types";
import type { DocumentMetadata } from "../../../domain/valueObjects/DocumentMetadata";
import { injectable } from "inversify";

@injectable()
export class TypeORMDocumnetRepository implements DocumentRepository {
    private repository: Repository<DocumentModel>;
    public dataSource: DataSource;

    constructor(dataSource: DataSource) {
        this.dataSource = dataSource;
        this.repository = dataSource.getRepository(DocumentModel);
    }

    public async create(document: Document): Promise<CommandResult<string>> {
        try {
            const entity = this.toEntity(document);
            await this.repository.save(entity);
            return { success: true, value: entity.id };
        } catch (err) {
            return { success: false, error: err as Error };
        }
    }

    public async update(document: Document): Promise<CommandResult<string>> {
        try {
            const entity = this.toEntity(document);
            await this.repository.save(entity);
            return { success: true, value: entity.id };
        } catch (err) {
            return { success: false, error: err as Error };
        }
    }

    public async get(id: string): Promise<Document | null> {
        const entity = await this.repository.findOne({where: {id: id}});
        return entity ? this.toDomain(entity) : null;
    }

    public async delete(id: string): Promise<CommandResult<string>> {
        try {
            if (await this.repository.exists({where:{id: id}})) {
                const res = await this.repository.delete(id);
                return { success: true, value: `Rows affected: ${res.affected}`};
            }
            return { success: false, error: Error(`Document does not exist`)};
        } catch (err) {
            return { success: false, error: err as Error };
        }
    }

    public async search(metadata: DocumentMetadata): Promise<Document[] | null> {
        const query = this.repository.createQueryBuilder('document')
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
        return res ? this.toDomain(res) : null;
    }

    private toEntity(document: Document): DocumentModel {
        const entity = new DocumentModel();
        entity.id = document.id;
        entity.name = document.documentMetadata.name;
        entity.tags = document.documentMetadata.tags;
        entity.createdAt = document.createdAt;
        entity.id = document.creatorId;
        entity.updatedAt = document.documentMetadata.updatedAt;
        entity.updatedBy = document.updatedBy;
        entity.creator = document.creatorId;
        entity.documentFormat = document.documentMetadata.documentFormat;
        return entity;
    }

    private toDomain(entity: DocumentModel): Document;
    private toDomain(entity: DocumentModel[]): Document[];
    private toDomain(entity: DocumentModel | DocumentModel[]): Document | Document[] {
        if (Array.isArray(entity)) {
            return entity.map(singleEntity => ({
                id: singleEntity.id as UUID,
                creatorId: singleEntity.creator as UUID,
                createdAt: singleEntity.createdAt,
                updatedBy: singleEntity.updatedBy as UUID,
                documentMetadata: {
                    name: singleEntity.name,
                    tags: singleEntity.tags,
                    updatedAt: singleEntity.updatedAt,
                    documentFormat: singleEntity.documentFormat
                }
            }));
        }
    
        return {
            id: entity.id as UUID,
            creatorId: entity.creator as UUID,
            createdAt: entity.createdAt,
            updatedBy: entity.updatedBy as UUID,
            documentMetadata: {
                name: entity.name,
                tags: entity.tags,
                updatedAt: entity.updatedAt,
                documentFormat: entity.documentFormat
            }
        };
    }
}