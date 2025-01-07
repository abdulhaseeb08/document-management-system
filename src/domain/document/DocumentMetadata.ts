import { FileFormat } from "../../shared/enums/FileFormats";

export interface DocumentMetadata {
  name: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  updatedBy: string;
  documentFormat: FileFormat;
}