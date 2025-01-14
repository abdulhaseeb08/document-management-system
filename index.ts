import container from "./src/infra/di/inversify/inversify.config";
import { createServer } from "./app";
import { UserController } from "./src/presentation/controllers/userController";


// Initialize DB schema
const userController: UserController = container.get<UserController>(UserController);

// Start server
const server = createServer(userController);
console.log(`Server running on http://localhost:${server.port}`);