import {
    Login,
    LoginDto,
    UserPersistenceRepository,
    HashRepository,
    JwtRepository,
} from "../../src/services";
import { User } from "../../src/models";
import { UUID } from "crypto";
import { jest } from "@jest/globals";
import {
    mockHashRepository,
    mockJwtRepository,
    mockUserPersistenceRepository,
} from "./dependencies_mocks";

describe("Login", () => {
    let login: Login;
    let userPersistenceRepository: jest.Mocked<UserPersistenceRepository>;
    let hashRepository: jest.Mocked<HashRepository>;
    let jwtRepository: jest.Mocked<JwtRepository>;

    let baseUser: User;

    beforeEach(() => {
        jest.clearAllMocks();
        userPersistenceRepository = mockUserPersistenceRepository() as any;
        hashRepository = mockHashRepository() as any;
        jwtRepository = mockJwtRepository() as any;

        login = new Login(
            userPersistenceRepository,
            hashRepository,
            jwtRepository,
        );

        baseUser = new User(
            "123e4567-e89b-12d3-a456-426614174000" as UUID,
            "testuser",
            "test@example.com",
            "hashedPassword",
            ["Reader"],
            "Active",
        );
    });

    test("should find user by username or email", async () => {
        const dto = new LoginDto("testuser", "password123");

        userPersistenceRepository.findByUsernameOrEmail.mockResolvedValue(
            baseUser,
        );
        hashRepository.compare.mockResolvedValue(true);
        jwtRepository.sign.mockReturnValue("mockToken");

        await login.execute(dto);

        expect(
            userPersistenceRepository.findByUsernameOrEmail,
        ).toHaveBeenCalledWith(dto.usernameOrEmail);
    });

    test("should compare passwords", async () => {
        const dto = new LoginDto("testuser", "password123");

        userPersistenceRepository.findByUsernameOrEmail.mockResolvedValue(
            baseUser,
        );
        hashRepository.compare.mockResolvedValue(true);
        jwtRepository.sign.mockReturnValue("mockToken");

        await login.execute(dto);

        expect(hashRepository.compare).toHaveBeenCalledWith(
            baseUser.password,
            dto.password,
        );
    });

    test("should throw unauthorized error if password is invalid", async () => {
        const dto = new LoginDto("testuser", "wrongPassword");
        userPersistenceRepository.findByUsernameOrEmail.mockResolvedValue(
            baseUser,
        );
        hashRepository.compare.mockResolvedValue(false);

        await expect(login.execute(dto)).rejects.toThrow("invalid password");
    });

    test("should sign a JWT token for the user", async () => {
        const dto = new LoginDto("testuser", "password123");

        userPersistenceRepository.findByUsernameOrEmail.mockResolvedValue(
            baseUser,
        );
        hashRepository.compare.mockResolvedValue(true);
        jwtRepository.sign.mockReturnValue("mockToken");

        const result = await login.execute(dto);

        expect(jwtRepository.sign).toHaveBeenCalledWith(baseUser.uuid);
        expect(result).toBe("mockToken");
    });

    test("should throw if user is not found", async () => {
        const dto = new LoginDto("nonexistent", "password123");

        userPersistenceRepository.findByUsernameOrEmail.mockRejectedValue(
            "user not found",
        );

        try {
            await login.execute(dto);
            throw "login did not throw";
        } catch (e) {
            expect(e).toBe("user not found");
        }
    });

    test("should throw if hashing comparison fails", async () => {
        const dto = new LoginDto("testuser", "password123");

        userPersistenceRepository.findByUsernameOrEmail.mockResolvedValue(
            baseUser,
        );
        hashRepository.compare.mockRejectedValue(new Error("hashing error"));

        await expect(login.execute(dto)).rejects.toThrow("hashing error");
    });

    test("should throw if JWT signing fails", async () => {
        const dto = new LoginDto("testuser", "password123");

        userPersistenceRepository.findByUsernameOrEmail.mockResolvedValue(
            baseUser,
        );
        hashRepository.compare.mockResolvedValue(true);
        jwtRepository.sign.mockImplementation(() => {
            throw new Error("JWT signing failed");
        });

        await expect(login.execute(dto)).rejects.toThrow("JWT signing failed");
    });
});
