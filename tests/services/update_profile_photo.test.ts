import { UUID } from "crypto";
import {
    UpdateProfilePhoto,
    UpdateProfilePhotoDto,
    UpdateProfilePhotoDtoValidator,
    UserProfilePersistenceRepository,
    ProfilePhotoFilePersistenceRepository,
} from "../../src/services";
import { UserProfile } from "../../src/models";
import {
    mockUserProfilePersistenceRepository,
    mockUserProfilePhotoFilePersistenceRepository,
    mockUpdateProfilePhotoDtoValidator,
} from "./dependencies_mocks";
import { jest } from "@jest/globals";

describe("UpdateProfilePhoto", () => {
    let updateProfilePhoto: UpdateProfilePhoto;
    let userProfilePersistenceRepository: jest.Mocked<UserProfilePersistenceRepository>;
    let userProfilePhotoFilePersistenceRepository: jest.Mocked<ProfilePhotoFilePersistenceRepository>;
    let updateProfilePhotoDtoValidator: jest.Mocked<UpdateProfilePhotoDtoValidator>;

    let dto: UpdateProfilePhotoDto;
    let profile: UserProfile;

    beforeEach(() => {
        jest.clearAllMocks();
        userProfilePersistenceRepository =
            mockUserProfilePersistenceRepository() as any;
        userProfilePhotoFilePersistenceRepository =
            mockUserProfilePhotoFilePersistenceRepository() as any;
        updateProfilePhotoDtoValidator =
            mockUpdateProfilePhotoDtoValidator() as any;

        updateProfilePhoto = new UpdateProfilePhoto(
            userProfilePhotoFilePersistenceRepository,
            userProfilePersistenceRepository,
            updateProfilePhotoDtoValidator,
        );

        dto = new UpdateProfilePhotoDto("user-uuid" as UUID, new File([], ""));
        profile = new UserProfile(
            "user-uuid" as UUID,
            "Test Title",
            "Test Bio",
            "Test City",
            "Test Company",
            "Test University",
            "old-photo-url",
        );
    });

    test("should validate the DTO", async () => {
        updateProfilePhotoDtoValidator.validate.mockRejectedValue(
            "validation error",
        );

        try {
            await updateProfilePhoto.execute(dto);
            throw "updateProfile did not throw";
        } catch (e) {
            expect(e).toBe("validation error");
        }
    });

    test("should fetch the profile by user UUID", async () => {
        userProfilePersistenceRepository.findByUserUUID.mockResolvedValue(
            profile,
        );

        await updateProfilePhoto.execute(dto);

        expect(
            userProfilePersistenceRepository.findByUserUUID,
        ).toHaveBeenCalledWith(dto.userUuid);
    });

    test("should delete the old photo if it exists", async () => {
        const old_profile_photo_path = profile.profilePhotoUrl;
        userProfilePersistenceRepository.findByUserUUID.mockResolvedValue(
            profile,
        );

        await updateProfilePhoto.execute(dto);

        expect(
            userProfilePhotoFilePersistenceRepository.delete,
        ).toHaveBeenCalledWith(old_profile_photo_path);
    });

    test("should save the new photo", async () => {
        userProfilePersistenceRepository.findByUserUUID.mockResolvedValue(
            profile,
        );

        await updateProfilePhoto.execute(dto);

        expect(
            userProfilePhotoFilePersistenceRepository.save,
        ).toHaveBeenCalledWith(dto.userUuid, dto.photo);
    });

    test("should update the profile with the new photo URL", async () => {
        userProfilePersistenceRepository.findByUserUUID.mockResolvedValue(
            profile,
        );

        await updateProfilePhoto.execute(dto);

        expect(profile.profilePhotoUrl).toBe(dto.userUuid);
        expect(userProfilePersistenceRepository.update).toHaveBeenCalledWith(
            profile,
        );
    });

    test("should throw if DTO validation fails", async () => {
        const validationError = new Error("Invalid DTO");

        updateProfilePhotoDtoValidator.validate.mockRejectedValue(
            validationError,
        );

        await expect(updateProfilePhoto.execute(dto)).rejects.toThrow(
            validationError,
        );
    });

    test("should throw if profile is not found", async () => {
        const profileNotFoundError = new Error("Profile not found");

        userProfilePersistenceRepository.findByUserUUID.mockRejectedValue(
            profileNotFoundError,
        );

        await expect(updateProfilePhoto.execute(dto)).rejects.toThrow(
            profileNotFoundError,
        );
    });

    test("should not delete the old photo if it does not exist", async () => {
        profile.profilePhotoUrl = undefined;
        userProfilePersistenceRepository.findByUserUUID.mockResolvedValue(
            profile,
        );

        await updateProfilePhoto.execute(dto);

        expect(
            userProfilePhotoFilePersistenceRepository.delete,
        ).not.toHaveBeenCalled();
    });
});
