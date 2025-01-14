import { Container } from "inversify";
import type { DocumentRepository } from "../../../domain/entities/document/port/DocumentRepository";
import { DocumentService } from "../../../app/document/DocumentService";
import { TypeORMDocumnetRepository } from "../../repository/document/typeormDocumentAdapter";
import type { Hasher } from "../../../app/services/hasher/port/Hasher";
import { HasherService } from "../../../app/services/hasher/HasherService";
import { Argon2Adpater } from "../../hasher/argon2Adapter";
import type { JWTAuth } from "../../../app/ports/jwt/jwt";
import { JoseJWTAdapter } from "../../jwt/joseAdapter";
import { AuthService } from "../../../app/services/auth/AuthService";
import { INVERIFY_IDENTIFIERS } from "./inversify.types";

const container = new Container();

// Binding interface to implementation
container.bind<DocumentRepository>(INVERIFY_IDENTIFIERS.DocumentRepository).to(TypeORMDocumnetRepository);
container.bind<Hasher>(INVERIFY_IDENTIFIERS.Hasher).to(Argon2Adpater);
container.bind<JWTAuth>(INVERIFY_IDENTIFIERS.JWT).to(JoseJWTAdapter);

// Binding services to self
container.bind<DocumentService>(INVERIFY_IDENTIFIERS.DocumentService).toSelf();
container.bind<HasherService>(INVERIFY_IDENTIFIERS.HasherService).toSelf();
container.bind<AuthService>(INVERIFY_IDENTIFIERS.AuthService).toSelf();

export default container;