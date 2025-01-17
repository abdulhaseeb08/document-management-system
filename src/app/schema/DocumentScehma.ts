import { FileFormat } from "../../shared/enums/FileFormats";
import { z } from "zod";
import { UUIDSchema } from "./UUIDSchema";

export const DocumentMetadataSchema = z.object({
    name: z.string().max(100, "Name cannot exceed 100 characters"), 
    tags: z.array(z.string().max(20, "Tag cannot exceed 20 characters")),
    updatedAt: z.date(),
    updatedBy: UUIDSchema,
    documentFormat: z.nativeEnum(FileFormat),
}).strict();

export const DocumentSchema = z.object({
    id: UUIDSchema,
    creatorId: UUIDSchema,
    createdAt: z.date(),
    documentMetadata: DocumentMetadataSchema
}).strict();