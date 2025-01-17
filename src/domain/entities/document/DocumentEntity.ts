import { FileFormat } from "../../../shared/enums/FileFormats";
import type { Document} from "./Document";
import type { DocumentMetadata } from "../../valueObjects/DocumentMetadata";
import type { UUID } from "../../../shared/types";
import { DocumentSchema, DocumentMetadataSchema} from "../../../app/schema/DocumentScehma";

export class DocumentEntity implements Document {
    readonly id: UUID;
    readonly creatorId: UUID;
    readonly createdAt: Date;
    documentMetadata: DocumentMetadata;

    private constructor(creatorId: UUID, documentMetadata: DocumentMetadata) {
        this.id = crypto.randomUUID() as UUID;
        this.creatorId = creatorId;
        this.documentMetadata.updatedBy = creatorId; //on initial document creation, this field will be the creator
        this.createdAt = new Date();
        this.documentMetadata = documentMetadata;
    }

    public static create(creatorId: UUID, documentMetadata: DocumentMetadata): DocumentEntity {
        const documentEntity = new DocumentEntity(creatorId, documentMetadata);
        DocumentSchema.safeParse(documentEntity.serialize());
        return documentEntity;
    }

    public setName(userId: UUID, name: string): void {
        DocumentMetadataSchema.shape.name.safeParse(name);
        DocumentMetadataSchema.shape.updatedBy.safeParse(userId);
        this.documentMetadata.name = name;
        this.documentMetadata.updatedAt = new Date();
        this.documentMetadata.updatedBy = userId;
    }

    public setTags(userId: UUID, tags: string[]): void {
        DocumentMetadataSchema.shape.tags.safeParse(tags);
        DocumentMetadataSchema.shape.updatedBy.safeParse(userId);
        this.documentMetadata.tags = tags;
        this.documentMetadata.updatedAt = new Date();
        this.documentMetadata.updatedBy = userId;
    }

    public getId(): UUID {
        return this.id;
    }

    public getCreatorId(): UUID {
        return this.creatorId;
    }

    public getDocumentMetadata(): DocumentMetadata {
        return this.documentMetadata;
    }

    public getDocumentName(): string {
        return this.documentMetadata.name;
    }

    public getDocumentTags(): string[] {
        return this.documentMetadata.tags;
    }

    public getCreatedAt(): Date {
        return this.createdAt;
    }

    public getLastUpdatedAt(): Date {
        return this.documentMetadata.updatedAt
    }

    public getDocumentFormat(): FileFormat {
        return this.documentMetadata.documentFormat;
    }

    public getLastUpdatedBy(): UUID {
        return this.documentMetadata.updatedBy;
    }

    serialize(): Document {
        return {
           id: this.id,
           creatorId: this.creatorId,
           createdAt: this.createdAt,
           documentMetadata: this.documentMetadata
        };
    }
}