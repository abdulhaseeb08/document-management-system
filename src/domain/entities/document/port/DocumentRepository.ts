import type { Document } from "../Document";
import type { DocumentMetadata } from "../../../valueObjects/DocumentMetadata";
import {Result} from "joji-ct-fp";

export interface DocumentRepository {
    create(document: Document): Promise<Result<string, Error>>;
    update(document: Document): Promise<Result<string, Error>>;
    get(id: string): Promise<Result<Document, Error>>;
    delete(id: string): Promise<Result<string, Error>>;
    search(metadata: DocumentMetadata): Promise<Result<Document[], Error>>;
}