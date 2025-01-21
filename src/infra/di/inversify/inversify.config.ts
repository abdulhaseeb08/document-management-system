import { Container } from "inversify";
import type { DocumentRepository } from "../../../domain/entities/document/port/DocumentRepository";
import { DocumentService } from "../../../app/services/document/DocumentService";
import { TypeORMDocumnetRepository } from "../../repository/document/typeormDocumentAdapter";
import type { Hasher } from "../../../app/ports/hasher/Hasher";
import { HasherService } from "../../../app/services/hasher/HasherService";
import { Argon2Adpater } from "../../hasher/argon2Adapter";
import type { JWTAuth } from "../../../app/ports/jwt/jwt";
import { JoseJWTAdapter } from "../../jwt/joseAdapter";
import { UserService } from "../../../app/services/user/UserService";
import { UserController } from "../../../presentation/controllers/userController";
import { INVERIFY_IDENTIFIERS } from "./inversify.types";
import type { UserRepository } from "../../../domain/entities/user/port/UserRepository";
import { TypeORMUserRepository } from "../../repository/user/typeormUserAdapter";
import type { Logger } from "../../../app/ports/logger/logger";
import { PinoLogger } from "../../logger/pinoLogger";
import AppDataSource from "../../database/typeorm/dataSource";
import { DataSource } from "typeorm";
import { TypeORMDatabaseManager } from "../../database/typeorm/databaseService";
import type { DatabaseManager } from "../../../app/ports/database/database";
import type { PermissionRepository } from "../../../domain/entities/permission/port/PermissionRepository";
import { TypeORMPermissionRepository } from "../../repository/permission/typeormPermissionAdapter";
import { PermissionService } from "../../../app/services/permission/permissionService";
import { FileService } from "../../../app/services/file/fileService";
import { DocumentController } from "../../../presentation/controllers/documentController";
import { PermissionController } from "../../../presentation/controllers/permissionController";

const container = new Container();

// Binding interface to implementation
//container.bind<DocumentRepository>(INVERIFY_IDENTIFIERS.DocumentRepository).to(TypeORMDocumnetRepository);
container.bind<Hasher>(INVERIFY_IDENTIFIERS.Hasher).to(Argon2Adpater);
container.bind<JWTAuth>(INVERIFY_IDENTIFIERS.JWT).to(JoseJWTAdapter);
container.bind<UserRepository>(INVERIFY_IDENTIFIERS.UserRepository).to(TypeORMUserRepository);
container.bind<DocumentRepository>(INVERIFY_IDENTIFIERS.DocumentRepository).to(TypeORMDocumnetRepository);
container.bind<DataSource>(INVERIFY_IDENTIFIERS.TypeORMDataSource).toConstantValue(AppDataSource);
container.bind<Logger>(INVERIFY_IDENTIFIERS.Logger).toConstantValue(new PinoLogger());
container.bind<DatabaseManager>(INVERIFY_IDENTIFIERS.DatabaseManager).to(TypeORMDatabaseManager);
container.bind<PermissionRepository>(INVERIFY_IDENTIFIERS.PermissionRepository).to(TypeORMPermissionRepository);


// Binding services to self
container.bind<DocumentService>(DocumentService).toSelf();
container.bind<HasherService>(HasherService).toSelf();
container.bind<UserService>(UserService).toSelf();
container.bind<PermissionService>(PermissionService).toSelf();
container.bind<FileService>(FileService).toSelf();
container.bind<UserController>(UserController).toSelf();
container.bind<DocumentController>(DocumentController).toSelf();
container.bind<PermissionController>(PermissionController).toSelf();


export default container;