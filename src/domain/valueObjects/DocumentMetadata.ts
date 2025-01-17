import { FileFormat } from "../../shared/enums/FileFormats";
import type { UUID } from "../../shared/types";

export interface DocumentMetadata {
  name: string;
  tags: string[];
  updatedAt: Date;
  updatedBy: UUID; // uuid of user who updated it
  readonly documentFormat: FileFormat;
}