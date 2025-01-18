import { Container } from "inversify";
import type { DocumentRepository } from "../../../domain/entities/document/port/DocumentRepository";
import { DocumentService } from "../../../app/services/document/DocumentService";
import { TypeORMDocumnetRepository } from "../../repository/document/typeormDocumentAdapter";
import type { Hasher } from "../../../app/ports/hasher/Hasher";
import { HasherService } from "../../../app/services/hasher/HasherService";
import { Argon2Adpater } from "../../hasher/argon2Adapter";
import type { JWTAuth } from "../../../app/ports/jwt/jwt";
import { JoseJWTAdapter } from "../../jwt/joseAdapter";
import { AuthService } from "../../../app/services/User/UserService";
import { UserController } from "../../../presentation/controllers/userController";
import { INVERIFY_IDENTIFIERS } from "./inversify.types";
import type { UserRepository } from "../../../domain/entities/user/port/UserRepository";
import { TypeORMUserRepository } from "../../repository/user/typeormUserAdapter";
import type { Logger } from "../../../app/ports/logger/logger";
import { PinoLogger } from "../../logger/pinoLogger";
import AppDataSource from "../../database/typeorm/dataSource";
import { DataSource } from "typeorm";

const container = new Container();

// Binding interface to implementation
container.bind<DocumentRepository>(INVERIFY_IDENTIFIERS.DocumentRepository).to(TypeORMDocumnetRepository);
container.bind<Hasher>(INVERIFY_IDENTIFIERS.Hasher).to(Argon2Adpater);
container.bind<JWTAuth>(INVERIFY_IDENTIFIERS.JWT).to(JoseJWTAdapter);
container.bind<UserRepository>(INVERIFY_IDENTIFIERS.UserRepository).to(TypeORMUserRepository);
container.bind<DataSource>(INVERIFY_IDENTIFIERS.TypeORMDataSource).toConstantValue(AppDataSource);
container.bind<Logger>(INVERIFY_IDENTIFIERS.Logger).toConstantValue(new PinoLogger());

// Binding services to self
container.bind<DocumentService>(DocumentService).toSelf();
container.bind<HasherService>(HasherService).toSelf();
container.bind<AuthService>(AuthService).toSelf();
container.bind<UserController>(UserController).toSelf();


export default container;