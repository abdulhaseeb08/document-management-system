import { Container } from "inversify";
import type { DocumentRepository } from "../../../domain/document/port/DocumentRepository";
import { DocumentService } from "../../../app/document/DocumentService";
import { TypeORMDocumnetRepository } from "../../repository/document/typeormAdapter";
import type { Hasher } from "../../../app/hasher/port/Hasher";
import { HasherService } from "../../../app/hasher/HasherService";
import { Argon2Adpater } from "../../hasher/argon2Adapter";
import { INVERIFY_IDENTIFIERS } from "./inversify.types";

const container = new Container();

// Binding interface to implementation
container.bind<DocumentRepository>(INVERIFY_IDENTIFIERS.DocumentRepository).to(TypeORMDocumnetRepository);
container.bind<Hasher>(INVERIFY_IDENTIFIERS.Hasher).to(Argon2Adpater);

// Binding services to self
container.bind<DocumentService>(INVERIFY_IDENTIFIERS.DocumentService).toSelf();
container.bind<HasherService>(INVERIFY_IDENTIFIERS.HasherService).toSelf();

export default container;