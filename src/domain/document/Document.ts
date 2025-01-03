import { FileFormat } from "../../shared/FileFormats";
import type { DocumentMetadata } from "./DocumentMetadata";

export class Document {
    public readonly id: string;
    public name: string;
    public tags: string[];
    public createdAt: Date;
    public updatedAt: Date;
    public creatorId: string;
    public documentFormat: FileFormat;

    constructor(
        creatorId: string,
        metadata: DocumentMetadata
    ) {
        this.id = crypto.randomUUID();
        this.name = metadata.name;
        this.tags = metadata.tags;
        this.createdAt = new Date();
        this.updatedAt = metadata.updatedAt;
        this.creatorId= creatorId;
        this.documentFormat = metadata.documentFormat;
    }
}