import { Document } from "../../domain/document/Document";
import type { DocumentRepository } from "../../domain/document/port/DocumentRepository";
import type { DocumentMetadata } from "../../domain/document/DocumentMetadata";

export class DocumentService {
    constructor(private documentRepository: DocumentRepository) {}

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

    public async searchRepository(tags: string[], metadata: DocumentMetadata): Promise<Document[] | null> {
        return await this.documentRepository.search(tags, metadata);
    }
}