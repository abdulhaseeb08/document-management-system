import { FileFormat } from "../../../shared/enums/FileFormats";
import type { Document} from "./Document";
import type { DocumentMetadata } from "../../valueObjects/DocumentMetadata";
import type { UUID } from "../../../shared/types";
import { matchRes, Result } from "joji-ct-fp";
import { validateDocument } from "../../schema/DocumentSchema";
import { validateArray, validateString, validateUUID } from "../../schema/Validatiors";

export class DocumentEntity implements Document {
    readonly id: UUID;
    readonly creatorId: UUID;
    readonly createdAt: Date;
    filePath: string;
    documentMetadata: DocumentMetadata;

    private constructor(creatorId: UUID, filePath: string, name: string, tags: string[], documentFormat: FileFormat, id?: UUID, createdAt?: Date, updatedBy?: UUID) {
        this.id = id ?? crypto.randomUUID() as UUID;
        this.creatorId = creatorId;
        this.filePath = filePath;
        this.documentMetadata = {
            name: name,
            tags: tags,
            updatedAt: new Date(),
            updatedBy: updatedBy ?? creatorId,
            documentFormat: documentFormat
        }
        this.createdAt = createdAt ?? new Date();
    }

    public static create(creatorId: UUID, filePath: string, name: string, tags: string[], documentFormat: FileFormat, id?: UUID, createdAt?: Date, updatedBy?: UUID): Result<DocumentEntity, Error> {
        const documentEntity = new DocumentEntity(creatorId, filePath, name, tags, documentFormat, id, createdAt, updatedBy);
        const validation = validateDocument(documentEntity.serialize());
        return matchRes(validation, {
            Ok: () => Result.Ok(documentEntity),
            Err: (err) => Result.Err(err)
        })
    }

    public setName(userId: UUID, name: string): Result<string, Error> {
        const res = validateString(name, 100)
            .flatMap(() => validateUUID(userId))
                .flatMap(() => {
                    this.documentMetadata.name = name;
                    this.documentMetadata.updatedAt = new Date();
                    this.documentMetadata.updatedBy = userId;
                    return Result.Ok("updated");
                })

        return matchRes(res, {
            Ok: (res) => Result.Ok(res),
            Err: (err) => {
                return Result.Err(err);
            }
        });
    }

    public setTags(userId: UUID, tags: string[]): Result<string, Error> {
        const res = validateArray(tags, 20)
            .flatMap(() => validateUUID(userId))
                .flatMap(() => {
                    this.documentMetadata.tags = tags;
                    this.documentMetadata.updatedAt = new Date();
                    this.documentMetadata.updatedBy = userId;
                    return Result.Ok("updated");
                })
        return matchRes(res, {
            Ok: (res) => Result.Ok(res),
            Err: (err) => {
                return Result.Err(err);
            }
        });
    }

    public getId(): UUID {
        return this.id;
    }

    public getCreatorId(): UUID {
        return this.creatorId;
    }

    public getDocumentMetadata(): DocumentMetadata {
        return this.documentMetadata;
    }

    public getDocumentName(): string {
        return this.documentMetadata.name;
    }

    public getDocumentTags(): string[] {
        return this.documentMetadata.tags;
    }

    public getCreatedAt(): Date {
        return this.createdAt;
    }

    public getLastUpdatedAt(): Date {
        return this.documentMetadata.updatedAt
    }

    public getDocumentFormat(): FileFormat {
        return this.documentMetadata.documentFormat;
    }

    public getLastUpdatedBy(): UUID {
        return this.documentMetadata.updatedBy;
    }

    serialize(): Document {
        return {
           id: this.id,
           filePath: this.filePath,
           creatorId: this.creatorId,
           createdAt: this.createdAt,
           documentMetadata: this.documentMetadata
        };
    }
}