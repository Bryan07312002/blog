import { UUID } from "crypto";
import {
    PostFilePersistenceRepository,
    PostPersistenceRepository,
    UserPersistenceRepository,
    CanDeletePostPolicies,
    DeletePostDto,
    DeletePost,
} from "../../src/services";
import { Post, Role, State, User } from "../../src/models";
import { jest } from "@jest/globals";
import {
    mockPostPersistenceRepository,
    mockPostFilePersistenceRepository,
    mockUserPersistenceRepository,
    mockCanDeletePostPolicies,
} from "./dependencies_mocks";

describe("DeletePost", () => {
    let deletePost: DeletePost;
    let postPersistenceRepository: jest.Mocked<PostPersistenceRepository>;
    let postFilePersistenceRepository: jest.Mocked<PostFilePersistenceRepository>;
    let userPersistenceRepository: jest.Mocked<UserPersistenceRepository>;
    let canDeletePostPolicies: jest.Mocked<CanDeletePostPolicies>;

    let dto: DeletePostDto;
    let user: User;
    let post: Post;
    beforeEach(() => {
        jest.clearAllMocks();
        postPersistenceRepository = mockPostPersistenceRepository() as any;
        postFilePersistenceRepository =
            mockPostFilePersistenceRepository() as any;
        userPersistenceRepository = mockUserPersistenceRepository() as any;
        canDeletePostPolicies = mockCanDeletePostPolicies() as any;

        deletePost = new DeletePost(
            postPersistenceRepository,
            postFilePersistenceRepository,
            userPersistenceRepository,
            canDeletePostPolicies,
        );

        dto = new DeletePostDto("post-uuid" as UUID, "user-uuid" as UUID);
        user = new User(
            "user-uuid" as UUID,
            "testuser",
            "test@example.com",
            "hashedPassword",
            [Role.Reader],
            State.Active,
        );
        post = new Post(
            "post-uuid" as UUID,
            "Test Title",
            "user-uuid" as UUID,
            new Date(),
            "file-url",
        );
    });

    test("should find the user and post", async () => {
        userPersistenceRepository.findByUUID.mockResolvedValue(user);
        postPersistenceRepository.findByUUID.mockResolvedValue(post);

        await deletePost.execute(dto);

        expect(userPersistenceRepository.findByUUID).toHaveBeenCalledWith(
            dto.user_id,
        );
        expect(postPersistenceRepository.findByUUID).toHaveBeenCalledWith(
            dto.uuid,
        );
    });

    test("should check delete policies for the user and post", async () => {
        userPersistenceRepository.findByUUID.mockResolvedValue(user);
        postPersistenceRepository.findByUUID.mockResolvedValue(post);

        await deletePost.execute(dto);

        expect(canDeletePostPolicies.check).toHaveBeenCalledWith(user, post);
    });

    test("should delete the post and its file", async () => {
        userPersistenceRepository.findByUUID.mockResolvedValue(user);
        postPersistenceRepository.findByUUID.mockResolvedValue(post);

        await deletePost.execute(dto);

        expect(postPersistenceRepository.delete).toHaveBeenCalledWith(
            post.uuid,
        );
        expect(postFilePersistenceRepository.delete).toHaveBeenCalledWith(
            post.file_url,
        );
    });

    test("should throw if user is not found", async () => {
        const userNotFoundError = new Error("User not found");

        userPersistenceRepository.findByUUID.mockRejectedValue(
            userNotFoundError,
        );

        await expect(deletePost.execute(dto)).rejects.toThrow(
            userNotFoundError,
        );
    });

    test("should throw if post is not found", async () => {
        const postNotFoundError = new Error("Post not found");

        userPersistenceRepository.findByUUID.mockResolvedValue(user);
        postPersistenceRepository.findByUUID.mockRejectedValue(
            postNotFoundError,
        );

        await expect(deletePost.execute(dto)).rejects.toThrow(
            postNotFoundError,
        );
    });

    test("should throw if delete policies check fails", async () => {
        const policyError = new Error("Policy check failed");

        userPersistenceRepository.findByUUID.mockResolvedValue(user);
        postPersistenceRepository.findByUUID.mockResolvedValue(post);
        canDeletePostPolicies.check.mockImplementation(() => {
            throw policyError;
        });

        await expect(deletePost.execute(dto)).rejects.toThrow(policyError);
    });

    test("should throw if post deletion fails", async () => {
        const deletionError = new Error("Post deletion failed");

        userPersistenceRepository.findByUUID.mockResolvedValue(user);
        postPersistenceRepository.findByUUID.mockResolvedValue(post);
        postPersistenceRepository.delete.mockRejectedValue(deletionError);

        await expect(deletePost.execute(dto)).rejects.toThrow(deletionError);
    });

    test("should throw if file deletion fails", async () => {
        const fileDeletionError = new Error("File deletion failed");

        userPersistenceRepository.findByUUID.mockResolvedValue(user);
        postPersistenceRepository.findByUUID.mockResolvedValue(post);
        postFilePersistenceRepository.delete.mockRejectedValue(
            fileDeletionError,
        );

        await expect(deletePost.execute(dto)).rejects.toThrow(
            fileDeletionError,
        );
    });
});
