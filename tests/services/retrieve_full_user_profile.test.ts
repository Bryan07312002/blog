import { UUID } from "crypto";
import {
    RetrieveFullUserProfile,
    FullUserProfile,
    UserPersistenceRepository,
    UserProfilePhotoFilePersistenceRepository,
} from "../../src/services";
import {
    mockUserPersistenceRepository,
    mockUserProfilePhotoFilePersistenceRepository,
} from "./dependencies_mocks";
import { jest } from "@jest/globals";

describe("RetrieveFullUserProfile", () => {
    let retrieveFullUserProfile: RetrieveFullUserProfile;
    let userPersistenceRepository: jest.Mocked<UserPersistenceRepository>;
    let userProfilePhotoFilePersistenceRepository: jest.Mocked<UserProfilePhotoFilePersistenceRepository>;

    let userUuid: UUID;
    let fullUserProfile: FullUserProfile;

    beforeEach(() => {
        jest.clearAllMocks();
        userPersistenceRepository = mockUserPersistenceRepository() as any;
        userProfilePhotoFilePersistenceRepository =
            mockUserProfilePhotoFilePersistenceRepository() as any;

        retrieveFullUserProfile = new RetrieveFullUserProfile(
            userPersistenceRepository,
            userProfilePhotoFilePersistenceRepository,
        );

        userUuid = "user-uuid" as UUID;
        fullUserProfile = new FullUserProfile(
            userUuid,
            "testuser",
            "test@example.com",
            ["Reader"],
            "Active",
            "Test Title",
            "Test Bio",
            "photo-url",
            "Test City",
            "Test Company",
            "Test University",
        );
    });

    test("should fetch the full user profile by UUID", async () => {
        userPersistenceRepository.findFullUserByUUID.mockResolvedValue(
            fullUserProfile,
        );

        const result = await retrieveFullUserProfile.execute(userUuid);

        expect(
            userPersistenceRepository.findFullUserByUUID,
        ).toHaveBeenCalledWith(userUuid);
        expect(result).toEqual(fullUserProfile);
    });

    test("should update the photo URL if it exists", async () => {
        const realPhotoUrl = "https://example.com/real-photo-url";
        userPersistenceRepository.findFullUserByUUID.mockResolvedValue(
            fullUserProfile,
        );
        userProfilePhotoFilePersistenceRepository.getRealUrl.mockResolvedValue(
            realPhotoUrl,
        );

        const oldUrl = fullUserProfile.photo_url;
        const result = await retrieveFullUserProfile.execute(userUuid);

        expect(
            userProfilePhotoFilePersistenceRepository.getRealUrl,
        ).toHaveBeenCalledWith(oldUrl);
        expect(result.photo_url).toBe(realPhotoUrl);
    });

    test("should not update the photo URL if it does not exist", async () => {
        fullUserProfile.photo_url = undefined;
        userPersistenceRepository.findFullUserByUUID.mockResolvedValue(
            fullUserProfile,
        );

        const result = await retrieveFullUserProfile.execute(userUuid);

        expect(
            userProfilePhotoFilePersistenceRepository.getRealUrl,
        ).not.toHaveBeenCalled();
        expect(result.photo_url).toBeUndefined();
    });

    test("should handle errors when fetching the real photo URL", async () => {
        userPersistenceRepository.findFullUserByUUID.mockResolvedValue(
            fullUserProfile,
        );
        userProfilePhotoFilePersistenceRepository.getRealUrl.mockRejectedValue(
            new Error("Failed to fetch URL"),
        );

        const result = await retrieveFullUserProfile.execute(userUuid);

        expect(
            userProfilePhotoFilePersistenceRepository.getRealUrl,
        ).toHaveBeenCalledWith(fullUserProfile.photo_url);
        expect(result.photo_url).toBe(fullUserProfile.photo_url); // Should remain unchanged
    });

    test("should throw if the user is not found", async () => {
        const userNotFoundError = new Error("User not found");
        userPersistenceRepository.findFullUserByUUID.mockRejectedValue(
            userNotFoundError,
        );

        await expect(retrieveFullUserProfile.execute(userUuid)).rejects.toThrow(
            userNotFoundError,
        );
    });
});
