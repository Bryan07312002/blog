import { UUID } from "crypto";
import { User } from "../models/user";
import { RegisterDto } from "./register";

export type Token = string;

export interface JwtRepository {
    sign(userUUID: UUID): Token;
    decode(token: Token): { uuid: UUID };
}

export interface UserPersistenceRepository {
    create(user: User): Promise<void>;
    findByUsernameOrEmail(usernameOrEmail: string): Promise<User>;
}

export interface HashRepository {
    hash(str: string): Promise<string>;
    compare(hashed: string, notHashed: string): Promise<boolean>;
}

export interface UUIDGenerator {
    generate(): UUID;
}

export interface RegisterDtoValidator {
    // is expected to throw if invalid
    validate(dto: RegisterDto): Promise<void>;
}
