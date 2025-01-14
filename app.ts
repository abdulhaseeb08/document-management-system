import type { UserController } from "./src/presentation/controllers/userController";
import { router } from "./src/presentation/routes/routes";

export function createServer(userController: UserController) {
  return Bun.serve({
    port: 3000,
    async fetch(request: Request): Promise<Response> {
      return router(request, userController);
    },
  });
}