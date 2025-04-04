import {
    CanCreatePostPolicies,
    CanDeletePostPolicies,
    CreatePostDtoValidator,
    HashRepository,
    JwtRepository,
    PostFilePersistenceRepository,
    PostPersistenceRepository,
    RegisterDtoValidator,
    UpdateProfileDtoValidator,
    UpdateProfilePhotoDtoValidator,
    UserPersistenceRepository,
    UserProfilePersistenceRepository,
    UserProfilePhotoFilePersistenceRepository,
    UUIDGenerator,
} from "../../src/services";

export function mockUserPersistenceRepository(): jest.Mocked<UserPersistenceRepository> {
    return {
        create: jest.fn(),
        findByUsernameOrEmail: jest.fn(),
        findByUUID: jest.fn(),
        findFullUserByUUID: jest.fn(),
    };
}

export function mockUserProfilePersistenceRepository(): jest.Mocked<UserProfilePersistenceRepository> {
    return {
        create: jest.fn(),
        update: jest.fn(),
        findByUserUUID: jest.fn(),
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
        findByUUID: jest.fn(),
    };
}

export function mockPostFilePersistenceRepository(): jest.Mocked<PostFilePersistenceRepository> {
    return {
        getRealUrl: jest.fn(),
        delete: jest.fn(),
        save: jest.fn(),
    };
}

export function mockUserProfilePhotoFilePersistenceRepository(): jest.Mocked<UserProfilePhotoFilePersistenceRepository> {
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

export function mockCanDeletePostPolicies(): jest.Mocked<CanDeletePostPolicies> {
    return {
        check: jest.fn(),
    };
}

export function mockCanCreatePostPolicies(): jest.Mocked<CanCreatePostPolicies> {
    return {
        check: jest.fn(),
    };
}

export function mockUpdateProfilePhotoDtoValidator(): jest.Mocked<UpdateProfilePhotoDtoValidator> {
    return { validate: jest.fn() };
}

export function mockUpdateProfileDtoValidator(): jest.Mocked<UpdateProfileDtoValidator> {
    return { validate: jest.fn() };
}
