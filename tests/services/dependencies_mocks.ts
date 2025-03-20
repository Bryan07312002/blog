import {
    CanCreatePostPolicies,
    CreatePostDtoValidator,
    HashRepository,
    JwtRepository,
    PostFilePersistenceRepository,
    PostPersistenceRepository,
    RegisterDtoValidator,
    UserPersistenceRepository,
    UUIDGenerator,
} from "../../src/services";

export function mockUserPersistenceRepository(): jest.Mocked<UserPersistenceRepository> {
    return {
        create: jest.fn(),
        findByUsernameOrEmail: jest.fn(),
        findByUUID: jest.fn(),
    };
}

export function mockHashRepository(): jest.Mocked<HashRepository> {
    return {
        hash: jest.fn(),
        compare: jest.fn(),
    };
}

export function mockRegisterDtoValidator(): jest.Mocked<RegisterDtoValidator> {
    return { validate: jest.fn() };
}

export function mockUUIDGenerator(): jest.Mocked<UUIDGenerator> {
    return { generate: jest.fn() };
}

export function mockJwtRepository(): jest.Mocked<JwtRepository> {
    return {
        sign: jest.fn(),
        decode: jest.fn(),
    };
}

export function mockPostPersistenceRepository(): jest.Mocked<PostPersistenceRepository> {
    return {
        delete: jest.fn(),
        create: jest.fn(),
    };
}

export function mockPostFilePersistenceRepository(): jest.Mocked<PostFilePersistenceRepository> {
    return {
        getRealUrl: jest.fn(),
        delete: jest.fn(),
        save: jest.fn(),
    };
}

export function mockCreatePostDtoValidator(): jest.Mocked<CreatePostDtoValidator> {
    return {
        validate: jest.fn(),
    };
}

export function mockCanCreatePostPolicies(): jest.Mocked<CanCreatePostPolicies> {
    return {
        check: jest.fn(),
    };
}
