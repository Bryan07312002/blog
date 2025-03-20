import { UUID } from "crypto";
import { User, Post } from "../models";
import { RegisterDto, CreatePostDto } from ".";

export type Token = string;

export interface JwtRepository {
    sign(userUUID: UUID): Token;
    decode(token: Token): { uuid: UUID };
}

export interface UserPersistenceRepository {
    create(user: User): Promise<void>;
    findByUsernameOrEmail(usernameOrEmail: string): Promise<User>;
    findByUUID(uuid: UUID): Promise<User>;
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

export interface PostPersistenceRepository {
    create(post: Post): Promise<void>;
    delete(uuid: UUID): Promise<void>;
}

export interface PostFilePersistenceRepository {
    save(path: string, blob: Blob): Promise<void>;
    delete(path: string): Promise<void>;
    getRealUrl(url: string): Promise<string>;
}

export interface CreatePostDtoValidator {
    // should throw if invalid
    validate(dto: CreatePostDto): Promise<void>;
}

export interface CanCreatePostPolicies {
    // should throw if policies rejects
    check(user: User): void;
}
