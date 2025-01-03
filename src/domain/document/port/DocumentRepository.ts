import { Document } from "../Document";
import type { DocumentMetadata } from "../DocumentMetadata";

export interface DocumentRepository {
    create(document: Document): Promise<void>;
    update(document: Document, metadata: DocumentMetadata): Promise<void>;
    get(id: string): Promise<Document | null>;
    delete(id: string): Promise<void>;
    search(tags?: string[], metadata?: DocumentMetadata): Promise<Document[] | null>;
}