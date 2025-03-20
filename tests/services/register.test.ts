import {
    HashRepository,
    Register,
    RegisterDto,
    RegisterDtoValidator,
    UserPersistenceRepository,
    UserProfilePersistenceRepository,
    UUIDGenerator,
} from "../../src/services";
import { User } from "../../src/models";
import { UUID } from "crypto";
import { jest } from "@jest/globals";
import {
    mockHashRepository,
    mockRegisterDtoValidator,
    mockUserPersistenceRepository,
    mockUserProfilePersistenceRepository,
    mockUUIDGenerator,
} from "./dependencies_mocks";

describe("Register", () => {
    let register: Register;
    let userPersistenceRepository: jest.Mocked<UserPersistenceRepository>;
    let userProfilePersistenceRepository: jest.Mocked<UserProfilePersistenceRepository>;
    let hashRepository: jest.Mocked<HashRepository>;
    let registerDtoValidator: jest.Mocked<RegisterDtoValidator>;
    let uuidGenerator: jest.Mocked<UUIDGenerator>;

    beforeEach(() => {
        jest.clearAllMocks();
        userPersistenceRepository = mockUserPersistenceRepository() as any;
        userProfilePersistenceRepository =
            mockUserProfilePersistenceRepository() as any;
        hashRepository = mockHashRepository() as any;
        registerDtoValidator = mockRegisterDtoValidator() as any;
        uuidGenerator = mockUUIDGenerator() as any;

        register = new Register(
            userPersistenceRepository,
            userProfilePersistenceRepository,
            hashRepository,
            registerDtoValidator,
            uuidGenerator,
        );
    });

    test("should validate the DTO", async () => {
        const dto = new RegisterDto(
            "testuser",
            "test@example.com",
            "password123",
        );

        await register.execute(dto);

        expect(registerDtoValidator.validate).toHaveBeenCalledWith(dto);
    });

    test("should hash the password", async () => {
        const dto = new RegisterDto(
            "testuser",
            "test@example.com",
            "password123",
        );
        hashRepository.hash.mockResolvedValue("hashedPassword");

        await register.execute(dto);

        expect(hashRepository.hash).toHaveBeenCalledWith(dto.password);
    });

    test("should generate a UUID for the user", async () => {
        const dto = new RegisterDto(
            "testuser",
            "test@example.com",
            "password123",
        );
        const mockUUID = "123e4567-e89b-12d3-a456-426614174000" as UUID;
        uuidGenerator.generate.mockReturnValue(mockUUID);

        await register.execute(dto);

        expect(uuidGenerator.generate).toHaveBeenCalled();
    });

    test("should create a user with the correct data", async () => {
        const dto = new RegisterDto(
            "testuser",
            "test@example.com",
            "password123",
        );
        const mockUUID = "123e4567-e89b-12d3-a456-426614174000" as UUID;
        const hashedPassword = "hashedPassword";

        uuidGenerator.generate.mockReturnValue(mockUUID);
        hashRepository.hash.mockResolvedValue(hashedPassword);

        await register.execute(dto);

        const expectedUser = new User(
            mockUUID,
            dto.username,
            dto.email,
            hashedPassword,
            ["Reader"],
            "Active",
        );

        expect(userPersistenceRepository.create).toHaveBeenCalledWith(
            expectedUser,
        );
    });

    test("should create user profile with the correct data", async () => {
        const dto = new RegisterDto(
            "testuser",
            "test@example.com",
            "password123",
        );
        const mockUUID = "123e4567-e89b-12d3-a456-426614174000" as UUID;
        const hashedPassword = "hashedPassword";

        uuidGenerator.generate.mockReturnValue(mockUUID);
        hashRepository.hash.mockResolvedValue(hashedPassword);
        userPersistenceRepository;

        await register.execute(dto);

        const expectedUser = new User(
            mockUUID,
            dto.username,
            dto.email,
            hashedPassword,
            ["Reader"],
            "Active",
        );

        expect(userPersistenceRepository.create).toHaveBeenCalledWith(
            expectedUser,
        );

        expect(userProfilePersistenceRepository.create).toHaveBeenCalledWith(
            mockUUID,
        );
    });

    test("should return the created user", async () => {
        const dto = new RegisterDto(
            "testuser",
            "test@example.com",
            "password123",
        );
        const mockUUID = "123e4567-e89b-12d3-a456-426614174000" as UUID;
        const hashedPassword = "hashedPassword";

        uuidGenerator.generate.mockReturnValue(mockUUID);
        hashRepository.hash.mockResolvedValue(hashedPassword);

        const result = await register.execute(dto);

        const expectedUser = new User(
            mockUUID,
            dto.username,
            dto.email,
            hashedPassword,
            ["Reader"],
            "Active",
        );

        expect(result).toEqual(expectedUser);
    });

    test("should throw if DTO validation fails", async () => {
        const dto = new RegisterDto(
            "testuser",
            "test@example.com",
            "password123",
        );
        const validationError = new Error("Invalid DTO");

        registerDtoValidator.validate.mockRejectedValue(validationError);

        await expect(register.execute(dto)).rejects.toThrow(validationError);
    });

    test("should throw if password hashing fails", async () => {
        const dto = new RegisterDto(
            "testuser",
            "test@example.com",
            "password123",
        );
        const hashingError = new Error("Hashing failed");

        hashRepository.hash.mockRejectedValue(hashingError);

        await expect(register.execute(dto)).rejects.toThrow(hashingError);
    });

    test("should throw if user creation fails", async () => {
        const dto = new RegisterDto(
            "testuser",
            "test@example.com",
            "password123",
        );
        const mockUUID = "123e4567-e89b-12d3-a456-426614174000" as UUID;
        const hashedPassword = "hashedPassword";
        const creationError = new Error("User creation failed");

        uuidGenerator.generate.mockReturnValue(mockUUID);
        hashRepository.hash.mockResolvedValue(hashedPassword);
        userPersistenceRepository.create.mockRejectedValue(creationError);

        await expect(register.execute(dto)).rejects.toThrow(creationError);
    });
});
