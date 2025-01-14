import { FileFormat } from "../../shared/enums/FileFormats";

export interface DocumentMetadata {
  name: string;
  tags: string[];
  updatedAt: Date;
  readonly documentFormat: FileFormat;
}