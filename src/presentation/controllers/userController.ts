import { AuthService } from "../../app/services/auth/AuthService";
import { inject, injectable } from "inversify";
import  type { User } from "../../domain/entities/user/User";
import { UserRole } from "../../shared/enums/UserRole";

@injectable()
export class UserController {

    constructor(@inject(AuthService) private authService: AuthService) {}

    async parseRequestBody(request: Request): Promise<any | null>  {
        try {
            return await request.json()
        } catch (error) {
            return null;
          }
    }
    
    public async createUserHandler(request: Request): Promise<Response> {
        const body = await this.parseRequestBody(request);
        if (!body) {
            return new Response(JSON.stringify({error: "Missing payload"}), {status: 400});
        }

        const user: User = {
            email: body.email,
            password: body.password,
            userMetadata: {
                name: body.name,
                updatedAt: new Date(),
                userRole: UserRole.USER
            }
        }

        const registerUser = await this.authService.registerUser(user)
        return new Response(JSON.stringify(registerUser), {status: 201});
    }

}