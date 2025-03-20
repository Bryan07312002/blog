import { UUID } from "crypto";
import {
    RetrievePost,
    PostFilePersistenceRepository,
    PostPersistenceRepository,
} from "../../src/services";
import { Post } from "../../src/models";
import { jest } from "@jest/globals";
import {
    mockPostFilePersistenceRepository,
    mockPostPersistenceRepository,
} from "./dependencies_mocks";

describe("RetrievePost", () => {
    let retrievePost: RetrievePost;
    let postPersistenceRepository: jest.Mocked<PostPersistenceRepository>;
    let postFilePersistenceRepository: jest.Mocked<PostFilePersistenceRepository>;

    let mockUUID: UUID;
    let mockPost: Post;

    beforeEach(() => {
        jest.clearAllMocks();
        postPersistenceRepository = mockPostPersistenceRepository() as any;
        postFilePersistenceRepository =
            mockPostFilePersistenceRepository() as any;

        retrievePost = new RetrievePost(
            postPersistenceRepository,
            postFilePersistenceRepository,
        );

        mockUUID = "123e4567-e89b-12d3-a456-426614174000" as UUID;
        const userUUID = "123e4567-a89b-12d3-a456-426614174000" as UUID;
        mockPost = new Post(
            mockUUID,
            "Test Post",
            userUUID,
            new Date(),
            "fake-file-url",
        );
    });

    test("should retrieve a post and update its file URL", async () => {
        const mockRealUrl = "https://example.com/real-file-url";

        const fakeInitialUrl = mockPost.file_url;

        postPersistenceRepository.findByUUID.mockResolvedValue(mockPost);
        postFilePersistenceRepository.getRealUrl.mockResolvedValue(mockRealUrl);

        const result = await retrievePost.execute(mockUUID);

        expect(postPersistenceRepository.findByUUID).toHaveBeenCalledWith(
            mockUUID,
        );

        expect(postFilePersistenceRepository.getRealUrl).toHaveBeenCalledWith(
            fakeInitialUrl,
        );
        expect(result.file_url).toBe(mockRealUrl);
        expect(result).toEqual({ ...mockPost, file_url: mockRealUrl });
    });

    test("should throw if post retrieval fails", async () => {
        const retrievalError = new Error("Post retrieval failed");

        postPersistenceRepository.findByUUID.mockRejectedValue(retrievalError);

        await expect(retrievePost.execute(mockUUID)).rejects.toThrow(
            retrievalError,
        );
    });

    test("should throw if file URL retrieval fails", async () => {
        const urlRetrievalError = new Error("File URL retrieval failed");

        postPersistenceRepository.findByUUID.mockResolvedValue(mockPost);
        postFilePersistenceRepository.getRealUrl.mockRejectedValue(
            urlRetrievalError,
        );

        await expect(retrievePost.execute(mockUUID)).rejects.toThrow(
            urlRetrievalError,
        );
    });
});
