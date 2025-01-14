import type { Document } from "../Document";
import type { UUID } from "../../../../shared/types";
import type { DocumentMetadata } from "../../../valueObjects/DocumentMetadata";
import type { CommandResult } from "../../../../shared/types";

export interface DocumentRepository {
    create(document: Document): Promise<CommandResult<string>>;
    update(requestorId: UUID, documentMetadata: DocumentMetadata): Promise<CommandResult<string>>;
    get(id: string): Promise<Document | null>;
    delete(id: string): Promise<CommandResult<string>>;
    search(metadata: DocumentMetadata): Promise<Document[] | null>;
}