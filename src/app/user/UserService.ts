import type { UserRepository } from "../../domain/user/port/UserRepository";

export class UserService {
    constructor(private userRepository: UserRepository) {}

    public async createuser(creatorId: string, metadata: DocumentMetadata): Promise<Document> {
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