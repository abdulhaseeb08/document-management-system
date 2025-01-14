import type { Document } from "../Document";
import type { DocumentMetadata } from "../../../valueObjects/DocumentMetadata";
import type { CommandResult } from "../../../../shared/types";

export interface DocumentRepository {
    create(document: Document): Promise<CommandResult<string>>;
    update(document: Document): Promise<CommandResult<string>>;
    get(id: string): Promise<Document | null>;
    delete(id: string): Promise<CommandResult<string>>;
    search(metadata: DocumentMetadata): Promise<Document[] | null>;
}