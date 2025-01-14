import { UserController } from "../controllers/userController";

export const router = async(request: Request, userController: UserController): Promise<Response> => {
    const url = new URL(request.url);

    if (url.pathname === "/registerUser" && request.method === "POST") {
        return await userController.createUserHandler(request);
    }
  
    // If none of the above matched:
    return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
}