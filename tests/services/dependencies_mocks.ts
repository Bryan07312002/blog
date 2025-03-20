import {
    HashRepository,
    RegisterDtoValidator,
    UserPersistenceRepository,
    UUIDGenerator,
} from "../../src/services";

export function mockUserPersistenceRepository(): jest.Mocked<UserPersistenceRepository> {
    return {
        create: jest.fn(),
        findByUsernameOrEmail: jest.fn(),
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
