import { FileFormat } from "../../shared/enums/FileFormats";
import type { DocumentMetadata } from "./DocumentMetadata";

export class Document {
    public id: string;
    public name: string;
    public tags: string[];
    public createdAt: Date;
    public updatedAt: Date;
    public creatorId: string;
    public documentFormat: FileFormat;
    public updatedBy: string;

    constructor(
        creatorId: string,
        metadata: DocumentMetadata,
        id?: string
    ) {
        this.id = id ?? crypto.randomUUID();
        this.name = metadata.name;
        this.tags = metadata.tags;
        this.createdAt = metadata.createdAt ?? new Date();
        this.updatedAt = metadata.updatedAt ?? new Date();
        this.creatorId= creatorId;
        this.documentFormat = metadata.documentFormat;
        this.updatedBy = metadata.updatedBy ?? creatorId;
    }
}