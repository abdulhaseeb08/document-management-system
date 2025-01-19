import type { DocumentMetadata } from "../../valueObjects/DocumentMetadata";
import type { UUID } from "../../../shared/types";

export interface Document {
  readonly id: UUID; // uuid of document
  readonly creatorId: UUID; // uuid of user who created it
  readonly createdAt: Date;
  readonly filePath: string;
  documentMetadata: DocumentMetadata;
}