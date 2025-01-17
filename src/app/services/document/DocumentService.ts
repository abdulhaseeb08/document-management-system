import type {UUID } from "../../../shared/types";
import type { Document } from "../../../domain/entities/document/Document";
import type { DocumentRepository } from "../../../domain/entities/document/port/DocumentRepository";
import type { DocumentMetadata } from "../../../domain/valueObjects/DocumentMetadata";
import { DocumentEntity } from "../../../domain/entities/document/DocumentEntity";
import { injectable, inject } from "inversify";
import { INVERIFY_IDENTIFIERS } from "../../../infra/di/inversify/inversify.types";
import type { Logger } from "../../ports/logger/logger";

@injectable()
export class DocumentService {
    constructor(
        @inject(INVERIFY_IDENTIFIERS.DocumentRepository) private documentRepository: DocumentRepository,
        @inject(INVERIFY_IDENTIFIERS.Logger) private logger: Logger        
    ) {}

    public async createDocument(creatorId: UUID, metadata: DocumentMetadata): Promise<CommandResult<string>> {
        const res = DocumentEntity.create(creatorId, metadata);
        if (res.success) {
            const doc = await this.documentRepository.create(res.value.serialize());
            if (doc.success) {
                return {success: true, value: doc.value};
            }
            return {success: false, error: doc.error};
        }
        return {success: false, error: res.error};
    }

    public async updateDocument(requestorId: UUID, documentMetadata: DocumentMetadata): Promise<CommandResult<string>> {
        const res = await this.documentRepository.update(requestorId, documentMetadata);
        if (res.success) {
            return {success: true, value: res.value};
        }
        return {success: false, error: res.error};
    }

    public async getDocument(id: string): Promise<Document|null> {
        return await this.documentRepository.get(id);
    }

    public async deleteDocument(id: string): Promise<CommandResult<string>> {
        const res = await this.documentRepository.delete(id);
        if (res.success) {
            return {success: true, value: res.value};
        }
        return {success: false, error: res.error};
    }

    public async searchRepository(metadata: DocumentMetadata): Promise<Document[] | null> {
        return await this.documentRepository.search(metadata);
    }
}