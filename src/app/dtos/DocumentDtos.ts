import { z } from 'zod';
import { FileFormat } from '../../shared/enums/FileFormats';

export const DocumentCreateDto = z.object({
  token: z.string(),
  name: z.string().max(100, { message: "Name cannot exceed 100 characters" }),
  tags: z.array(z.string().max(20, { message: "Tag cannot exceed 20 characters" })).optional(),
  documentFormat: z.nativeEnum(FileFormat, { message: "Invalid document format" }),
  file: z.instanceof(File, { message: "Invalid file" })
});

export const DocumentUpdateDto = z.object({
  token: z.string(),
  documentId: z.string().uuid({ message: "Invalid document ID" }),
  name: z.string().max(100, { message: "Name cannot exceed 100 characters" }).optional(),
  tags: z.array(z.string().max(20, { message: "Tag cannot exceed 20 characters" })).optional(),
});

export const DocumentGetDto = z.object({
  token: z.string()
});

export const DownloadDocumentDto = z.object({
  token: z.string(),
  documentId: z.string().uuid({ message: "Invalid document ID" })
});

export const DocumentDeleteDto = z.object({
  token: z.string(),
  documentId: z.string().uuid({ message: "Invalid document ID" })
});

export const DocumentSearchDto = z.object({
  token: z.string(),
  name: z.string().max(100, { message: "Name cannot exceed 100 characters" }).optional(),
  tags: z.array(z.string().max(20, { message: "Tag cannot exceed 20 characters" })).optional(),
  documentFormat: z.nativeEnum(FileFormat).optional(),
  updatedAt: z.date().optional()
});

export type DocumentCreateDtoType = z.infer<typeof DocumentCreateDto>;
export type DocumentUpdateDtoType = z.infer<typeof DocumentUpdateDto>;
export type DocumentGetDtoType = z.infer<typeof DocumentGetDto>;
export type DocumentDeleteDtoType = z.infer<typeof DocumentDeleteDto>;
export type DocumentSearchDtoType = z.infer<typeof DocumentSearchDto>;
export type DownloadDocumentDtoType = z.infer<typeof DownloadDocumentDto>;