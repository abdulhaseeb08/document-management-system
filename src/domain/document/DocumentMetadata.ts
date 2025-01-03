import { FileFormat } from "../../shared/FileFormats";

export interface DocumentMetadata {
  name: string;
  tags: string[];
  updatedAt: Date;
  documentFormat: FileFormat;
}