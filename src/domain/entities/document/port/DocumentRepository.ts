import type { UUID } from "../../../../shared/types";
import type { DocumentMetadata } from "../../../valueObjects/DocumentMetadata";
import type { Document } from "../Document";
import {DocumentEntity} from "../DocumentEntity";
import {Result} from "joji-ct-fp";

export interface DocumentRepository {
    create(document: DocumentEntity): Promise<Result<Document, Error>>;
    update(document: DocumentEntity): Promise<Result<Document, Error>>;
    get(id: string): Promise<Result<Document, Error>>;
    getAll(userId: UUID): Promise<Result<Document[], Error>>;
    delete(id: string): Promise<Result<boolean, Error>>;
    search(metadata: DocumentMetadata): Promise<Result<Document[], Error>>;
}