import { UUID } from "crypto";
import { User } from "../models/user";
import { RegisterDto } from "./register";

export interface UserPersistenceRepository {
    create(user: User): Promise<void>;
}

export interface HashRepository {
    hash(str: string): Promise<string>;
    compare(hashed: string, notHashed: string): Promise<void>;
}

export interface UUIDGenerator {
    generate(): UUID;
}

export interface RegisterDtoValidator {
    // is expected to throw if invalid
    validate(dto: RegisterDto): Promise<void>;
}
