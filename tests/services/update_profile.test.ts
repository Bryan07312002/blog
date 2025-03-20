import { UUID } from "crypto";
import {
    UpdateProfile,
    UpdateProfileDTO,
    UpdateProfileDtoValidator,
    UserProfilePersistenceRepository,
} from "../../src/services";
import { UserProfile } from "../../src/models";
import {
    mockUserProfilePersistenceRepository,
    mockUpdateProfileDtoValidator,
} from "./dependencies_mocks";
import { jest } from "@jest/globals";

describe("UpdateProfile", () => {
    let updateProfile: UpdateProfile;
    let userProfilePersistenceRepository: jest.Mocked<UserProfilePersistenceRepository>;
    let updateProfileDtoValidator: jest.Mocked<UpdateProfileDtoValidator>;

    let dto: UpdateProfileDTO;
    let profile: UserProfile;

    beforeEach(() => {
        jest.clearAllMocks();
        userProfilePersistenceRepository =
            mockUserProfilePersistenceRepository() as any;
        updateProfileDtoValidator = mockUpdateProfileDtoValidator() as any;

        updateProfile = new UpdateProfile(
            userProfilePersistenceRepository,
            updateProfileDtoValidator,
        );

        dto = new UpdateProfileDTO("user-uuid" as UUID, {
            title: "New Title",
            bio: "New Bio",
            lives_in: "New City",
            works_at: "New Company",
            studie_at: "New University",
        });

        profile = new UserProfile(
            "user-uuid" as UUID,
            "Old Title",
            "Old Bio",
            "Old City",
            "Old Company",
            "Old University",
        );
    });

    test("should throw if validation throws", async () => {
        updateProfileDtoValidator.validate.mockRejectedValue(
            "validation error",
        );

        try {
            await updateProfile.execute(dto);
            throw "updateProfile did not throw";
        } catch (e) {
            expect(e).toBe("validation error");
        }
    });

    test("should fetch the profile by user UUID", async () => {
        userProfilePersistenceRepository.findByUserUUID.mockResolvedValue(
            profile,
        );

        await updateProfile.execute(dto);

        expect(
            userProfilePersistenceRepository.findByUserUUID,
        ).toHaveBeenCalledWith(dto.userUuid);
    });

    test("should update the profile with the new data", async () => {
        userProfilePersistenceRepository.findByUserUUID.mockResolvedValue(
            profile,
        );

        await updateProfile.execute(dto);

        expect(profile.title).toBe(dto.profile.title);
        expect(profile.bio).toBe(dto.profile.bio);
        expect(profile.lives_in).toBe(dto.profile.lives_in);
        expect(profile.works_at).toBe(dto.profile.works_at);
        expect(profile.studie_at).toBe(dto.profile.studie_at);
    });

    test("should save the updated profile", async () => {
        userProfilePersistenceRepository.findByUserUUID.mockResolvedValue(
            profile,
        );

        await updateProfile.execute(dto);

        expect(userProfilePersistenceRepository.update).toHaveBeenCalledWith(
            profile,
        );
    });

    test("should return the updated profile", async () => {
        userProfilePersistenceRepository.findByUserUUID.mockResolvedValue(
            profile,
        );

        const result = await updateProfile.execute(dto);

        expect(result).toEqual(profile);
    });

    test("should throw if DTO validation fails", async () => {
        const validationError = new Error("Invalid DTO");

        updateProfileDtoValidator.validate.mockRejectedValue(validationError);

        await expect(updateProfile.execute(dto)).rejects.toThrow(
            validationError,
        );
    });

    test("should throw if profile is not found", async () => {
        const profileNotFoundError = new Error("Profile not found");

        userProfilePersistenceRepository.findByUserUUID.mockRejectedValue(
            profileNotFoundError,
        );

        await expect(updateProfile.execute(dto)).rejects.toThrow(
            profileNotFoundError,
        );
    });
});
