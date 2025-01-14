import { FileFormat } from "../../../shared/enums/FileFormats";
import type { Document} from "./Document";
import type { DocumentMetadata } from "../../valueObjects/DocumentMetadata";
import type { UUID } from "../../../shared/types";
import type { CommandResult } from "../../../shared/types";
import { DocumentSchema, DocumentMetadataSchema} from "../../schema/DocumentScehma";

export class DocumentEntity implements Document {
    readonly id: UUID;
    readonly creatorId: UUID;
    readonly createdAt: Date;
    updatedBy: UUID;
    documentMetadata: DocumentMetadata;

    private constructor(creatorId: UUID, documentMetadata: DocumentMetadata) {
        this.id = crypto.randomUUID() as UUID;
        this.creatorId = creatorId;
        this.updatedBy = creatorId;
        this.createdAt = new Date();
        this.documentMetadata = documentMetadata;
    }

    public static create(creatorId: UUID, documentMetadata: DocumentMetadata): CommandResult<DocumentEntity> {
        const documentEntity = new DocumentEntity(creatorId, documentMetadata);
        const validation = DocumentSchema.safeParse(documentEntity.serialize());
        if (validation.success) {
            return {success: true, value: documentEntity};
        }
        return {success: false, error: Error(validation.error.message)};
    }

    public setName(userId: UUID, name: string): CommandResult<string> {
        const nameValidation = DocumentMetadataSchema.shape.name.safeParse(name);
        const userIdValidation = DocumentMetadataSchema.shape.updatedBy.safeParse(userId);
        if (nameValidation.success && userIdValidation.success) {
            this.documentMetadata.name = name;
            this.documentMetadata.updatedAt = new Date();
            this.updatedBy = userId;
            return {success: true, value: "updated"};
        }
        return {success: false, error: Error(nameValidation.error?.message || userIdValidation.error?.message)};
    }

    public setTags(userId: UUID, tags: string[]): CommandResult<string> {
        const tagsValidation = DocumentMetadataSchema.shape.tags.safeParse(tags);
        const userIdValidation = DocumentMetadataSchema.shape.updatedBy.safeParse(userId);
        if (tagsValidation.success && userIdValidation.success) {
            this.documentMetadata.tags = tags;
            this.documentMetadata.updatedAt = new Date();
            this.updatedBy = userId;
            return {success: true, value: "updated"};
        }
        return {success: false, error: Error(tagsValidation.error?.message || userIdValidation.error?.message)};
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
        return this.updatedBy;
    }

    serialize(): Document {
        return {
           id: this.id,
           creatorId: this.creatorId,
           updatedBy: this.updatedBy,
           createdAt: this.createdAt,
           documentMetadata: this.documentMetadata
        };
    }
}