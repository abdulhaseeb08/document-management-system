import type { UserRepository } from "../../domain/user/port/UserRepository";
import { UserRole } from "../../shared/enums/UserRole";
import { User } from "../../domain/user/User";

export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private passwordHasher: PasswordHasher,
    private jwtAdapter: JwtAdapter
  ) {}

  public async registerUser(email: string, plainPassword: string, role: UserRole): Promise<User> {
    const hashedPassword = await this.passwordHasher.hash(plainPassword);
    const user = new User(email, hashedPassword, role);
    await this.userRepository.create(user);
    return user;
  }

  public async login(email: string, plainPassword: string): Promise<{ token: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const validPassword = await this.passwordHasher.compare(plainPassword, user.password);
    if (!validPassword) {
      throw new Error('Invalid email or password.');
    }

    const token = this.jwtAdapter.sign({ userId: user.id, role: user.role });
    return { token };
  }
}
