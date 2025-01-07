import { Document } from "../Document";
import type { DocumentMetadata } from "../DocumentMetadata";
import type { CommandResult } from "../../../shared/types/types";

export interface DocumentRepository {
    create(document: Document): Promise<CommandResult<string>>;
    update(document: Document, metadata: DocumentMetadata): Promise<CommandResult<string>>;
    get(id: string): Promise<Document | null>;
    delete(id: string): Promise<CommandResult<string>>;
    search(tags?: string[], metadata?: DocumentMetadata): Promise<Document[] | null>;
}