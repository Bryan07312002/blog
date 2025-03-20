import {
    CreatePost,
    CreatePostDto,
    CreatePostDtoValidator,
    CanCreatePostPolicies,
    PostPersistenceRepository,
    PostFilePersistenceRepository,
    UserPersistenceRepository,
    UUIDGenerator,
} from "../../src/services";
import { Post, User } from "../../src/models";
import { UUID } from "crypto";
import { jest } from "@jest/globals";
import {
    mockPostPersistenceRepository,
    mockPostFilePersistenceRepository,
    mockUserPersistenceRepository,
    mockCreatePostDtoValidator,
    mockCanCreatePostPolicies,
    mockUUIDGenerator,
} from "./dependencies_mocks";

describe("CreatePost", () => {
    let createPost: CreatePost;
    let postPersistenceRepository: jest.Mocked<PostPersistenceRepository>;
    let postFilePersistenceRepository: jest.Mocked<PostFilePersistenceRepository>;
    let userPersistenceRepository: jest.Mocked<UserPersistenceRepository>;
    let createPostDtoValidator: jest.Mocked<CreatePostDtoValidator>;
    let canCreatePostPolicies: jest.Mocked<CanCreatePostPolicies>;
    let uuidGenerator: jest.Mocked<UUIDGenerator>;

    let dto: CreatePostDto;
    let user: User;
    beforeEach(() => {
        jest.clearAllMocks();
        postPersistenceRepository = mockPostPersistenceRepository() as any;
        postFilePersistenceRepository =
            mockPostFilePersistenceRepository() as any;
        userPersistenceRepository = mockUserPersistenceRepository() as any;
        createPostDtoValidator = mockCreatePostDtoValidator() as any;
        canCreatePostPolicies = mockCanCreatePostPolicies() as any;
        uuidGenerator = mockUUIDGenerator() as any;

        createPost = new CreatePost(
            postPersistenceRepository,
            postFilePersistenceRepository,
            userPersistenceRepository,
            createPostDtoValidator,
            canCreatePostPolicies,
            uuidGenerator,
        );

        dto = new CreatePostDto("Test Title", "user-uuid" as UUID, new Blob());
        user = new User(
            "user-uuid" as UUID,
            "testuser",
            "test@example.com",
            "hashedPassword",
            ["Reader"],
            "Active",
        );
    });

    test("should validate the DTO", async () => {
        await createPost.execute(dto);

        expect(createPostDtoValidator.validate).toHaveBeenCalledWith(dto);
    });

    test("should check user policies", async () => {
        userPersistenceRepository.findByUUID.mockResolvedValue(user);

        await createPost.execute(dto);

        expect(canCreatePostPolicies.check).toHaveBeenCalledWith(user);
    });

    test("should generate a UUID for the post", async () => {
        const mockUUID = "123e4567-e89b-12d3-a456-426614174000" as UUID;
        uuidGenerator.generate.mockReturnValue(mockUUID);

        await createPost.execute(dto);

        expect(uuidGenerator.generate).toHaveBeenCalled();
    });

    test("should create a post with the correct data", async () => {
        const mockUUID = "123e4567-e89b-12d3-a456-426614174000" as UUID;
        uuidGenerator.generate.mockReturnValue(mockUUID);
        userPersistenceRepository.findByUUID.mockResolvedValue(user);
        postFilePersistenceRepository.getRealUrl.mockResolvedValue("realUrl");

        await createPost.execute(dto);

        const expectedPost = new Post(
            mockUUID,
            dto.title,
            dto.user_id,
            expect.any(Date),
            "realUrl",
        );

        expect(postPersistenceRepository.create).toHaveBeenCalledWith(
            expectedPost,
        );
    });

    test("should save the post file", async () => {
        const mockUUID = "123e4567-e89b-12d3-a456-426614174000" as UUID;
        uuidGenerator.generate.mockReturnValue(mockUUID);
        userPersistenceRepository.findByUUID.mockResolvedValue(user);

        await createPost.execute(dto);

        const expectedFileUrl = `${mockUUID}_${dto.title}`;

        expect(postFilePersistenceRepository.save).toHaveBeenCalledWith(
            expectedFileUrl,
            dto.file,
        );
    });

    test("should delete the post if file saving fails", async () => {
        const mockUUID = "123e4567-e89b-12d3-a456-426614174000" as UUID;
        const fileSaveError = new Error("File save failed");

        uuidGenerator.generate.mockReturnValue(mockUUID);
        userPersistenceRepository.findByUUID.mockResolvedValue(user);
        postFilePersistenceRepository.save.mockRejectedValue(fileSaveError);

        await expect(createPost.execute(dto)).rejects.toThrow(fileSaveError);

        expect(postPersistenceRepository.delete).toHaveBeenCalledWith(mockUUID);
    });

    test("should return the created post with the real file URL", async () => {
        const mockUUID = "123e4567-e89b-12d3-a456-426614174000" as UUID;
        const realFileUrl = "https://example.com/path/to/file";

        uuidGenerator.generate.mockReturnValue(mockUUID);
        userPersistenceRepository.findByUUID.mockResolvedValue(user);
        postFilePersistenceRepository.getRealUrl.mockResolvedValue(realFileUrl);

        const result = await createPost.execute(dto);

        const expectedPost = new Post(
            mockUUID,
            dto.title,
            dto.user_id,
            expect.any(Date),
            realFileUrl,
        );

        expect(result).toEqual(expectedPost);
    });

    test("should throw if DTO validation fails", async () => {
        const validationError = new Error("Invalid DTO");

        createPostDtoValidator.validate.mockRejectedValue(validationError);

        await expect(createPost.execute(dto)).rejects.toThrow(validationError);
    });

    test("should throw if user policies check fails", async () => {
        const policyError = new Error("Policy check failed");

        userPersistenceRepository.findByUUID.mockResolvedValue(user);
        canCreatePostPolicies.check.mockImplementation(() => {
            throw policyError;
        });

        await expect(createPost.execute(dto)).rejects.toThrow(policyError);
    });

    test("should throw if user is not found", async () => {
        const userNotFoundError = new Error("User not found");

        userPersistenceRepository.findByUUID.mockRejectedValue(
            userNotFoundError,
        );

        await expect(createPost.execute(dto)).rejects.toThrow(
            userNotFoundError,
        );
    });
});
