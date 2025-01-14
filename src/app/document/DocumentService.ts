import { Document } from "../../domain/entities/document/DocumentEntity";
import type { DocumentRepository } from "../../domain/entities/document/port/DocumentRepository";
import type { DocumentMetadata } from "../../domain/entities/document/Document";
import { injectable, inject } from "inversify";
import { INVERIFY_IDENTIFIERS } from "../../infra/di/inversify/inversify.types";

@injectable()
export class DocumentService {
    constructor(@inject(INVERIFY_IDENTIFIERS.DocumentRepository) private documentRepository: DocumentRepository) {}

    public async createDocument(creatorId: string, metadata: DocumentMetadata): Promise<Document> {
        const doc = new Document(creatorId, metadata);
        await this.documentRepository.create(doc);
        return doc
    }

    public async updateDocument(document: Document, metadata:DocumentMetadata): Promise<void> {
        await this.documentRepository.update(document, metadata);
    }

    public async getDocument(id: string): Promise<Document|null> {
        return await this.documentRepository.get(id);
    }

    public async deleteDocument(id: string): Promise<void> {
        await this.documentRepository.delete(id);
    }

    public async searchRepository(metadata: DocumentMetadata): Promise<Document[] | null> {
        return await this.documentRepository.search(metadata);
    }
}