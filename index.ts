import container from "./src/infra/di/inversify/inversify.config";
import { createServer } from "./app";
import { UserController } from "./src/presentation/controllers/userController";
import type { DataSource } from "typeorm";
import { INVERIFY_IDENTIFIERS } from "./src/infra/di/inversify/inversify.types";
import type { Logger } from "./src/app/ports/logger/logger";
import { DocumentController } from "./src/presentation/controllers/documentController";
import { PermissionController } from "./src/presentation/controllers/permissionController";


// Initialize variables
const appDataSource: DataSource = container.get<DataSource>(INVERIFY_IDENTIFIERS.TypeORMDataSource);
await appDataSource.initialize();
const userController: UserController = container.get<UserController>(UserController);
const documentController: DocumentController = container.get<DocumentController>(DocumentController);
const permissionController: PermissionController = container.get<PermissionController>(PermissionController);
const logger: Logger = container.get<Logger>(INVERIFY_IDENTIFIERS.Logger);


// Start server
const server = createServer(userController, documentController, permissionController);
console.log(`Server running on http://localhost:${server.port}`);
process.on('SIGINT', async () => {
    if (appDataSource.isInitialized) {
        await appDataSource.destroy();
        logger.info("Data Source destroyed");
    }
    process.exit(0);
});