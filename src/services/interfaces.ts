import { UUID } from "crypto";
import { User, Post, UserProfile } from "../models";
import {
    RegisterDto,
    CreatePostDto,
    UpdateProfileDTO,
    FullUserProfileDto,
} from ".";

export type Token = string;

export interface JwtRepository {
    sign(userUUID: UUID): Token;
    decode(token: Token): { uuid: UUID };
}

export interface UserPersistenceRepository {
    create(user: User): Promise<void>;
    findByUsernameOrEmail(usernameOrEmail: string): Promise<User>;
    findByUUID(uuid: UUID): Promise<User>;
    findFullUserByUUID(uuid: UUID): Promise<FullUserProfileDto>;
}

export interface UserProfilePersistenceRepository {
    create(userUuid: UUID): Promise<void>;
    update(profile: UserProfile): Promise<void>;
    findByUserUUID(userUuid: UUID): Promise<UserProfile>;
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
    findByUUID(uuid: UUID): Promise<Post>;
}

export interface FilePersistenceRepository {
    save(path: string, blob: Blob): Promise<void>;
    delete(path: string): Promise<void>;
    getRealUrl(url: string): Promise<string>;
}

export interface UserProfilePhotoFilePersistenceRepository
    extends FilePersistenceRepository {}

export interface PostFilePersistenceRepository
    extends FilePersistenceRepository {}

export interface CreatePostDtoValidator {
    // should throw if invalid
    validate(dto: CreatePostDto): Promise<void>;
}

export interface UpdateProfileDtoValidator {
    // should throw if invalid
    validate(dto: UpdateProfileDTO): Promise<void>;
}

export interface CanCreatePostPolicies {
    // should throw if policies rejects
    check(user: User): void;
}

export interface CanDeletePostPolicies {
    // should throw if policies rejects
    check(user: User, post: Post): void;
}
