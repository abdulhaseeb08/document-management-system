import { UserController } from "../controllers/userController";

export const router = async(request: Request, userController: UserController): Promise<Response> => {
    const url = new URL(request.url);

    if (url.pathname === "/registerUser" && request.method === "POST") {
        return await userController.createUserHandler(request);
    }

    if (url.pathname === "/loginUser" && request.method === "POST") {
        return await userController.loginUserHandler(request);
    }

    if (url.pathname === "/updateUser" && request.method === "PUT") {
        return await userController.updateUserHandler(request);
    }

    if (url.pathname === "/getUser" && request.method === "GET") {
        return await userController.getUserHandler(request);
    }
    if (url.pathname === "/deleteUser" && request.method === "DELETE") {
        return await userController.deleteUserHandler(request);
    }
    // If none of the above matched:
    return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
}