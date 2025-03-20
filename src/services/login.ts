import {
    HashRepository,
    JwtRepository,
    Token,
    UserPersistenceRepository,
} from ".";
import { unauthorizedError } from "../error";

export class LoginDto {
    constructor(
        public usernameOrEmail: string,
        public password: string,
    ) {}
}

export class Login {
    constructor(
        private userPersistenceRepository: UserPersistenceRepository,
        private hashRepository: HashRepository,
        private jwtRepository: JwtRepository,
    ) {}

    async execute(dto: LoginDto): Promise<Token> {
        const user = await this.userPersistenceRepository.findByUsernameOrEmail(
            dto.usernameOrEmail,
        );

        if (!(await this.hashRepository.compare(user.password, dto.password))) {
            throw unauthorizedError("invalid password");
        }

        return this.jwtRepository.sign(user.uuid);
    }
}
