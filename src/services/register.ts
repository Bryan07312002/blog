import { User } from "../models";
import {
    HashRepository,
    RegisterDtoValidator,
    UserPersistenceRepository,
    UUIDGenerator,
} from ".";

export class RegisterDto {
    constructor(
        public username: string,
        public email: string,
        public password: string,
    ) {}
}

export class Register {
    constructor(
        public userPersistenceRepository: UserPersistenceRepository,
        public hashRepository: HashRepository,
        public registerDtoValidator: RegisterDtoValidator,
        public uuidGenerator: UUIDGenerator,
    ) {}

    async execute(dto: RegisterDto): Promise<User> {
        await this.registerDtoValidator.validate(dto);

        const hashedPassword = await this.hashRepository.hash(dto.password);
        const uuid = this.uuidGenerator.generate();

        // user always starts as reader and admin should change his role
        const user = new User(
            uuid,
            dto.username,
            dto.email,
            hashedPassword,
            ["Reader"],
            "Active",
        );

        await this.userPersistenceRepository.create(user);
        return user;
    }
}
