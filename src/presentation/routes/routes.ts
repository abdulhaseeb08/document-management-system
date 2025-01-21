import { UserController } from "../controllers/userController";
import { DocumentController } from "../controllers/documentController";

export const router = async(request: Request, userController: UserController, documentController: DocumentController): Promise<Response> => {
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

    if (url.pathname === "/createDocument" && request.method === "POST") {
        return await documentController.createDocumentHandler(request);
    }

    if (url.pathname === "/updateDocument" && request.method === "PUT") {
        return await documentController.updateDocumentHandler(request);
    }

    if (url.pathname === "/getDocument" && request.method === "GET") {
        return await documentController.getDocumentHandler(request);
    }

    if (url.pathname === "/downloadDocument" && request.method === "GET") {
        return await documentController.downloadDocumentHandler(request);
    }

    if (url.pathname === "/deleteDocument" && request.method === "DELETE") {
        return await documentController.deleteDocumentHandler(request);
    }

    // If none of the above matched:
    return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
}