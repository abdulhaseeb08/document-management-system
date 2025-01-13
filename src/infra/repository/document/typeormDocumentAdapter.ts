import type { DocumentRepository } from "../../../domain/document/port/DocumentRepository";
import { Document } from "../../../domain/document/Document";
import { DocumentEntity } from "../../database/typeorm/entities/DocumentEntity";
import { Repository} from "typeorm";
import { DataSource } from 'typeorm';
import type { CommandResult } from "../../../shared/types";
import type { DocumentMetadata } from "../../../domain/document/DocumentMetadata";
import { injectable } from "inversify";

@injectable()
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
        const entity = await this.repository.findOne({where: {id: id}});
        return entity ? this.toDomain(entity) : null;
    }

    public async delete(id: string): Promise<CommandResult<string>> {
        try {
            if (await this.repository.exists({where:{id: id}})) {
                const res = await this.repository.delete(id);
                return { success: true, value: `Rows affected: ${res.affected}`};
            }
            return { success: true, value: `IdRows affected: 0`};
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
        if (metadata.createdAt) {
            query.andWhere("DATE(document.createdAt) = :createdAt", { createdAt: metadata.createdAt.toISOString().split('T')[0] });
        }
        if (metadata.updatedAt) {
            query.andWhere("DATE(document.updatedAt) = :updatedAt", { updatedAt: metadata.updatedAt.toISOString().split('T')[0] });
          }
        if (metadata.updatedBy) {
            query.andWhere("document.updatedBy = :updatedBy", { updatedBy: metadata.updatedBy });
        }
        if (metadata.documentFormat) {
            query.andWhere("document.documentFormat = :documentFormat", { documentFormat: metadata.documentFormat });
        }
        const res = await query.getMany();
        return res ? this.toDomain(res) : null;
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

    private toDomain(entity: DocumentEntity): Document;
    private toDomain(entity: DocumentEntity[]): Document[];
    private toDomain(entity: DocumentEntity | DocumentEntity[]): Document | Document[] {
        if (Array.isArray(entity)) {
            return entity.map(singleEntity => new Document(
                singleEntity.creatorId,
                {
                    name: singleEntity.name,
                    tags: singleEntity.tags,
                    createdAt: singleEntity.createdAt,
                    updatedAt: singleEntity.updatedAt,
                    updatedBy: singleEntity.updatedBy,
                    documentFormat: singleEntity.documentFormat
                },
                singleEntity.id
            ));
        }
    
        return new Document(
            entity.creatorId,
            {
                name: entity.name,
                tags: entity.tags,
                createdAt: entity.createdAt,
                updatedAt: entity.updatedAt,
                updatedBy: entity.updatedBy,
                documentFormat: entity.documentFormat
            },
            entity.id
        );
    }
}