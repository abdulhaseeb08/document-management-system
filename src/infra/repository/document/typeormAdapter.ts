import type { DocumentRepository } from "../../../domain/document/port/DocumentRepository";
import { Document } from "../../../domain/document/Document";
import { DocumentEntity } from "../../database/typeorm/entities/DocumentEntity";
import { Repository, In, Any } from "typeorm";
import { DataSource } from 'typeorm';
import type { CommandResult } from "../../../shared/types/types";

export class TypeORMDocumnetRepository implements DocumentRepository {
    private repository: Repository<DocumentEntity>;
    public dataSource: DataSource;

    constructor(dataSource: DataSource) {
        this.dataSource = dataSource;
        this.repository = dataSource.getRepository(DocumentEntity);
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
        const entity = await this.repository.findOne({where: {id}});
        return entity ? this.toDomain(entity) : null;
    }

    private toEntity(document: Document): DocumentEntity {
        const entity = new DocumentEntity();
        entity.id = document.id;
        entity.name = document.name;
        entity.tags = document.tags;
        entity.createdAt = document.createdAt;
        entity.creatorId = document.creatorId;
        entity.updatedAt = document.updatedAt;
        entity.updatedBy = document.updatedBy;
        entity.documentFormat = document.documentFormat;
        return entity;
    }

    private toDomain(entity: DocumentEntity): Document {
        return new Document(
            entity.creatorId,
            {
                name: entity.name,
                tags: entity.tags,
                createdAt: entity.createdAt,
                updatedAt: entity.updatedAt,
                updatedBy: entity.updatedBy,
                documentFormat: entity.documentFormat
            }
        )
    }
}